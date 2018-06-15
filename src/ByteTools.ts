
import ByteBuffer = require("bytebuffer");
import {AmpConstants} from "./AmpConstants";
import {GroupID} from "./Groups";
import BigNumber from "bignumber.js";
import Long = require("long");

export class ByteTools {

    public static buildUnsignedByte(_a: number) :number {
        return ByteBuffer.allocate(1).writeByte(_a).readUint8(0);
    }

    public static buildBoolean(_a: number) : boolean {
        return _a === 1;
    }

    public static buildShort(_a: number, _b: number): number {
        return ByteBuffer.allocate(2).writeByte(_a).writeByte(_b).readInt16(0);
    }

    public static buildChar(_a: number, _b: number): string {
        return ByteBuffer.allocate(2).writeByte(_a).writeByte(_b).readString(1, ByteBuffer.METRICS_CHARS, 0);
    }

    public static buildUnsignedInt(_a: number, _b: number, _c: number, _d: number): number {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readInt32(0)
    }

    public static buildInt(_a: number, _b: number, _c: number, _d: number): number {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readInt32(0)
    }

    public static buildFloat(_a: number, _b: number, _c: number, _d: number): number {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readFloat32(0)
    }

    public static buildLong(_a: number, _b: number, _c: number, _d: number, _e: number, _f: number, _g: number, _h: number): Long {
        return ByteBuffer.allocate(8).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).writeByte(_e).writeByte(_f).writeByte(_g).writeByte(_h).readLong(0)
    }

    public static buildDouble(_a: number, _b: number, _c: number, _d: number, _e: number, _f: number, _g: number, _h: number): number {
        return ByteBuffer.allocate(8).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).writeByte(_e).writeByte(_f).writeByte(_g).writeByte(_h).readDouble(0)
    }

    public static buildString(_value: ByteBuffer): string {
        if (_value.buffer.length === 1) {
            if (_value.buffer[0] === 0) {
                return ''
            }
        }
        return _value.toUTF8()
    }

    public static buildHexString(array: ByteBuffer): string {
        array.clear();
        return array.toHex();
    }
    
    public static buildBigNumber(_value: ByteBuffer): BigNumber {
        if (_value.buffer[0] > 127) {
            let power = _value.buffer.length * 8;
            return (new BigNumber(_value.toHex(), 16)).minus((new BigNumber(2)).exponentiatedBy(power));
        } else {
            return new BigNumber(_value.toHex(), 16);
        }
    }

    public static deconstructUnsignedByte(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.BYTE_BYTE_FOOTPRINT).writeByte(_value).clear()
    }

    public static deconstructBoolean(_value: boolean): ByteBuffer {
        if (_value) {
            return ByteBuffer.allocate(AmpConstants.BOOLEAN_BYTE_FOOTPRINT).writeByte(1).clear()
        }
        return ByteBuffer.allocate(AmpConstants.BOOLEAN_BYTE_FOOTPRINT).writeByte(0).clear()
    }

    public static deconstructShort(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.SHORT_BYTE_FOOTPRINT).writeShort(_value).clear()
    }

    public static deconstructChar(_value: string): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.SHORT_BYTE_FOOTPRINT).writeCString(_value).clear()
    }

    public static deconstructUnsignedInt(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.INT_BYTE_FOOTPRINT).writeUint32(_value).clear()
    }

    public static deconstructInt(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.INT_BYTE_FOOTPRINT).writeInt32(_value).clear()
    }

    public static deconstructFloat(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.FLOAT_BYTE_FOOTPRINT).writeFloat32(_value).clear()
    }

    public static deconstructLong(_value: BigNumber): ByteBuffer {
        if (_value.lt(new BigNumber(AmpConstants.MAX_LONG, 16)) &&  _value.gt(new BigNumber(AmpConstants.MIN_LONG, 16))) {
            let ln = ByteTools.deconstructBigNumberLong(_value);
            let len = ln.buffer.length;
            let b = ByteBuffer.allocate(8);
            if (len === 8) {
                return ln;
            } else if (len > 0) {
                if (ln.buffer[0] > 127) {
                    b.fill(255);
                } else {
                    b.fill(0);
                }
                ln.copyTo(b, 8 - len, 0, len);
                return b.clear();
            }
        }

    }

    public static deconstructDouble(_value: number): ByteBuffer {
        return ByteBuffer.allocate(AmpConstants.DOUBLE_BYTE_FOOTPRINT).writeDouble(_value).clear()
    }

    public static deconstructString(_value: string): ByteBuffer {
        return ByteBuffer.fromUTF8(_value)
    }

    private static deconstructBigNumberLong(_value: BigNumber) {
        let num = _value.toString(16);
        if (_value.lt(0)) {
            let power = _value.times(-1).toString(16).length * 4;
            num = (new BigNumber(2)).exponentiatedBy(power).plus(_value).toString(16);
        } else {
            if (parseInt(num[0], 16) > 7) {
                num = '00' + num;
            }
        }
        if (num.length % 2 === 1) {
            num = '0' + num
        }
        return ByteBuffer.fromHex(num)
    }

    // should be compatible with java biginteger
    // appends a 0 byte if leading nibble is more than 0x7
    public static deconstructBigNumber(_value: BigNumber): ByteBuffer {
        let num = _value.toString(16);
        if (num[0] === '-') {
            let len = (num.length - 1) / 2;
            if (parseInt(num[1] + num[2], 16) > 127) {
                len += 1;
            }
            num = (new BigNumber(2)).exponentiatedBy(8 * len).plus(_value).toString(16);
            if (num.length % 2 === 1) {
                num = 'f' + num
            }
        } else {
            if (parseInt(num[0] + num[1], 16) > 127) {
                num = '00' + num;
            }
        }
        if (num.length % 2 === 1) {
            num = '0' + num
        }
        return ByteBuffer.fromHex(num)
    }

    public static concatenateShorts(_a: number, _b:number): number {
        let a = ByteTools.deconstructShort(_a).buffer;
        let b = ByteTools.deconstructShort(_b).buffer;
        return this.buildInt(a[0], a[1], b[0], b[1]);
    }

    public static deconcatenateShorts(_value:number): number[] {
        let bytes = ByteTools.deconstructInt(_value).buffer
        return [
            ByteTools.buildShort(bytes[0], bytes[1]),
            ByteTools.buildShort(bytes[2], bytes[3])
        ]
    }

    public static writeLockClassID(_classID: Long): Long {
        return _classID.or(AmpConstants.WRITE_LOCK_MARKER);
    }

    public static isClassIDWriteLocked(_classID: Long): boolean {
        return (_classID.and(AmpConstants.WRITE_LOCK_MARKER)).equals(AmpConstants.WRITE_LOCK_MARKER);
    }

    public static amplifyClassID(_classID: Long): Long {
        return _classID.or(AmpConstants.AMPLET_CLASS_MARKER);
    }

    public static isClassIDAmplified(_classID: Long): boolean {
        return (_classID.and(AmpConstants.AMPLET_CLASS_MARKER)).equals(AmpConstants.AMPLET_CLASS_MARKER);
    }

    public static writeLockGroupID(_groupID: GroupID): GroupID | undefined {
        if (_groupID != null) {
            let classID = ByteTools.writeLockClassID(new Long(_groupID.classID));
            return new GroupID(classID.toInt(), _groupID.classInstanceID, _groupID.name)
        }
        return undefined;
    }
}