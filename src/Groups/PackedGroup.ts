import ByteBuffer = require("bytebuffer");
import {BadArgumentException} from "../Exceptions";

export class PackedGroup {

    private _packedHeaderBytes: ByteBuffer;
    private _packedElementsBytes: ByteBuffer;

    private _byteCountTotalAllElements: number = 0;

    private _validPackedGroup: boolean = false;

    private constructor(packedHeaderBytes: ByteBuffer, packedElementBytes: ByteBuffer) {
        if (packedHeaderBytes && packedElementBytes) {
            this._packedHeaderBytes = packedHeaderBytes.clone(true)
            this._packedElementsBytes = packedElementBytes.clone(true)
            this._byteCountTotalAllElements = this._packedElementsBytes.buffer.length
            this._validPackedGroup = true
        } else {
            if (packedHeaderBytes == null)
            {
                throw new BadArgumentException("Null _packedHeaderBytes argument was passed into PackedGroup().");
            }

            if (packedElementBytes == null)
            {
                throw new BadArgumentException("Null _packedElementBytes argument was passed into PackedGroup().");
            }
            throw new BadArgumentException("Null argument was passed into PackedGroup().");
        }
    }

    public static createFromHeaderAndElements(packedHeaderBytes: ByteBuffer, packedElementBytes: ByteBuffer): PackedGroup {
        return new PackedGroup(packedHeaderBytes, packedElementBytes);
    }

    get packedHeaderBytes(): ByteBuffer {
        return this._packedHeaderBytes;
    }

    get packedElementsBytes(): ByteBuffer {
        return this._packedElementsBytes;
    }

    get byteCountTotalAllElements(): number {
        return this._byteCountTotalAllElements;
    }

    get validPackedGroup(): boolean {
        return this._validPackedGroup;
    }
}