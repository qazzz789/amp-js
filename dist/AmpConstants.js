"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteTools_1 = require("./ByteTools");
class AmpConstants {
    static VERSIONASINTEGER() {
        return ByteTools_1.ByteTools.concatenateShorts(AmpConstants.MAJOR_VERSION, AmpConstants.MINOR_VERSION);
    }
}
AmpConstants.MAJOR_VERSION = 0;
AmpConstants.MINOR_VERSION = 2;
AmpConstants.VERSIONSTRING = AmpConstants.MAJOR_VERSION + '.' + AmpConstants.MINOR_VERSION;
AmpConstants.AMPLET_CLASS_MARKER = Buffer.from('40000000', 'hex');
AmpConstants.WRITE_LOCK_MARKER = Buffer.from('80000000', 'hex');
AmpConstants.BYTE_BYTE_FOOTPRINT = 1;
AmpConstants.BOOLEAN_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT;
AmpConstants.SHORT_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 2;
AmpConstants.CHAR_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 2;
AmpConstants.INT_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 4;
AmpConstants.FLOAT_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 4;
AmpConstants.LONG_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 8;
AmpConstants.DOUBLE_BYTE_FOOTPRINT = AmpConstants.BYTE_BYTE_FOOTPRINT * 8;
AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT = AmpConstants.INT_BYTE_FOOTPRINT * 4;
AmpConstants.CLASS_ID_MAX_VALUE = Math.pow(2, 32);
AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE = Math.pow(2, 32);
AmpConstants.SAFETY_PADDING = AmpConstants.BYTE_BYTE_FOOTPRINT * 500;
AmpConstants.ELEMENT_COUNT_MAX = ((Math.pow(2, 31)) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT = ((Math.pow(2, 31)) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT = ((Math.pow(2, 31)) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
AmpConstants.GROUPS_MAX_COUNT = ((Math.pow(2, 31)) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
AmpConstants.NATURAL = 0;
AmpConstants.KILOBYTE = 1000;
AmpConstants.TEN_KILOBYTES = AmpConstants.KILOBYTE * 10;
AmpConstants.FIFTY_KILOBYTES = AmpConstants.TEN_KILOBYTES * 5;
AmpConstants.ONE_HUNDRED_KILOBYTES = AmpConstants.FIFTY_KILOBYTES * 2;
AmpConstants.FIVE_HUNDRED_KILOBYTES = AmpConstants.ONE_HUNDRED_KILOBYTES * 5;
AmpConstants.MEGABYTE = AmpConstants.FIVE_HUNDRED_KILOBYTES * 2;
AmpConstants.TEN_MEGABYTES = AmpConstants.MEGABYTE * 10;
AmpConstants.FIFTY_MEGABYTES = AmpConstants.TEN_MEGABYTES * 5;
AmpConstants.MIN_LONG = '-7FFFFFFFFFFFFFFF';
AmpConstants.MAX_LONG = '7FFFFFFFFFFFFFFF';
exports.AmpConstants = AmpConstants;
