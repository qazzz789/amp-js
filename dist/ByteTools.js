"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer = require("bytebuffer");
const AmpConstants_1 = require("./AmpConstants");
const Groups_1 = require("./Groups");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Long = require("long");
class ByteTools {
    static buildUnsignedByte(_a) {
        return ByteBuffer.allocate(1).writeByte(_a).readUint8(0);
    }
    static buildBoolean(_a) {
        return _a === 1;
    }
    static buildShort(_a, _b) {
        return ByteBuffer.allocate(2).writeByte(_a).writeByte(_b).readInt16(0);
    }
    static buildChar(_a, _b) {
        return ByteBuffer.allocate(2).writeByte(_a).writeByte(_b).readString(1, ByteBuffer.METRICS_CHARS, 0);
    }
    static buildUnsignedInt(_a, _b, _c, _d) {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readInt32(0);
    }
    static buildInt(_a, _b, _c, _d) {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readInt32(0);
    }
    static buildFloat(_a, _b, _c, _d) {
        return ByteBuffer.allocate(4).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).readFloat32(0);
    }
    static buildLong(_a, _b, _c, _d, _e, _f, _g, _h) {
        return ByteBuffer.allocate(8).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).writeByte(_e).writeByte(_f).writeByte(_g).writeByte(_h).readLong(0);
    }
    static buildDouble(_a, _b, _c, _d, _e, _f, _g, _h) {
        return ByteBuffer.allocate(8).writeByte(_a).writeByte(_b).writeByte(_c).writeByte(_d).writeByte(_e).writeByte(_f).writeByte(_g).writeByte(_h).readDouble(0);
    }
    static buildString(_value) {
        if (_value.buffer.length === 1) {
            if (_value.buffer[0] === 0) {
                return '';
            }
        }
        return _value.toUTF8();
    }
    static buildHexString(array) {
        array.clear();
        return array.toHex();
    }
    static buildBigNumber(_value) {
        if (_value.buffer[0] > 127) {
            let power = _value.buffer.length * 8;
            return (new bignumber_js_1.default(_value.toHex(), 16)).minus((new bignumber_js_1.default(2)).exponentiatedBy(power));
        }
        else {
            return new bignumber_js_1.default(_value.toHex(), 16);
        }
    }
    static deconstructUnsignedByte(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT).writeByte(_value).clear();
    }
    static deconstructBoolean(_value) {
        if (_value) {
            return ByteBuffer.allocate(AmpConstants_1.AmpConstants.BOOLEAN_BYTE_FOOTPRINT).writeByte(1).clear();
        }
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.BOOLEAN_BYTE_FOOTPRINT).writeByte(0).clear();
    }
    static deconstructShort(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT).writeShort(_value).clear();
    }
    static deconstructChar(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.SHORT_BYTE_FOOTPRINT).writeCString(_value).clear();
    }
    static deconstructUnsignedInt(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT).writeUint32(_value).clear();
    }
    static deconstructInt(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT).writeInt32(_value).clear();
    }
    static deconstructFloat(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.FLOAT_BYTE_FOOTPRINT).writeFloat32(_value).clear();
    }
    static deconstructLong(_value) {
        if (_value.lt(new bignumber_js_1.default(AmpConstants_1.AmpConstants.MAX_LONG, 16)) && _value.gt(new bignumber_js_1.default(AmpConstants_1.AmpConstants.MIN_LONG, 16))) {
            let ln = ByteTools.deconstructBigNumberLong(_value);
            let len = ln.buffer.length;
            let b = ByteBuffer.allocate(8);
            if (len === 8) {
                return ln;
            }
            else if (len > 0) {
                if (ln.buffer[0] > 127) {
                    b.fill(255);
                }
                else {
                    b.fill(0);
                }
                ln.copyTo(b, 8 - len, 0, len);
                return b.clear();
            }
        }
    }
    static deconstructDouble(_value) {
        return ByteBuffer.allocate(AmpConstants_1.AmpConstants.DOUBLE_BYTE_FOOTPRINT).writeDouble(_value).clear();
    }
    static deconstructString(_value) {
        return ByteBuffer.fromUTF8(_value);
    }
    static deconstructBigNumberLong(_value) {
        let num = _value.toString(16);
        if (_value.lt(0)) {
            let power = _value.times(-1).toString(16).length * 4;
            num = (new bignumber_js_1.default(2)).exponentiatedBy(power).plus(_value).toString(16);
        }
        else {
            if (parseInt(num[0], 16) > 7) {
                num = '00' + num;
            }
        }
        if (num.length % 2 === 1) {
            num = '0' + num;
        }
        return ByteBuffer.fromHex(num);
    }
    // should be compatible with java biginteger
    // appends a 0 byte if leading nibble is more than 0x7
    static deconstructBigNumber(_value) {
        let num = _value.toString(16);
        if (num[0] === '-') {
            let len = (num.length - 1) / 2;
            if (parseInt(num[1] + num[2], 16) > 127) {
                len += 1;
            }
            num = (new bignumber_js_1.default(2)).exponentiatedBy(8 * len).plus(_value).toString(16);
            if (num.length % 2 === 1) {
                num = 'f' + num;
            }
        }
        else {
            if (parseInt(num[0] + num[1], 16) > 127) {
                num = '00' + num;
            }
        }
        if (num.length % 2 === 1) {
            num = '0' + num;
        }
        return ByteBuffer.fromHex(num);
    }
    static concatenateShorts(_a, _b) {
        let a = ByteTools.deconstructShort(_a).buffer;
        let b = ByteTools.deconstructShort(_b).buffer;
        return this.buildInt(a[0], a[1], b[0], b[1]);
    }
    static deconcatenateShorts(_value) {
        let bytes = ByteTools.deconstructInt(_value).buffer;
        return [
            ByteTools.buildShort(bytes[0], bytes[1]),
            ByteTools.buildShort(bytes[2], bytes[3])
        ];
    }
    static writeLockClassID(_classID) {
        return _classID.or(AmpConstants_1.AmpConstants.WRITE_LOCK_MARKER);
    }
    static isClassIDWriteLocked(_classID) {
        return (_classID.and(AmpConstants_1.AmpConstants.WRITE_LOCK_MARKER)).equals(AmpConstants_1.AmpConstants.WRITE_LOCK_MARKER);
    }
    static amplifyClassID(_classID) {
        return _classID.or(AmpConstants_1.AmpConstants.AMPLET_CLASS_MARKER);
    }
    static isClassIDAmplified(_classID) {
        return (_classID.and(AmpConstants_1.AmpConstants.AMPLET_CLASS_MARKER)).equals(AmpConstants_1.AmpConstants.AMPLET_CLASS_MARKER);
    }
    static writeLockGroupID(_groupID) {
        if (_groupID != null) {
            let classID = ByteTools.writeLockClassID(new Long(_groupID.classID));
            return new Groups_1.GroupID(classID.toInt(), _groupID.classInstanceID, _groupID.name);
        }
        return undefined;
    }
}
exports.ByteTools = ByteTools;
