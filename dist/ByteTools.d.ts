/// <reference types="long" />
/// <reference types="bytebuffer" />
import ByteBuffer = require("bytebuffer");
import { GroupID } from "./Groups";
import BigNumber from "bignumber.js";
import Long = require("long");
export declare class ByteTools {
    static buildUnsignedByte(_a: number): number;
    static buildBoolean(_a: number): boolean;
    static buildShort(_a: number, _b: number): number;
    static buildChar(_a: number, _b: number): string;
    static buildUnsignedInt(_a: number, _b: number, _c: number, _d: number): number;
    static buildInt(_a: number, _b: number, _c: number, _d: number): number;
    static buildFloat(_a: number, _b: number, _c: number, _d: number): number;
    static buildLong(_a: number, _b: number, _c: number, _d: number, _e: number, _f: number, _g: number, _h: number): Long;
    static buildDouble(_a: number, _b: number, _c: number, _d: number, _e: number, _f: number, _g: number, _h: number): number;
    static buildString(_value: ByteBuffer): string;
    static buildHexString(array: ByteBuffer): string;
    static buildBigNumber(_value: ByteBuffer): BigNumber;
    static deconstructUnsignedByte(_value: number): ByteBuffer;
    static deconstructBoolean(_value: boolean): ByteBuffer;
    static deconstructShort(_value: number): ByteBuffer;
    static deconstructChar(_value: string): ByteBuffer;
    static deconstructUnsignedInt(_value: number): ByteBuffer;
    static deconstructInt(_value: number): ByteBuffer;
    static deconstructFloat(_value: number): ByteBuffer;
    static deconstructLong(_value: BigNumber): ByteBuffer;
    static deconstructDouble(_value: number): ByteBuffer;
    static deconstructString(_value: string): ByteBuffer;
    private static deconstructBigNumberLong(_value);
    static deconstructBigNumber(_value: BigNumber): ByteBuffer;
    static concatenateShorts(_a: number, _b: number): number;
    static deconcatenateShorts(_value: number): number[];
    static writeLockClassID(_classID: number): number;
    static isClassIDWriteLocked(_classID: number): boolean;
    static amplifyClassID(_classID: number): number;
    static amplifyGroupIDGroup(groupID: GroupID): GroupID | undefined;
    static isClassIDAmplified(_classID: number): boolean;
    static writeLockGroupID(_groupID: GroupID): GroupID | undefined;
}
