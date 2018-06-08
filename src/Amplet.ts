import {UnpackedGroup} from "./Groups/UnpackedGroup";
import ByteBuffer = require("bytebuffer");
import {IAmpClass} from "./Classifications/IAmpClass";
import {AmpConstants} from "./AmpConstants";
import {GroupHeader} from "./Groups/GroupHeader";
import {GroupHeaderTools} from "./Groups/GroupHeaderTools";
import {GroupTools} from "./Groups/GroupTools";
import {PackedGroup} from "./Groups/PackedGroup";
import {GroupID} from "./Groups/GroupID";
import {
    BadArgumentException,
    InvalidAmpletExceptionOptional, InvalidGroupHeaderException,
    UnsupportedGroupCountException
} from "./Exceptions";
import {IAmpByteSerializable} from "./Serialization";
import {IAmpClassCollection} from "./Classifications/IAmpClassCollection";

export class Amplet implements IAmpByteSerializable {

    private _bytes: ByteBuffer;
    private _groupHeaders: Array<GroupHeader> = [];
    private _initialGroupsCount: number = 0;
    private _ampHeaderAndGroupSize: number = -1;

    private _unpackedGroupsArray: Array<UnpackedGroup> = [];
    private _unpackedGroupsList: Array<UnpackedGroup> = [];
    private _addedUnpackedGroupsList: Array<UnpackedGroup> = [];

    private _trailer: ByteBuffer;

    private _validAmplet: boolean = false;

    constructor(unpackedGroups?: Array<UnpackedGroup>, bytes?: ByteBuffer) {
        this._bytes = ByteBuffer.allocate(1);
        this._trailer = ByteBuffer.allocate(1);
        if (unpackedGroups) {
            if (unpackedGroups.length > 0 && unpackedGroups.length < AmpConstants.GROUPS_MAX_COUNT) {
                this._initialGroupsCount = unpackedGroups.length;

                for (let i = 0; i < this._initialGroupsCount; i++) {
                    this._unpackedGroupsArray[i] = unpackedGroups[i];
                    this._unpackedGroupsList.push(this._unpackedGroupsArray[i]);
                    this._groupHeaders.push(this._unpackedGroupsArray[i].header);
                }

                this.sealGroups();

                const soAreGroupsValid: boolean = this.areGroupsValid();
                const soDoRepeatGroupIDsExist: boolean = this.doRepeatGroupIDsExist();
                this._validAmplet = soAreGroupsValid && !soDoRepeatGroupIDsExist;
                if (!this._validAmplet)
                {
                    throw new InvalidAmpletExceptionOptional(soAreGroupsValid, soDoRepeatGroupIDsExist);
                }
            } else {
                throw new UnsupportedGroupCountException(unpackedGroups.length);
            }
        } else if (bytes && bytes.buffer.length > 0) {
            this._bytes = bytes.clone(true);
            this._groupHeaders = GroupHeaderTools.processHeader(bytes);
            if (this._groupHeaders) {
                this._initialGroupsCount = this._groupHeaders.length;
                this._unpackedGroupsArray = [];

                let soAreGroupsValid: boolean = this.areGroupsValid();
                let soDoRepeatGroupIDsExist: boolean = this.doRepeatGroupIDsExist();
                let soAreThereSufficientBytes: boolean = this.areThereSufficientBytes();

                this._validAmplet = soAreGroupsValid && !soDoRepeatGroupIDsExist && soAreThereSufficientBytes;
                if (!this._validAmplet)
                {
                    throw new InvalidAmpletExceptionOptional(soAreGroupsValid, soDoRepeatGroupIDsExist, soAreThereSufficientBytes);
                }

                if (this._ampHeaderAndGroupSize < bytes.buffer.length) {
                    let trailerSize: number = this._bytes.buffer.length - this._ampHeaderAndGroupSize;
                    this._trailer = ByteBuffer.allocate(trailerSize);
                    this._bytes.copyTo(this._trailer, 0, this._ampHeaderAndGroupSize, trailerSize);
                }
            } else {
                throw new InvalidGroupHeaderException("No headers generated.");
            }
        } else {
            throw new BadArgumentException("Null argument was passed into Amplet().");
        }
    }

