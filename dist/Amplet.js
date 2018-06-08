"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnpackedGroup_1 = require("./Groups/UnpackedGroup");
const ByteBuffer = require("bytebuffer");
const AmpConstants_1 = require("./AmpConstants");
const GroupHeaderTools_1 = require("./Groups/GroupHeaderTools");
const GroupTools_1 = require("./Groups/GroupTools");
const Exceptions_1 = require("./Exceptions");
class Amplet {
    constructor(unpackedGroups, bytes) {
        this._groupHeaders = [];
        this._initialGroupsCount = 0;
        this._ampHeaderAndGroupSize = -1;
        this._unpackedGroupsArray = [];
        this._unpackedGroupsList = [];
        this._addedUnpackedGroupsList = [];
        this._validAmplet = false;
        this._bytes = ByteBuffer.allocate(1);
        this._trailer = ByteBuffer.allocate(1);
        if (unpackedGroups) {
            if (unpackedGroups.length > 0 && unpackedGroups.length < AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
                this._initialGroupsCount = unpackedGroups.length;
                for (let i = 0; i < this._initialGroupsCount; i++) {
                    this._unpackedGroupsArray[i] = unpackedGroups[i];
                    this._unpackedGroupsList.push(this._unpackedGroupsArray[i]);
                    this._groupHeaders.push(this._unpackedGroupsArray[i].header);
                }
                this.sealGroups();
                const soAreGroupsValid = this.areGroupsValid();
                const soDoRepeatGroupIDsExist = this.doRepeatGroupIDsExist();
                this._validAmplet = soAreGroupsValid && !soDoRepeatGroupIDsExist;
                if (!this._validAmplet) {
                    throw new Exceptions_1.InvalidAmpletExceptionOptional(soAreGroupsValid, soDoRepeatGroupIDsExist);
                }
            }
            else {
                throw new Exceptions_1.UnsupportedGroupCountException(unpackedGroups.length);
            }
        }
        else if (bytes && bytes.buffer.length > 0) {
            this._bytes = bytes.clone(true);
            this._groupHeaders = GroupHeaderTools_1.GroupHeaderTools.processHeader(bytes);
            if (this._groupHeaders) {
                this._initialGroupsCount = this._groupHeaders.length;
                this._unpackedGroupsArray = [];
                let soAreGroupsValid = this.areGroupsValid();
                let soDoRepeatGroupIDsExist = this.doRepeatGroupIDsExist();
                let soAreThereSufficientBytes = this.areThereSufficientBytes();
                this._validAmplet = soAreGroupsValid && !soDoRepeatGroupIDsExist && soAreThereSufficientBytes;
                if (!this._validAmplet) {
                    throw new Exceptions_1.InvalidAmpletExceptionOptional(soAreGroupsValid, soDoRepeatGroupIDsExist, soAreThereSufficientBytes);
                }
                if (this._ampHeaderAndGroupSize < bytes.buffer.length) {
                    let trailerSize = this._bytes.buffer.length - this._ampHeaderAndGroupSize;
                    this._trailer = ByteBuffer.allocate(trailerSize);
                    this._bytes.copyTo(this._trailer, 0, this._ampHeaderAndGroupSize, trailerSize);
                }
            }
            else {
                throw new Exceptions_1.InvalidGroupHeaderException("No headers generated.");
            }
        }
        else {
            throw new Exceptions_1.BadArgumentException("Null argument was passed into Amplet().");
        }
    }
    static createFromIAmpClassCollection(_ampClassCollection) {
        return new Amplet(_ampClassCollection.getUnpackedGroups());
    }
    static createFromIAmpClass(_ampClass) {
        return new Amplet(_ampClass.getUnpackedGroups());
    }
    static createFromUnpacked(_unpackedGroup) {
        let temp = [_unpackedGroup];
        return Amplet.createFromUnpackedArray(temp);
    }
    static createFromUnpackedArray(_unpackedGroup) {
        return new Amplet(_unpackedGroup);
    }
    static createFromBytes(bytes) {
        return new Amplet(undefined, bytes);
    }
    sealGroups() {
        this._unpackedGroupsList.forEach((item) => {
            item.seal();
        });
    }
    areGroupsValid() {
        for (let i = 0; i < this._groupHeaders.length; i++) {
            if (!this._groupHeaders[i].validGroup) {
                return false;
            }
        }
        return true;
    }
    doRepeatGroupIDsExist() {
        for (let i = 0; i < this._groupHeaders.length; i++) {
            if (this.doesGroupIDExistMoreThanOnce(this._groupHeaders[i])) {
                return true;
            }
        }
        return false;
    }
    doesGroupIDExistMoreThanOnce(header) {
        let count = 0;
        for (let i = 0; i < this._groupHeaders.length; i++) {
            let currentHeader = this._groupHeaders[i];
            if (currentHeader.classID === header.classID && currentHeader.classInstanceID === header.classInstanceID) {
                count += 1;
                if (count > 1) {
                    return true;
                }
            }
        }
        return false;
    }
    calculateAmpHeaderAndGroupSize() {
        if (this._bytes && this._groupHeaders) {
            this._ampHeaderAndGroupSize = GroupHeaderTools_1.GroupHeaderTools.getHeaderLength(this._bytes);
            this._groupHeaders.forEach((item) => {
                this._ampHeaderAndGroupSize += item.byteCountTotalAllElements;
            });
        }
    }
    areThereSufficientBytes() {
        this.calculateAmpHeaderAndGroupSize();
        return this._ampHeaderAndGroupSize <= this._bytes.buffer.length && this._ampHeaderAndGroupSize !== -1;
    }
    get validAmplet() {
        return this._validAmplet;
    }
    doesGroupIDExistFromElements(classID, classInstanceID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._groupHeaders.length; i++) {
                let temp = this._groupHeaders[i];
                if (temp.classID === classID && temp.classInstanceID === classInstanceID) {
                    return true;
                }
            }
        }
        return false;
    }
    doesGroupIDExist(groupID) {
        if (groupID) {
            return this.doesGroupIDExistFromElements(groupID.classID, groupID.classInstanceID);
        }
        return false;
    }
    unpackGroupWithElements(classID, classInstanceID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (this._groupHeaders[i].classID === classID && this._groupHeaders[i].classInstanceID === classInstanceID) {
                    if (!this._unpackedGroupsArray[i]) {
                        let temp = UnpackedGroup_1.UnpackedGroup.createFromGroupHeaderBytes(this._groupHeaders[i], this._bytes);
                        this._unpackedGroupsArray[i] = temp;
                        this._unpackedGroupsList.push(temp);
                        return temp;
                    }
                    else {
                        return this._unpackedGroupsArray[i];
                    }
                }
            }
            for (let i = 0; i < this._addedUnpackedGroupsList.length; i++) {
                let temp = this._addedUnpackedGroupsList[i];
                if (temp.header.classID === classID && temp.header.classInstanceID === classInstanceID) {
                    return temp;
                }
            }
        }
        return undefined;
    }
    unpackGroup(groupID) {
        if (groupID) {
            return this.unpackGroupWithElements(groupID.classID, groupID.classInstanceID);
        }
        return null;
    }
    getUnpackedGroupEithElements(classID, classInstanceID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._unpackedGroupsList.length; i++) {
                let temp = this._unpackedGroupsList[i];
                if (temp.header.classID === classID && temp.header.classInstanceID === classInstanceID) {
                    return temp;
                }
            }
            for (let i = 0; i < this._addedUnpackedGroupsList.length; i++) {
                let temp = this._addedUnpackedGroupsList[i];
                if (temp.header.classID === classID && temp.header.classInstanceID === classInstanceID) {
                    return temp;
                }
            }
        }
        return undefined;
    }
    getUnpackedGroup(groupID) {
        if (groupID) {
            return this.getUnpackedGroupEithElements(groupID.classID, groupID.classInstanceID);
        }
        return undefined;
    }
    addUnpackedGroup(group) {
        if (this._validAmplet && group) {
            let temp = group.header;
            if (!this.doesGroupIDExistFromElements(temp.classID, temp.classInstanceID)) {
                this._groupHeaders.push(temp);
                group.seal();
                this._addedUnpackedGroupsList.push(group);
                return true;
            }
        }
        return false;
    }
    addMultipleUnpackedGroups(groups) {
        if (this._validAmplet && groups) {
            for (let i = 0; i < groups.length; i++) {
                let temp = groups[i];
                if (this.doesGroupIDExistFromElements(temp.header.classID, temp.header.classInstanceID)) {
                    return false;
                }
            }
            let success = true;
            for (let i = 0; i < groups.length; i++) {
                this.addUnpackedGroup(groups[i]);
            }
            return true;
        }
        return false;
    }
    unpackClass(classID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE) {
            let unpackedClass = [];
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (this._groupHeaders[i].classID === classID) {
                    if (!this._unpackedGroupsArray[i]) {
                        let temp = UnpackedGroup_1.UnpackedGroup.createFromGroupHeaderBytes(this._groupHeaders[i], this._bytes);
                        this._unpackedGroupsArray[i] = temp;
                        this._unpackedGroupsList.push(temp);
                        unpackedClass.push(temp);
                    }
                    else {
                        unpackedClass.push(this._unpackedGroupsArray[i]);
                    }
                }
            }
            for (let i = 0; i < this._addedUnpackedGroupsList.length; i++) {
                if (this._addedUnpackedGroupsList[i].header.classID === classID) {
                    unpackedClass.push(this._addedUnpackedGroupsList[i]);
                }
            }
            if (unpackedClass.length !== 0) {
                return unpackedClass;
            }
        }
        return [];
    }
    markGroupForDeletionInternal(classID, classInstanceID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._groupHeaders.length; i++) {
                let temp = this._groupHeaders[i];
                if (temp.classID === classID && temp.classInstanceID === classInstanceID) {
                    this._groupHeaders[i].markForDeletion();
                    return true;
                }
            }
        }
        return false;
    }
    get trailer() {
        if (this._trailer.buffer.length > 0) {
            return this._trailer.clone(true);
        }
        return ByteBuffer.allocate(0);
    }
    set trailer(bytes) {
        if (!bytes) {
            this._trailer = ByteBuffer.allocate(0);
        }
        else {
            this._trailer = bytes.clone(true);
        }
    }
    markGroupForDeletion(groupID) {
        if (groupID) {
            return this.markGroupForDeletionInternal(groupID.classID, groupID.classInstanceID);
        }
        return false;
    }
    markClassForDeletion(classID) {
        if (this._validAmplet && classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE) {
            let success = false;
            this._groupHeaders.forEach((item) => {
                if (item.classID === classID) {
                    item.markForDeletion();
                    success = true;
                }
            });
            return success;
        }
        return false;
    }
    repackGroups() {
        if (this._validAmplet) {
            let repackedGroups = [];
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (!this._groupHeaders[i].markedForDeletion) {
                    if ((this._unpackedGroupsArray[i] == null || !this._unpackedGroupsArray[i].changed) && this._bytes) {
                        repackedGroups.push(GroupTools_1.GroupTools.packGroupFromByteArray(this._groupHeaders[i], this._bytes));
                    }
                    else if (this._unpackedGroupsArray[i] != null && this._unpackedGroupsArray[i].getNumberOfElements() !== 0) {
                        repackedGroups.push(GroupTools_1.GroupTools.repackUnpackedGroup(this._unpackedGroupsArray[i]));
                    }
                }
            }
            this._addedUnpackedGroupsList.forEach((item) => {
                if (!item.header.markedForDeletion && item.getNumberOfElements() !== 0) {
                    repackedGroups.push(GroupTools_1.GroupTools.repackUnpackedGroup(item));
                }
            });
            if (repackedGroups.length > 0 && repackedGroups.length < AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
                return repackedGroups;
            }
        }
        return [];
    }
    repackSelf() {
        return Amplet.createFromBytes(this.serializeToBytes());
    }
    serializeToBytes() {
        return GroupTools_1.GroupTools.buildAmpletBytesFromPackedGroups(this.repackGroups(), this._trailer);
    }
}
exports.Amplet = Amplet;
