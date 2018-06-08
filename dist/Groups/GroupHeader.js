"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteTools_1 = require("../ByteTools");
const Long = require("long");
const AmpConstants_1 = require("../AmpConstants");
const Exceptions_1 = require("../Exceptions");
class GroupHeader {
    constructor(groupID, byteCountPerElement, elementCount, byteArrayStartPosition) {
        this._classID = 0;
        this._classInstanceID = 0;
        this._byteCountPerElement = 0;
        this._elementCount = 0;
        this._byteCountTotalAllElements = 0;
        this._byteArrayStartPosition = 0;
        this._byteArrayEndPosition = 0;
        this._markedForDeletion = false;
        this._validGroup = false;
        if (groupID) {
            this._groupID = groupID;
            this._classID = this._groupID.classID;
            this._classInstanceID = this._groupID.classInstanceID;
            const validClassID = this._classID > -1 && this._classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
            const validClassInstanceID = this._classInstanceID > -1 && this._classInstanceID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
            const validByteCountPerElement = byteCountPerElement > 0 && byteCountPerElement < AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT;
            if (validClassID && validClassInstanceID && validByteCountPerElement) {
                this._byteCountPerElement = byteCountPerElement;
                this._validGroup = true;
                if (elementCount && byteArrayStartPosition) {
                    const validElementCount = elementCount > 0 && elementCount < AmpConstants_1.AmpConstants.ELEMENT_COUNT_MAX;
                    if (validElementCount) {
                        this._elementCount = elementCount;
                        this._byteCountTotalAllElements = this._elementCount * this._byteCountPerElement;
                        this._byteArrayStartPosition = byteArrayStartPosition;
                        this._byteArrayEndPosition = this._byteArrayStartPosition + this._byteCountTotalAllElements;
                    }
                    else {
                        throw new Exceptions_1.UnsupportedNumberOfElementsException(elementCount);
                    }
                }
            }
            else {
                if (!validClassID) {
                    throw new Exceptions_1.InvalidClassIDException(this._classID);
                }
                if (!validClassInstanceID) {
                    throw new Exceptions_1.InvalidClassInstanceIDException(this._classInstanceID);
                }
                if (!validByteCountPerElement) {
                    throw new Exceptions_1.UnsupportedElementSizeException(byteCountPerElement);
                }
                throw new Exceptions_1.BadArgumentException("Null argument was passed into GroupHeader().");
            }
        }
        else {
            throw new Exceptions_1.BadArgumentException("Null _groupID argument was passed into GroupHeader().");
        }
    }
    static createFromIDEL(groupID, byteCountPerElement) {
        return new GroupHeader(groupID, byteCountPerElement);
    }
    static createIDELCNPS(groupID, byteCountPerElement, elementCount, byteArrayStartPosition) {
        return new GroupHeader(groupID, byteCountPerElement, elementCount, byteArrayStartPosition);
        ;
    }
    set elementCount(value) {
        if (this._validGroup) {
            if (value < 0) {
                value = 0;
            }
            this._elementCount = value;
            this._byteCountTotalAllElements = this._elementCount * this._byteCountPerElement;
            this._byteArrayEndPosition = this._byteArrayStartPosition + this._byteCountTotalAllElements;
        }
    }
    get groupID() {
        return this._groupID;
    }
    get classID() {
        return this._classID;
    }
    get classInstanceID() {
        return this._classInstanceID;
    }
    get byteCountPerElement() {
        return this._byteCountPerElement;
    }
    get elementCount() {
        return this._elementCount;
    }
    get byteCountTotalAllElements() {
        return this._byteCountTotalAllElements;
    }
    get byteArrayStartPosition() {
        return this._byteArrayStartPosition;
    }
    get byteArrayEndPosition() {
        return this._byteArrayEndPosition;
    }
    get markedForDeletion() {
        return this._markedForDeletion;
    }
    get validGroup() {
        return this._validGroup;
    }
    isWriteLocked() {
        return ByteTools_1.ByteTools.isClassIDWriteLocked(new Long(this.classID));
    }
    isAmpletCompatible() {
        return ByteTools_1.ByteTools.isClassIDAmplified(new Long(this.classID));
    }
    markForDeletion() {
        this._markedForDeletion = !this.isWriteLocked();
    }
}
exports.GroupHeader = GroupHeader;
