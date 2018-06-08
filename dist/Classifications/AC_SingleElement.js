"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnpackedGroup_1 = require("../Groups/UnpackedGroup");
const Amplet_1 = require("../Amplet");
const ByteBuffer = require("bytebuffer");
const AmpConstants_1 = require("../AmpConstants");
const ByteTools_1 = require("../ByteTools");
const Exceptions_1 = require("../Exceptions");
class AC_SingleElement {
    constructor(groupID, element) {
        this._classID = 0;
        this._classInstanceID = 0;
        this._elementLength = 0;
        this._validClass = false;
        if (groupID && element) {
            this._groupID = groupID;
            this._classID = this._groupID.classID;
            this._classInstanceID = this._groupID.classInstanceID;
            this._elementLength = element.buffer.length;
            const elementLengthValid = this._elementLength > 0 && this._elementLength < AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT;
            if (elementLengthValid) {
                const classIDValid = this._classID > -1 && this._classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
                const classInstanceIDValid = this._classInstanceID > -1 && this._classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE;
                if (classIDValid && classInstanceIDValid) {
                    this._singleElementUnpackedGroup = UnpackedGroup_1.UnpackedGroup.createFromGroupIDLen(this._groupID, this._elementLength);
                    if (this._singleElementUnpackedGroup) {
                        this._singleElementUnpackedGroup.addElement(element);
                        this._singleElementUnpackedGroup.seal();
                        this._validClass = true;
                    }
                    else {
                        throw new Exceptions_1.InvalidGroupException("Unable to make unpacked group.");
                    }
                }
                else {
                    if (!classIDValid) {
                        throw new Exceptions_1.InvalidClassIDException(this._classID);
                    }
                    if (!classInstanceIDValid) {
                        throw new Exceptions_1.InvalidClassInstanceIDException(this._classInstanceID);
                    }
                    throw new Exceptions_1.InvalidGroupException("Unable to make unpacked group.");
                }
            }
            else {
                throw new Exceptions_1.UnsupportedElementSizeException(element.buffer.length);
            }
        }
        else {
            if (groupID == null) {
                throw new Exceptions_1.BadArgumentException("Null _groupID argument was passed into AC_SingleElement.ts().");
            }
            if (element == null) {
                throw new Exceptions_1.BadArgumentException("Null _element argument was passed into AC_SingleElement.ts().");
            }
            throw new Exceptions_1.BadArgumentException("Null argument was passed into AC_SingleElement.ts().");
        }
    }
    static createFromBigNumber(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructBigNumber(element));
    }
    static createFromByteArray(groupID, element) {
        return new AC_SingleElement(groupID, element);
    }
    static createFromByte(groupID, element) {
        return new AC_SingleElement(groupID, ByteBuffer.allocate(1).writeByte(element).clear());
    }
    static createFromBoolean(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructBoolean(element));
    }
    static createFromShort(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructShort(element));
    }
    static createFromChar(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructChar(element));
    }
    static createFromInt(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructInt(element));
    }
    static createFromFloat(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructFloat(element));
    }
    static createFromLong(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructLong(element));
    }
    static createFromDouble(groupID, element) {
        return new AC_SingleElement(groupID, ByteTools_1.ByteTools.deconstructDouble(element));
    }
    static createFromString(groupID, element) {
        return new AC_SingleElement(groupID, ByteBuffer.fromUTF8(element));
    }
    static createFromIAmpByteSerializable(groupID, element) {
        return new AC_SingleElement(groupID, element.serializeToBytes());
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
    get validClass() {
        return this._validClass;
    }
    serializeToAmplet() {
        return Amplet_1.Amplet.createFromIAmpClass(this);
    }
    getElement() {
        if (this._validClass) {
            return this._singleElementUnpackedGroup.getElement(0);
        }
        return ByteBuffer.allocate(0);
    }
    getUnpackedGroups() {
        let tempList = [];
        if (this._validClass) {
            let tempGroup = UnpackedGroup_1.UnpackedGroup.createFromGroupIDLen(this._groupID, this._elementLength);
            tempGroup.addElement(this.getElement());
            tempGroup.seal();
            tempList.push(tempGroup);
        }
        return tempList;
    }
}
exports.AC_SingleElement = AC_SingleElement;
