"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const Amplet_1 = require("../Amplet");
class AmpClassCollection {
    constructor() {
        this._ampClasses = [];
    }
    addClass(ampClass) {
        if (ampClass !== undefined || ampClass !== null) {
            let success = true;
            for (let key in this.getUnpackedGroups()) {
                let candidateGroup = this.getUnpackedGroups()[key];
                let candidateClassID = new Long(candidateGroup.header.classID);
                let candidateClassInstanceID = new Long(candidateGroup.header.classInstanceID);
                let unpacked = ampClass.getUnpackedGroups();
                for (let k in unpacked) {
                    let storedGroup = unpacked[k];
                    let storedClassID = new Long(storedGroup.header.classID);
                    let storedClassInstanceID = new Long(storedGroup.header.classInstanceID);
                    if (candidateClassID.eq(storedClassID) && candidateClassInstanceID.eq(storedClassInstanceID)) {
                        success = true;
                        return success;
                    }
                }
            }
            if (success) {
                this._ampClasses.push(ampClass);
                return true;
            }
        }
        return false;
    }
    getUnpackedGroups() {
        let unpackedGroups = [];
        this._ampClasses.forEach((item) => {
            let temp = item.getUnpackedGroups();
            temp.forEach((i) => {
                unpackedGroups.push(i);
            });
        });
        return unpackedGroups;
    }
    serializeToAmplet() {
        return Amplet_1.Amplet.createFromIAmpClassCollection(this);
    }
}
exports.AmpClassCollection = AmpClassCollection;