    public static createFromIAmpClassCollection(_ampClassCollection: IAmpClassCollection): Amplet {
        return new Amplet(_ampClassCollection.getUnpackedGroups(), );
    }

    public static createFromIAmpClass(_ampClass: IAmpClass): Amplet {
        return new Amplet(_ampClass.getUnpackedGroups(), );
    }

    public static createFromUnpacked(_unpackedGroup: UnpackedGroup): Amplet {
        let temp: Array<UnpackedGroup> = [_unpackedGroup];
        return Amplet.createFromUnpackedArray(temp);
    }
    public static createFromUnpackedArray(_unpackedGroup: Array<UnpackedGroup>): Amplet {
        return new Amplet(_unpackedGroup, );
    }

    public static  createFromBytes(bytes: ByteBuffer): Amplet {
        return new Amplet(undefined, bytes);
    }

    private sealGroups(): void {
        this._unpackedGroupsList.forEach((item: UnpackedGroup) => {
            item.seal();
        })
    }

    private areGroupsValid(): boolean {
        for (let i = 0; i < this._groupHeaders.length; i++) {
            if (!this._groupHeaders[i].validGroup) {
                return false;
            }
        }
        return true;
    }

    private doRepeatGroupIDsExist(): boolean {
        for (let i = 0; i < this._groupHeaders.length; i++) {
            if (this.doesGroupIDExistMoreThanOnce(this._groupHeaders[i])) {
                return true;
            }
        }
        return false;
    }

