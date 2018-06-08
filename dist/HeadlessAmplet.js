"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteList_1 = require("./Backings/ByteList");
const ByteBuffer = require("bytebuffer");
const GrowModeEnum_1 = require("./Backings/GrowModeEnum");
const AmpConstants_1 = require("./AmpConstants");
const Amplet_1 = require("./Amplet");
const ByteTools_1 = require("./ByteTools");
const Exceptions_1 = require("./Exceptions");
class HeadlessAmplet {
    constructor(hamplet, bytes) {
        this._cursor = 0;
        this._sealed = false;
        this._validHeadlessAmplet = false;
        this._bytes = new ByteList_1.ByteList();
        if (hamplet) {
            hamplet.seal();
            this.seal();
            this._bytes = hamplet.bytes;
        }
        else if (bytes) {
            if (bytes.buffer.length > 0) {
                this._bytes = new ByteList_1.ByteList(bytes);
            }
            else {
                throw new Exceptions_1.BadArgumentException("Null _bytes argument was passed into HeadlessAmplet().");
            }
        }
        this._validHeadlessAmplet = true;
    }
    static createFromHeadlessAmplet() {
        return new HeadlessAmplet();
    }
    static createFromByteBuffer(bytes) {
        return new HeadlessAmplet(undefined, bytes);
    }
    static createFromTwin(hamplet) {
        return new HeadlessAmplet(hamplet);
    }
    addBytes(bytes) {
        if (bytes) {
            if (!this._sealed) {
                this._bytes.addAll(bytes);
            }
        }
        return false;
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
        this._cursor = 0;
    }
    get bytes() {
        return this._bytes;
    }
    get cursor() {
        return this._cursor;
    }
    set cursor(value) {
        if (value >= this._bytes.size) {
            value = this._bytes.size - 1;
        }
        if (value < 0) {
            value = 0;
        }
        this._cursor = value;
    }
    getMaxCursorPosition() {
        return this.getCurrentSize();
    }
    getCurrentSize() {
        return this._bytes.size - 1;
    }
    ensureCapacity(minCap) {
        let currentGrowMode = this._bytes.getGrowMode;
        this._bytes.setGrowMode(GrowModeEnum_1.GrowModeEnum.NATURAL);
        this._bytes.ensureCapacity(minCap);
        this._bytes.setGrowMode(currentGrowMode);
    }
    setGrowMode(growMode) {
        this._bytes.setGrowMode(growMode);
    }
    getGrowMode() {
        return this._bytes.getGrowMode;
    }
    trimToSize() {
        this._bytes.trimToSize();
    }
    deleteNextNBytes(n) {
        let count = this._bytes.size;
        if (n < 1) {
            return false;
        }
        if ((this._cursor + n) > count) {
            return false;
        }
        this._bytes.removeNBytes(this._cursor, n);
        return true;
    }
    getNextNBytes(n) {
        let count = this._bytes.size;
        if (n === 0) {
            return ByteBuffer.allocate(1);
        }
        if (n < 0) {
            return ByteBuffer.allocate(0);
        }
        if ((this._cursor + n) > count) {
            return ByteBuffer.allocate(0);
        }
        let temp = this._bytes.getNBytes(this._cursor, n);
        this._cursor += n;
        return temp;
    }
    // will cast byte to int so numbers above 7f will be a negative number
    getNextByte() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return temp.readByte(0);
        }
    }
    // will not cast values above 7F to negative numbers
    getNextUnsignedByte() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return temp.readUint8(0);
        }
    }
    getNextBoolean() {
        return this.getNextByte() === 1;
    }
    getNextShort() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT) {
            return temp.readInt16(0);
        }
    }
    getNextCharacter() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT) {
            return temp.readString(1, ByteBuffer.METRICS_CHARS, 0);
        }
    }
    getNextInt() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT) {
            return temp.readInt32(0);
        }
    }
    getNextLong() {
        let temp = this.getNextNBytes(AmpConstants_1.AmpConstants.LONG_BYTE_FOOTPRINT);
        if (temp != null && temp.buffer.length === AmpConstants_1.AmpConstants.LONG_BYTE_FOOTPRINT) {
            return ByteTools_1.ByteTools.buildBigNumber(temp);
        }
    }
    getNextString(n) {
        let temp = this.getNextNBytes(n);
        if (temp != null && temp.buffer.length === n) {
            return temp.readString(n, ByteBuffer.METRICS_CHARS, 0);
        }
    }
    getNextBigNumber(n) {
        let temp = this.getNextNBytes(n);
        if (temp.buffer.length === n) {
            return ByteTools_1.ByteTools.buildBigNumber(temp);
        }
    }
    getNextAmplet(n) {
        return Amplet_1.Amplet.createFromBytes(this.getNextNBytes(n).clone(true));
    }
    getByteFootprint() {
        return this._bytes.size;
    }
    isValidHeadlessAmplet() {
        return this._validHeadlessAmplet;
    }
    isSealed() {
        return this._sealed;
    }
    seal() {
        this._sealed = true;
    }
    serializeToBytes() {
        let count = this._bytes.size;
        if (count === 0) {
            return ByteBuffer.allocate(1);
        }
        let temp = ByteBuffer.allocate(count);
        this._bytes.toArray().copyTo(temp, 0, 0, count);
        return temp;
    }
}
exports.HeadlessAmplet = HeadlessAmplet;
