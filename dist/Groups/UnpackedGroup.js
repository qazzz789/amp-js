"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GroupHeader_1 = require("./GroupHeader");
const ByteBuffer = require("bytebuffer");
const Amplet_1 = require("../Amplet");
const AmpConstants_1 = require("../AmpConstants");
const GroupTools_1 = require("./GroupTools");
const HeadlessAmplet_1 = require("../HeadlessAmplet");
const Exceptions_1 = require("../Exceptions");
const ByteTools_1 = require("../ByteTools");
class UnpackedGroup {
    constructor(groupID, byteCountPerElement, header, bytes) {
        this._changed = false;
        this._sealed = false;
        this._unpackedElements = [];
        this._validGroup = false;
        if (groupID && byteCountPerElement) {
            const classID = groupID.classID;
            const classInstanceID = groupID.classInstanceID;
            const validClassID = classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
            const validClassInstanceID = classInstanceID > -1 && classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE;
            const validByteCountPerElement = byteCountPerElement > 0 && byteCountPerElement < AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT;
            if (validClassID && validClassInstanceID && validByteCountPerElement) {
                this._unpackedElements = [];
                this._changed = true;
                let temp = GroupHeader_1.GroupHeader.createFromIDEL(groupID, byteCountPerElement);
                if (temp) {
                    this._header = temp;
                }
                else {
                    throw new Exceptions_1.InvalidGroupHeaderException("Failed to build group header.");
                }
                if (this._header != null) {
                    this._validGroup = this._header.validGroup;
                    if (!this._validGroup) {
                        throw new Exceptions_1.InvalidGroupHeaderException("Invalid header passed into UnpackedGroup().");
                    }
                }
                else {
                    throw new Exceptions_1.InvalidGroupHeaderException("Failed to build group header.");
                }
            }
            else {
                if (!validClassID) {
                    throw new Exceptions_1.InvalidClassIDException(classID);
                }
                if (!validClassInstanceID) {
                    throw new Exceptions_1.InvalidClassInstanceIDException(classInstanceID);
                }
                if (!validByteCountPerElement) {
                    throw new Exceptions_1.UnsupportedElementSizeException(byteCountPerElement);
                }
                throw new Exceptions_1.InvalidGroupHeaderException("Failed to build group header.");
            }
        }
        else if (header && bytes) {
            this._sealed = true;
            this._header = header;
            this._validGroup = this._header.validGroup;
            if (this._validGroup) {
                this._unpackedElements = GroupTools_1.GroupTools.unpackElementsFromByteArray(this._header, bytes);
                if (!this._unpackedElements) {
                    this._validGroup = false;
                }
            }
            else {
                throw new Exceptions_1.InvalidGroupHeaderException("Invalid header passed into UnpackedGroup().");
            }
        }
        else if (header) {
            this._unpackedElements = [];
            this._changed = true;
            this._header = header;
            this._validGroup = this._header.validGroup;
        }
        else {
            throw new Exceptions_1.BadArgumentException("Null argument was passed into UnpackedGroup().");
        }
    }
    static createFromGroupIDLen(groupID, byteCountPerElement) {
        return new UnpackedGroup(groupID, byteCountPerElement);
    }
    static createFromGroupHeaderBytes(header, bytes) {
        return new UnpackedGroup(undefined, undefined, header, bytes);
    }
    static createFromGroupHeader(header) {
        return new UnpackedGroup(undefined, undefined, header);
    }
    get header() {
        return this._header;
    }
    get changed() {
        return this._changed;
    }
    get validGroup() {
        return this._validGroup;
    }
    getNumberOfElements() {
        if (this._validGroup) {
            return this._unpackedElements.length;
        }
        return 0;
    }
    getElement(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1)) {
            return this._unpackedElements[index].clone(true);
        }
        return ByteBuffer.allocate(0);
    }
    getElementAsByte(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants_1.AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readByte(0);
        }
        return undefined;
    }
    getElementAsUnsignedInt(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readUint32(0);
        }
        return undefined;
    }
    getElementAsInt(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readInt32(0);
        }
        return undefined;
    }
    getElementAsString(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1)) {
            return this._unpackedElements[index].toUTF8();
        }
        return undefined;
    }
    getElementAsBigNumber(index) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1)) {
            return ByteTools_1.ByteTools.buildBigNumber(this._unpackedElements[index]);
        }
        return undefined;
    }
    getElementAsHeadlessAmplet(index) {
        if (this._validGroup) {
            return HeadlessAmplet_1.HeadlessAmplet.createFromByteBuffer(this._unpackedElements[index]);
        }
        return undefined;
    }
    getElementAsAmplet(index) {
        if (this._validGroup && this._header.isAmpletCompatible()) {
            return Amplet_1.Amplet.createFromBytes(this._unpackedElements[index]);
        }
        return undefined;
    }
    addElement(element) {
        if (this._validGroup && !this.isWriteLockedAndSealed() && this._unpackedElements.length < (AmpConstants_1.AmpConstants.ELEMENT_COUNT_MAX - 1)) {
            if (element.buffer.length === this._header.byteCountPerElement) {
                this._unpackedElements.push(element.clone(true));
                this._header.elementCount = this._unpackedElements.length;
                this._changed = true;
                return true;
            }
        }
        return false;
    }
    removeElement(index) {
        if (this._validGroup && !this.isWriteLockedAndSealed() && index < (this._unpackedElements.length - 1)) {
            this._unpackedElements.splice(index, 1);
            this._header.elementCount = this._unpackedElements.length;
            this._changed = true;
            return true;
        }
        return false;
    }
    clearElements() {
        if (this._validGroup && !this.isWriteLockedAndSealed()) {
            this._unpackedElements = [];
            this._header.elementCount = this._unpackedElements.length;
            this._changed = true;
            return true;
        }
        return false;
    }
    isWriteLockedAndSealed() {
        return (this._header.isWriteLocked() && this._sealed);
    }
    doesGroupHaveExpectedByteCountPerElement(byteCount) {
        return this._header.byteCountPerElement === byteCount;
    }
    seal() {
        this._sealed = true;
    }
    packElementsIntoByteArray() {
        return GroupTools_1.GroupTools.packElementsIntoByteArray(this._header, this._unpackedElements);
    }
    serializeToAmplet() {
        return Amplet_1.Amplet.createFromUnpacked(this);
    }
}
exports.UnpackedGroup = UnpackedGroup;
