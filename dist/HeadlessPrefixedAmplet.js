"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HeadlessAmplet_1 = require("./HeadlessAmplet");
const ByteBuffer = require("bytebuffer");
const ByteTools_1 = require("./ByteTools");
class HeadlessPrefixedAmplet {
    constructor(bytes) {
        this._validHeadlessPrefixedAmplet = false;
        if (bytes) {
            this._hamplet = HeadlessAmplet_1.HeadlessAmplet.createFromByteBuffer(bytes);
            if (this._hamplet) {
                this._validHeadlessPrefixedAmplet = true;
            }
        }
        else {
            this._hamplet = HeadlessAmplet_1.HeadlessAmplet.createFromHeadlessAmplet();
            this._validHeadlessPrefixedAmplet = true;
        }
    }
    static createFromHeadlessPrefixedAmplet() {
        return new HeadlessPrefixedAmplet();
    }
    static createFromBytes(bytes) {
        return new HeadlessPrefixedAmplet(bytes);
    }
    addBytes(bytes) {
        if (!bytes) {
            this._hamplet.addElementByte(1);
            this._hamplet.addElementByte(0);
            return true;
        }
        let size = bytes.buffer.length;
        if (size === 0) {
            this._hamplet.addElementByte(1);
            this._hamplet.addElementByte(0);
            return true;
        }
        let prefixSize;
        if (size < 256) {
            prefixSize = 1;
        }
        else if (size < 65536) {
            prefixSize = 2;
        }
        else {
            prefixSize = 4;
        }
        this._hamplet.addElementByte(prefixSize);
        if (prefixSize === 4) {
            this._hamplet.addElementInt(size);
        }
        else if (prefixSize === 2) {
            this._hamplet.addElementShort(size);
        }
        else if (prefixSize === 1) {
            this._hamplet.addElementByte(size);
        }
        this._hamplet.addBytes(bytes);
        return true;
    }
    addElementByte(value) {
        return this.addBytes(ByteBuffer.allocate(1).writeByte(value));
    }
    addElementBoolean(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructBoolean(value));
    }
    addElementShort(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructShort(value));
    }
    addElementChar(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructChar(value));
    }
    addElementInt(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructInt(value));
    }
    addElementLong(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructLong(value));
    }
    addElementString(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructString(value));
    }
    addElementBigNumber(value) {
        return this.addBytes(ByteTools_1.ByteTools.deconstructBigNumber(value));
    }
    addElementIAmpByteSerializable(value) {
        if (value) {
            return this.addBytes(value.serializeToBytes());
        }
        return false;
    }
    addElementIAmpAmpletSerializable(value) {
        if (value) {
            let temp = value.serializeToAmplet();
            if (temp) {
                return this.addBytes(temp.serializeToBytes());
            }
        }
        return false;
    }
    resetCursor() {
        this._hamplet.resetCursor();
    }
    setCursor(index) {
        this._hamplet.cursor = index;
    }
    getCursor() {
        return this._hamplet.cursor;
    }
    getMaxCursorPosition() {
        return this._hamplet.getMaxCursorPosition();
    }
    getCurrentSize() {
        return this._hamplet.getCurrentSize();
    }
    ensureCapacity(minCap) {
        this._hamplet.ensureCapacity(minCap);
    }
    setGrowMode(growMode) {
        this._hamplet.setGrowMode(growMode);
    }
    getGrowMode() {
        return this._hamplet.getGrowMode();
    }
    trimToSize() {
        this._hamplet.trimToSize();
    }
    hasNextElement() {
        let element = this.peekNextElement();
        return (element != null && element.buffer.length > 0);
    }
    getNextElement() {
        let cursor = this._hamplet.cursor;
        let prefixSize = this._hamplet.getNextByte();
        if (!prefixSize) {
            this._hamplet.cursor = cursor;
            return ByteBuffer.allocate(0);
        }
        if (prefixSize === 4) {
            let size = this._hamplet.getNextInt();
            if (size == null) {
                this._hamplet.cursor = cursor;
                return ByteBuffer.allocate(0);
            }
            return this._hamplet.getNextNBytes(size);
        }
        else if (prefixSize === 2) {
            let size = this._hamplet.getNextShort();
            if (size == null) {
                this._hamplet.cursor = cursor;
                return ByteBuffer.allocate(0);
            }
            return this._hamplet.getNextNBytes(size);
        }
        else if (prefixSize === 1) {
            let size = this._hamplet.getNextUnsignedByte();
            if (size == null) {
                this._hamplet.cursor = cursor;
                return ByteBuffer.allocate(0);
            }
            return this._hamplet.getNextNBytes(size);
        }
        else {
            this._hamplet.cursor = cursor;
            return ByteBuffer.allocate(0);
        }
    }
    peekNextElement() {
        let cursor = this._hamplet.cursor;
        let bytes = this.getNextElement();
        this._hamplet.cursor = cursor;
        return bytes;
    }
    skipNextElement() {
        let element = this.getNextElement();
        return (element != null);
    }
    deleteNextElement() {
        let cursor = this._hamplet.cursor;
        let byteCount = 0;
        let prefixSize = this._hamplet.getNextByte();
        byteCount += 1;
        if (!prefixSize) {
            this._hamplet.cursor = cursor;
            return false;
        }
        if (prefixSize === 4) {
            let size = this._hamplet.getNextInt();
            byteCount += prefixSize;
            if (!size) {
                this._hamplet.cursor = cursor;
                return false;
            }
            byteCount += size;
        }
        else if (prefixSize === 2) {
            let size = this._hamplet.getNextShort();
            byteCount += prefixSize;
            if (!size) {
                this._hamplet.cursor = cursor;
                return false;
            }
            byteCount += size;
        }
        else if (prefixSize === 1) {
            let size = this._hamplet.getNextByte();
            byteCount += prefixSize;
            if (!size) {
                this._hamplet.cursor = cursor;
                return false;
            }
            byteCount += size;
        }
        else {
            this._hamplet.cursor = cursor;
            return false;
        }
        this._hamplet.cursor = cursor;
        this._hamplet.deleteNextNBytes(byteCount);
        return true;
    }
    getNextElementAsHeadlessAmplet() {
        let nextElement = this.getNextElement();
        return HeadlessAmplet_1.HeadlessAmplet.createFromByteBuffer(nextElement);
    }
    peekNextElementAsHeadlessAmplet() {
        let nextElement = this.peekNextElement();
        return HeadlessAmplet_1.HeadlessAmplet.createFromByteBuffer(nextElement);
    }
    getByteFootprint() {
        return this._hamplet.getByteFootprint();
    }
    get validHeadlessPrefixedAmplet() {
        return this._validHeadlessPrefixedAmplet;
    }
    serializeToBytes() {
        return this._hamplet.serializeToBytes();
    }
}
exports.HeadlessPrefixedAmplet = HeadlessPrefixedAmplet;
