"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnpackedGroup_1 = require("../Groups/UnpackedGroup");
const Amplet_1 = require("../Amplet");
const AmpConstants_1 = require("../AmpConstants");
const GroupID_1 = require("../Groups/GroupID");
class AC_ClassInstanceIDIsByteFootprint {
    constructor(classID, name) {
        this._classID = 0;
        this._name = undefined;
        this._unpackedGroups = [];
        this._validClass = true;
        this._classID = classID;
        this._name = name;
        this._validClass = this._classID > -1 && this._classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE;
    }
    static create(classID, name) {
        let temp = new AC_ClassInstanceIDIsByteFootprint(classID, name);
        if (temp.validClass) {
            return temp;
        }
        return null;
    }
    addElement(element) {
        if (element) {
            let byteCount = element.buffer.length;
            if (byteCount > 0 && byteCount < AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT) {
                let temp;
                for (let i = 0; i < this._unpackedGroups.length; i++) {
                    if (this._unpackedGroups[i].header.classInstanceID == byteCount) {
                        temp = this._unpackedGroups[i];
                    }
                }
                if (temp == null) {
                    let tempGID = new GroupID_1.GroupID(this._classID, byteCount, this._name, true, true);
                    temp = UnpackedGroup_1.UnpackedGroup.createFromGroupIDLen(tempGID, byteCount);
                }
                temp.addElement(element);
                this._unpackedGroups.push(temp);
                return true;
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
exports.AC_ClassInstanceIDIsByteFootprint = AC_ClassInstanceIDIsByteFootprint;
