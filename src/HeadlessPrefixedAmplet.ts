import {HeadlessAmplet} from "./HeadlessAmplet";
import ByteBuffer = require("bytebuffer");
import {ByteTools} from "./ByteTools";
import BigNumber from "bignumber.js";
import {GrowModeEnum} from "./Backings/GrowModeEnum";
import {IAmpAmpletSerializable, IAmpByteSerializable} from "./Serialization";
import Long = require("long");

export class HeadlessPrefixedAmplet implements IAmpByteSerializable {

    private _hamplet: HeadlessAmplet;
    private _validHeadlessPrefixedAmplet: boolean = false;

    private constructor(bytes?: ByteBuffer) {
        if (bytes) {
            this._hamplet = HeadlessAmplet.createFromByteBuffer(bytes)
            if (this._hamplet) {
                this._validHeadlessPrefixedAmplet = true;
            }
        } else {
            this._hamplet = HeadlessAmplet.createFromHeadlessAmplet()
            this._validHeadlessPrefixedAmplet = true;
        }
    }

    public static createFromHeadlessPrefixedAmplet(): HeadlessPrefixedAmplet {
        return new HeadlessPrefixedAmplet()
    }

    public static createFromBytes(bytes: ByteBuffer): HeadlessPrefixedAmplet {
        return new HeadlessPrefixedAmplet(bytes);
    }

    public addBytes(bytes: ByteBuffer): boolean {
        if (!bytes) {
            this._hamplet.addElementByte(1);
            this._hamplet.addElementByte(0);
            return true;
        }

        let size: number = bytes.buffer.length;

        if (size === 0) {
            this._hamplet.addElementByte(1);
            this._hamplet.addElementByte(0);
            return true;
        }

        let prefixSize: number;

        if (size < 256) {
            prefixSize = 1;
        } else if (size < 65536) {
            prefixSize = 2;
        } else {
            prefixSize = 4;
        }

        this._hamplet.addElementByte(prefixSize);

        if (prefixSize === 4) {
            this._hamplet.addElementInt(size);
        } else if (prefixSize === 2) {
            this._hamplet.addElementShort(size);
        } else if (prefixSize === 1) {
            this._hamplet.addElementByte(size);
        }

        this._hamplet.addBytes(bytes);
        return true;
    }

    public addElementByte(value: number): boolean {
        return this.addBytes(ByteBuffer.allocate(1).writeByte(value))
    }

    public addElementBoolean(value: boolean): boolean {
        return this.addBytes(ByteTools.deconstructBoolean(value))
    }

    public addElementShort(value: number): boolean {
        return this.addBytes(ByteTools.deconstructShort(value))
    }

    public addElementChar(value: string): boolean {
        return this.addBytes(ByteTools.deconstructChar(value))
    }

    public addElementInt(value: number): boolean {
        return this.addBytes(ByteTools.deconstructInt(value))
    }

    public addElementLong(value: BigNumber): boolean {
        return this.addBytes(ByteTools.deconstructLong(value))
    }

    public addElementString(value: string): boolean {
        return this.addBytes(ByteTools.deconstructString(value))
    }

    public addElementBigNumber(value: BigNumber): boolean {
        return this.addBytes(ByteTools.deconstructBigNumber(value))
    }

    public addElementIAmpByteSerializable(value: IAmpByteSerializable): boolean {
        if (value) {
            return this.addBytes(value.serializeToBytes())
        }
        return false;
    }

    public addElementIAmpAmpletSerializable(value: IAmpAmpletSerializable): boolean {
        if (value) {
            let temp = value.serializeToAmplet()
            if (temp) {
                return this.addBytes(temp.serializeToBytes())
            }
        }
        return false
    }

    public resetCursor() {
        this._hamplet.resetCursor()
    }

    public setCursor(index: number) {
        this._hamplet.cursor = index
    }

    public getCursor(): number {
        return this._hamplet.cursor
    }

    public getMaxCursorPosition(): number {
        return this._hamplet.getMaxCursorPosition()
    }

    public getCurrentSize(): number {
        return this._hamplet.getCurrentSize()
    }

    public ensureCapacity(minCap: number) {
        this._hamplet.ensureCapacity(minCap)
    }

    public setGrowMode(growMode: GrowModeEnum) {
        this._hamplet.setGrowMode(growMode)
    }

    public getGrowMode(): GrowModeEnum {
        return this._hamplet.getGrowMode()
    }

    public trimToSize() {
        this._hamplet.trimToSize()
    }

    public hasNextElement(): boolean {
        let element = this.peekNextElement();
        return (element != null && element.buffer.length > 0)
    }

    public getNextElement(): ByteBuffer {
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
            return this._hamplet.getNextNBytes(size)
        } else if (prefixSize === 2) {
            let size = this._hamplet.getNextShort();
            if (size == null) {
                this._hamplet.cursor = cursor;
                return ByteBuffer.allocate(0);
            }
            return this._hamplet.getNextNBytes(size);
        } else if (prefixSize === 1) {
            let size = this._hamplet.getNextUnsignedByte();
            if (size == null) {
                this._hamplet.cursor = cursor;
                return ByteBuffer.allocate(0);
            }
            return this._hamplet.getNextNBytes(size);
        } else {
            this._hamplet.cursor = cursor;
            return ByteBuffer.allocate(0);
        }
    }

    public peekNextElement(): ByteBuffer {
        let cursor: number = this._hamplet.cursor;
        let bytes = this.getNextElement();
        this._hamplet.cursor = cursor;
        return bytes;
    }

    public skipNextElement(): boolean {
        let element = this.getNextElement();
        return (element != null);
    }

    public deleteNextElement(): boolean {
        let cursor = this._hamplet.cursor;
        let byteCount: number = 0;
        let prefixSize = this._hamplet.getNextByte()
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
        } else if (prefixSize === 2) {
            let size = this._hamplet.getNextShort();
            byteCount += prefixSize;
            if (!size) {
                this._hamplet.cursor = cursor;
                return false;
            }
            byteCount += size;
        } else if (prefixSize === 1) {
            let size = this._hamplet.getNextByte();
            byteCount += prefixSize;
            if (!size) {
                this._hamplet.cursor = cursor;
                return false;
            }
            byteCount += size;
        } else {
            this._hamplet.cursor = cursor;
            return false;
        }
        this._hamplet.cursor = cursor;
        this._hamplet.deleteNextNBytes(byteCount);
        return true;
    }

    public getNextElementAsHeadlessAmplet(): HeadlessAmplet {
        let nextElement = this.getNextElement();
        return HeadlessAmplet.createFromByteBuffer(nextElement)
    }

    public peekNextElementAsHeadlessAmplet(): HeadlessAmplet {
        let nextElement = this.peekNextElement();
        return HeadlessAmplet.createFromByteBuffer(nextElement)
    }

    public getByteFootprint(): number {
        return this._hamplet.getByteFootprint()
    }

    get validHeadlessPrefixedAmplet(): boolean {
        return this._validHeadlessPrefixedAmplet;
    }

    serializeToBytes(): ByteBuffer {
        return this._hamplet.serializeToBytes();
    }
}