    private doesGroupIDExistMoreThanOnce(header: GroupHeader): boolean {
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

    private calculateAmpHeaderAndGroupSize() {
        if (this._bytes && this._groupHeaders) {
            this._ampHeaderAndGroupSize = GroupHeaderTools.getHeaderLength(this._bytes);
            this._groupHeaders.forEach((item: GroupHeader) => {
                this._ampHeaderAndGroupSize += item.byteCountTotalAllElements;
            })
        }
    }

    private areThereSufficientBytes(): boolean {
        this.calculateAmpHeaderAndGroupSize();
        return this._ampHeaderAndGroupSize <= this._bytes.buffer.length && this._ampHeaderAndGroupSize !== -1;
    }

    get validAmplet(): boolean {
        return this._validAmplet;
    }

    private doesGroupIDExistFromElements(classID: number, classInstanceID: number): boolean {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._groupHeaders.length; i++) {
                let temp = this._groupHeaders[i];
                if (temp.classID === classID && temp.classInstanceID === classInstanceID) {
                    return true;
                }
            }
        }
        return false;
    }

    public doesGroupIDExist(groupID: GroupID): boolean {
        if (groupID) {
            return this.doesGroupIDExistFromElements(groupID.classID, groupID.classInstanceID);
        }
        return false;
    }

    private unpackGroupWithElements(classID: number, classInstanceID: number): UnpackedGroup | undefined {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (this._groupHeaders[i].classID === classID && this._groupHeaders[i].classInstanceID === classInstanceID) {
                    if (!this._unpackedGroupsArray[i]) {
                        let temp: UnpackedGroup = UnpackedGroup.createFromGroupHeaderBytes(this._groupHeaders[i], this._bytes);
                        this._unpackedGroupsArray[i] = temp;
                        this._unpackedGroupsList.push(temp);
                        return temp;
                    } else {
                        return this._unpackedGroupsArray[i];
                    }
                }
            }

            for (let i = 0; i < this._addedUnpackedGroupsList.length; i++) {
                let temp: UnpackedGroup = this._addedUnpackedGroupsList[i];
                if (temp.header.classID === classID && temp.header.classInstanceID === classInstanceID) {
                    return temp;
                }
            }
        }
        return undefined;
    }

    public unpackGroup(groupID: GroupID) {
        if (groupID) {
            return this.unpackGroupWithElements(groupID.classID, groupID.classInstanceID);
        }
        return null;
    }

    private getUnpackedGroupEithElements(classID: number, classInstanceID: number): UnpackedGroup | undefined {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
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

    public getUnpackedGroup(groupID: GroupID): UnpackedGroup | undefined {
        if (groupID) {
            return this.getUnpackedGroupEithElements(groupID.classID, groupID.classInstanceID);
        }
        return undefined;
    }

    public addUnpackedGroup(group: UnpackedGroup): boolean {
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

    public addMultipleUnpackedGroups(groups: Array<UnpackedGroup>): boolean {
        if (this._validAmplet && groups) {
            for (let i = 0; i < groups.length; i++) {
                let temp = groups[i];
                if (this.doesGroupIDExistFromElements(temp.header.classID, temp.header.classInstanceID)) {
                    return false;
                }
            }

            let success: boolean = true;

            for (let i = 0; i < groups.length; i++) {
                this.addUnpackedGroup(groups[i]);
            }
            return true;
        }
        return false;
    }

    public unpackClass(classID: number): Array<UnpackedGroup> {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE) {
            let unpackedClass: Array<UnpackedGroup> = [];
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (this._groupHeaders[i].classID === classID) {
                    if (!this._unpackedGroupsArray[i]) {
                        let temp = UnpackedGroup.createFromGroupHeaderBytes(this._groupHeaders[i], this._bytes);
                        this._unpackedGroupsArray[i] = temp;
                        this._unpackedGroupsList.push(temp);
                        unpackedClass.push(temp);
                    } else {
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

    private markGroupForDeletionInternal(classID: number, classInstanceID: number): boolean {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE && classInstanceID > -1 && classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            for (let i = 0; i < this._groupHeaders.length; i++) {
                let temp: GroupHeader = this._groupHeaders[i];
                if (temp.classID === classID && temp.classInstanceID === classInstanceID) {
                    this._groupHeaders[i].markForDeletion();
                    return true;
                }
            }
        }
        return false;
    }

    get trailer(): ByteBuffer {
        if (this._trailer.buffer.length > 0) {
            return this._trailer.clone(true)
        }
        return ByteBuffer.allocate(0);
    }

    set trailer(bytes: ByteBuffer) {
        if (!bytes) {
            this._trailer = ByteBuffer.allocate(0);
        } else {
            this._trailer = bytes.clone(true);
        }
    }

    public markGroupForDeletion(groupID: GroupID): boolean {
        if (groupID) {
            return this.markGroupForDeletionInternal(groupID.classID, groupID.classInstanceID);
        }
        return false;
    }

    public markClassForDeletion(classID: number): boolean {
        if (this._validAmplet && classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE) {
            let success: boolean = false;
            this._groupHeaders.forEach((item: GroupHeader) => {
                if (item.classID === classID) {
                    item.markForDeletion();
                    success = true;
                }
            });
            return success;
        }
        return false;
    }

    public repackGroups(): Array<PackedGroup> {
        if (this._validAmplet) {
            let repackedGroups: Array<PackedGroup> = [];
            for (let i = 0; i < this._initialGroupsCount; i++) {
                if (!this._groupHeaders[i].markedForDeletion) {
                    if ((this._unpackedGroupsArray[i] == null || !this._unpackedGroupsArray[i].changed) && this._bytes) {
                        repackedGroups.push(GroupTools.packGroupFromByteArray(this._groupHeaders[i], this._bytes));
                    } else if (this._unpackedGroupsArray[i] != null && this._unpackedGroupsArray[i].getNumberOfElements() !== 0) {
                        repackedGroups.push(GroupTools.repackUnpackedGroup(this._unpackedGroupsArray[i]));
                    }
                }
            }

            this._addedUnpackedGroupsList.forEach((item: UnpackedGroup) => {
                if (!item.header.markedForDeletion && item.getNumberOfElements() !== 0) {
                    repackedGroups.push(GroupTools.repackUnpackedGroup(item));
                }
            });

            if (repackedGroups.length > 0 && repackedGroups.length < AmpConstants.GROUPS_MAX_COUNT) {
                return repackedGroups;
            }
        }
        return [];
    }

    public repackSelf(): Amplet {
        return Amplet.createFromBytes(this.serializeToBytes());
    }

    public serializeToBytes() : ByteBuffer {
        return GroupTools.buildAmpletBytesFromPackedGroups(this.repackGroups(), this._trailer);
    }
}