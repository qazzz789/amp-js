import {ByteList} from "./Backings/ByteList";
import ByteBuffer = require("bytebuffer");
import {GrowModeEnum} from "./Backings/GrowModeEnum";
import {AmpConstants} from "./AmpConstants";
import {Amplet} from "./Amplet";
import {ByteTools} from "./ByteTools";
import BigNumber from "bignumber.js";
import {IAmpAmpletSerializable, IAmpByteSerializable} from "./Serialization";
import {BadArgumentException} from "./Exceptions";

export class HeadlessAmplet implements IAmpByteSerializable {

    private _bytes: ByteList;
    private _cursor: number = 0;
    private _sealed: boolean = false;
    private _validHeadlessAmplet: boolean = false;

    constructor(hamplet?: HeadlessAmplet, bytes?: ByteBuffer) {
        this._bytes = new ByteList();
        if (hamplet) {
            hamplet.seal()
            this.seal()
            this._bytes = hamplet.bytes
        } else if (bytes) {
            if (bytes.buffer.length > 0) {
                this._bytes = new ByteList(bytes);
            } else {
                throw new BadArgumentException("Null _bytes argument was passed into HeadlessAmplet().");
            }
        }
        this._validHeadlessAmplet = true;
    }

    public static createFromHeadlessAmplet(): HeadlessAmplet {
        return new HeadlessAmplet()
    }

    public static createFromByteBuffer(bytes: ByteBuffer): HeadlessAmplet {
        return new HeadlessAmplet(undefined, bytes)
    }

    public static createFromTwin(hamplet: HeadlessAmplet): HeadlessAmplet {
        return new HeadlessAmplet(hamplet);
    }

    public addBytes(bytes: ByteBuffer): boolean {
        if (bytes) {
            if (!this._sealed) {
                this._bytes.addAll(bytes)
            }
        }
        return false;
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
        this._cursor = 0;
    }

    get bytes(): ByteList {
        return this._bytes;
    }

    get cursor(): number {
        return this._cursor;
    }

    set cursor(value: number) {
        if (value >= this._bytes.size) {
            value = this._bytes.size - 1
        }

        if (value < 0) {
            value = 0;
        }
        this._cursor = value;
    }

    public getMaxCursorPosition(): number {
        return this.getCurrentSize();
    }

    public getCurrentSize(): number {
        return this._bytes.size - 1;
    }

    public ensureCapacity(minCap: number) {
        let currentGrowMode: GrowModeEnum = this._bytes.getGrowMode
        this._bytes.setGrowMode(GrowModeEnum.NATURAL)
        this._bytes.ensureCapacity(minCap)
        this._bytes.setGrowMode(currentGrowMode)
    }

    public setGrowMode(growMode: GrowModeEnum) {
        this._bytes.setGrowMode(growMode)
    }

    public getGrowMode(): GrowModeEnum {
        return this._bytes.getGrowMode
    }

    public trimToSize() {
        this._bytes.trimToSize()
    }

    public deleteNextNBytes(n: number): boolean {
        let count = this._bytes.size
        if (n < 1) {
            return false;
        }
        if ((this._cursor + n) > count) {
            return false;
        }
        this._bytes.removeNBytes(this._cursor, n);
        return true;
    }

    public getNextNBytes(n: number): ByteBuffer {
        let count = this._bytes.size
        if (n === 0) {
            return ByteBuffer.allocate(1)
        }
        if (n < 0) {
            return ByteBuffer.allocate(0);
        }
        if ((this._cursor + n) > count) {
            return ByteBuffer.allocate(0)
        }
        let temp = this._bytes.getNBytes(this._cursor, n);
        this._cursor += n;
        return temp;
    }

    // will cast byte to int so numbers above 7f will be a negative number
    public getNextByte(): number | undefined {
        let temp = this.getNextNBytes(AmpConstants.BYTE_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return temp.readByte(0)
        }
    }

    // will not cast values above 7F to negative numbers
    public getNextUnsignedByte(): number | undefined {
        let temp = this.getNextNBytes(AmpConstants.BYTE_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return temp.readUint8(0)
        }
    }

    public getNextBoolean(): boolean | undefined {
        return this.getNextByte() === 1
    }

    public getNextShort(): number | undefined {
        let temp = this.getNextNBytes(AmpConstants.SHORT_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.SHORT_BYTE_FOOTPRINT) {
            return temp.readInt16(0)
        }
    }

    public getNextCharacter(): string | undefined {
        let temp = this.getNextNBytes(AmpConstants.SHORT_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.SHORT_BYTE_FOOTPRINT) {
            return temp.readString(1, ByteBuffer.METRICS_CHARS, 0)
        }
    }

    public getNextInt(): number | undefined {
        let temp = this.getNextNBytes(AmpConstants.INT_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.INT_BYTE_FOOTPRINT) {
            return temp.readInt32(0)
        }
    }

    public  getNextLong(): BigNumber | undefined {
        let temp = this.getNextNBytes(AmpConstants.LONG_BYTE_FOOTPRINT)
        if (temp != null && temp.buffer.length === AmpConstants.LONG_BYTE_FOOTPRINT) {
            return ByteTools.buildBigNumber(temp)
        }
    }

    public getNextString(n: number): string | undefined {
        let temp = this.getNextNBytes(n);
        if (temp != null && temp.buffer.length === n) {
            return temp.readString(n, ByteBuffer.METRICS_CHARS, 0)
        }
    }

    public getNextBigNumber(n: number): BigNumber | undefined {
        let temp = this.getNextNBytes(n);
        if (temp.buffer.length === n) {
            return ByteTools.buildBigNumber(temp)
        }
    }

    public getNextAmplet(n: number): Amplet {
        return Amplet.createFromBytes(this.getNextNBytes(n).clone(true))
    }

    public getByteFootprint(): number {
        return this._bytes.size
    }

    public isValidHeadlessAmplet(): boolean {
        return this._validHeadlessAmplet
    }

    public isSealed(): boolean {
        return this._sealed;
    }

    public seal() {
        this._sealed = true;
    }

    serializeToBytes(): ByteBuffer {
        let count = this._bytes.size
        if (count === 0) {
            return ByteBuffer.allocate(1)
        }
        let temp = ByteBuffer.allocate(count);
        this._bytes.toArray().copyTo(temp, 0, 0, count);
        return temp
    }
}