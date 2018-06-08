"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnpackedGroup_1 = require("../Groups/UnpackedGroup");
const AmpConstants_1 = require("../AmpConstants");
const Amplet_1 = require("../Amplet");
const GroupID_1 = require("../Groups/GroupID");
class AC_ClassInstanceIDIsIndex {
    constructor(classID, name) {
        this._index = 0;
        this._classID = 0;
        this._name = undefined;
        this._unpackedGroups = [];
        this._validClass = true;
        this._classID = classID;
        this._name = name;
        this._validClass = this._classID > -1 && this._classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
    }
    static create(classID, name) {
        let temp = new AC_ClassInstanceIDIsIndex(classID, name);
        if (temp.validClass) {
            return temp;
        }
        return null;
    }
    addElement(element) {
        if (element) {
            let byteCount = element.buffer.length;
            if (byteCount > 0 && byteCount < AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT) {
                if (this._index > -1 && this._index < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
                    let tempGID = new GroupID_1.GroupID(this._classID, this._index, this._name, true, true);
                    let tempUGroup = UnpackedGroup_1.UnpackedGroup.createFromGroupIDLen(tempGID, byteCount);
                    if (tempUGroup) {
                        tempUGroup.addElement(element);
                        this._unpackedGroups.push(tempUGroup);
                        this._index += 1;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    get classID() {
        return this._classID;
    }
    get validClass() {
        return this._validClass;
    }
    getUnpackedGroups() {
        return this._unpackedGroups;
    }
    serializeToAmplet() {
        return Amplet_1.Amplet.createFromIAmpClass(this);
    }
}
exports.AC_ClassInstanceIDIsIndex = AC_ClassInstanceIDIsIndex;
