"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("../Exceptions");
const AmpConstants_1 = require("../AmpConstants");
class GroupID {
    constructor(classID, classInstanceID, name, duplicatable, warning) {
        this._classID = 0;
        this._classInstanceID = 0;
        this._duplicatable = false;
        this._name = undefined;
        this._collision = false;
        this._classID = classID;
        this._classInstanceID = classInstanceID;
        this._name = name ? name : undefined;
        this._duplicatable = duplicatable ? duplicatable : this._duplicatable;
        if (!(classID > -1 && classID < AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE)) {
            throw new Exceptions_1.InvalidClassIDException(classID);
        }
        if (warning) {
            let collider = GroupID.registerGroupIDIfNoCollision(this);
            if (collider != null) {
                this._collision = true;
                if (GroupID.strongCollisionProtectionEnabled) {
                    throw new Exceptions_1.DuplicateGroupIDException(this, collider);
                }
            }
        }
    }
    get classID() {
        return this._classID;
    }
    get classInstanceID() {
        return this._classInstanceID;
    }
    get duplicatable() {
        return this._duplicatable;
    }
    get name() {
        return this._name;
    }
    static registerGroupIDIfNoCollision(groupID) {
        if (groupID) {
            if (!this.collisionProtectionEnabled) {
                return undefined;
            }
            for (let key in GroupID.registeredGroupIDs) {
                let item = GroupID.registeredGroupIDs[key];
                if (item.classID === groupID.classID && item.classInstanceID === groupID.classInstanceID) {
                    if (!item.duplicatable || !groupID.duplicatable) {
                        return item;
                    }
                    else {
                        return undefined;
                    }
                }
            }
            GroupID.registeredGroupIDs.push(groupID);
        }
        else if (Exceptions_1.AmpException.areExceptionsEnabled()) {
            throw new Exceptions_1.BadArgumentException('Null _element argument was passed into registerGroupIDIfNoCollision().');
        }
        return undefined;
    }
    static unregisterGroupID(groupID) {
        if (groupID != null) {
            throw new Error('implement unregisterGroupID');
        }
        else if (Exceptions_1.AmpException.areExceptionsEnabled()) {
            throw new Exceptions_1.BadArgumentException("Null _element argument was passed into unregisterGroupID().");
        }
    }
    static unregisterAllGroupIDs() {
        GroupID.registeredGroupIDs = [];
    }
    static enableCollisionProtection() {
        this.collisionProtectionEnabled = true;
    }
    static disableCollisionProtection() {
        this.collisionProtectionEnabled = false;
        GroupID.unregisterAllGroupIDs();
    }
    static enableStrongCollisionProtection() {
        this.strongCollisionProtectionEnabled = true;
    }
    static disableStrongCollisionProtection() {
        this.strongCollisionProtectionEnabled = false;
    }
}
GroupID.collisionProtectionEnabled = true;
GroupID.strongCollisionProtectionEnabled = false;
GroupID.registeredGroupIDs = [];
exports.GroupID = GroupID;
