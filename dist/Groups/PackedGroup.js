"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("../Exceptions");
class PackedGroup {
    constructor(packedHeaderBytes, packedElementBytes) {
        this._byteCountTotalAllElements = 0;
        this._validPackedGroup = false;
        if (packedHeaderBytes && packedElementBytes) {
            this._packedHeaderBytes = packedHeaderBytes.clone(true);
            this._packedElementsBytes = packedElementBytes.clone(true);
            this._byteCountTotalAllElements = this._packedElementsBytes.buffer.length;
            this._validPackedGroup = true;
        }
        else {
            if (packedHeaderBytes == null) {
                throw new Exceptions_1.BadArgumentException("Null _packedHeaderBytes argument was passed into PackedGroup().");
            }
            if (packedElementBytes == null) {
                throw new Exceptions_1.BadArgumentException("Null _packedElementBytes argument was passed into PackedGroup().");
            }
            throw new Exceptions_1.BadArgumentException("Null argument was passed into PackedGroup().");
        }
    }
    static createFromHeaderAndElements(packedHeaderBytes, packedElementBytes) {
        return new PackedGroup(packedHeaderBytes, packedElementBytes);
    }
    get packedHeaderBytes() {
        return this._packedHeaderBytes;
    }
    get packedElementsBytes() {
        return this._packedElementsBytes;
    }
    get byteCountTotalAllElements() {
        return this._byteCountTotalAllElements;
    }
    get validPackedGroup() {
        return this._validPackedGroup;
    }
}
exports.PackedGroup = PackedGroup;
