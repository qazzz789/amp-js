import {ByteTools} from "./ByteTools";
import Long = require("long");

export class AmpConstants {
    public static MAJOR_VERSION:                    number = 0;
    public static MINOR_VERSION:                    number = 2;
    public static VERSIONSTRING:                    string = AmpConstants.MAJOR_VERSION + '.' + AmpConstants.MINOR_VERSION;

    public static VERSIONASINTEGER(): number {
        return ByteTools.concatenateShorts(AmpConstants.MAJOR_VERSION, AmpConstants.MINOR_VERSION)
    }

    public static AMPLET_CLASS_MARKER:              Long = new Long(0x40000000);
    public static WRITE_LOCK_MARKER:                Long = new Long(0x80000000);

    public static BYTE_BYTE_FOOTPRINT:              number = 1
    public static BOOLEAN_BYTE_FOOTPRINT:           number = AmpConstants.BYTE_BYTE_FOOTPRINT;
    public static SHORT_BYTE_FOOTPRINT:             number = AmpConstants.BYTE_BYTE_FOOTPRINT * 2;
    public static CHAR_BYTE_FOOTPRINT:              number = AmpConstants.BYTE_BYTE_FOOTPRINT * 2;
    public static INT_BYTE_FOOTPRINT:               number = AmpConstants.BYTE_BYTE_FOOTPRINT * 4;
    public static FLOAT_BYTE_FOOTPRINT:             number = AmpConstants.BYTE_BYTE_FOOTPRINT * 4;
    public static LONG_BYTE_FOOTPRINT:              number = AmpConstants.BYTE_BYTE_FOOTPRINT * 8;
    public static DOUBLE_BYTE_FOOTPRINT:            number = AmpConstants.BYTE_BYTE_FOOTPRINT * 8;

    public static GROUP_HEADER_BYTE_FOOTPRINT:      number = AmpConstants.INT_BYTE_FOOTPRINT * 4;

    public static CLASS_ID_MAX_VALUE:               number = 2 ** 32;
    public static CLASS_INSTANCE_ID_MAX_VALUE:      number = 2 ** 32;

    public static SAFETY_PADDING:                   number = AmpConstants.BYTE_BYTE_FOOTPRINT * 500;
    public static ELEMENT_COUNT_MAX:                number = ((2**31) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
    public static ELEMENT_MAX_BYTE_FOOTPRINT:       number = ((2**31) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
    public static BYTE_ARRAY_MAX_BYTE_COUNT:        number = ((2**31) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;
    public static GROUPS_MAX_COUNT:                 number = ((2**31) - 1) * AmpConstants.BYTE_BYTE_FOOTPRINT - AmpConstants.SAFETY_PADDING;

    public static NATURAL:                          number = 0;
    public static KILOBYTE:                         number = 1000;
    public static TEN_KILOBYTES:                    number = AmpConstants.KILOBYTE * 10;
    public static FIFTY_KILOBYTES:                  number = AmpConstants.TEN_KILOBYTES * 5;
    public static ONE_HUNDRED_KILOBYTES:            number = AmpConstants.FIFTY_KILOBYTES * 2;
    public static FIVE_HUNDRED_KILOBYTES:           number = AmpConstants.ONE_HUNDRED_KILOBYTES * 5;
    public static MEGABYTE:                         number = AmpConstants.FIVE_HUNDRED_KILOBYTES * 2;
    public static TEN_MEGABYTES:                    number = AmpConstants.MEGABYTE * 10;
    public static FIFTY_MEGABYTES:                  number = AmpConstants.TEN_MEGABYTES * 5;

    public static MIN_LONG:                         string = '-7FFFFFFFFFFFFFFF';
    public static MAX_LONG:                         string = '7FFFFFFFFFFFFFFF';
}