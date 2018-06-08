/// <reference types="bytebuffer" />
import ByteBuffer = require("bytebuffer");
export declare class PackedGroup {
    private _packedHeaderBytes;
    private _packedElementsBytes;
    private _byteCountTotalAllElements;
    private _validPackedGroup;
    private constructor();
    static createFromHeaderAndElements(packedHeaderBytes: ByteBuffer, packedElementBytes: ByteBuffer): PackedGroup;
    readonly packedHeaderBytes: ByteBuffer;
    readonly packedElementsBytes: ByteBuffer;
    readonly byteCountTotalAllElements: number;
    readonly validPackedGroup: boolean;
}
