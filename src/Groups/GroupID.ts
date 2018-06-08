import {AmpException, BadArgumentException, DuplicateGroupIDException, InvalidClassIDException} from "../Exceptions";
import {AmpConstants} from "../AmpConstants";

export class GroupID {
    private _classID: number = 0;
    private _classInstanceID: number = 0;
    private _duplicatable: boolean = false;
    private _name: string | undefined = undefined;
    private _collision: boolean = false;

    private static collisionProtectionEnabled: boolean = true;
    private static strongCollisionProtectionEnabled: boolean = false;

    private static registeredGroupIDs: Array<GroupID> = [];

    constructor(classID: number, classInstanceID: number, name: string | undefined, duplicatable?: boolean, warning?: boolean) {
        this._classID = classID;
        this._classInstanceID = classInstanceID;
        this._name = name? name: undefined;
        this._duplicatable = duplicatable ? duplicatable: this._duplicatable;

        if(!(classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE))
        {
            throw new InvalidClassIDException(classID);
        }

        if (warning) {
            let collider = GroupID.registerGroupIDIfNoCollision(this);
            if (collider != null) {
                this._collision = true;
                if (GroupID.strongCollisionProtectionEnabled) {
                    throw new DuplicateGroupIDException(this, collider);
                }
            }
        }
    }

    get classID(): number {
        return this._classID;
    }

    get classInstanceID(): number {
        return this._classInstanceID;
    }

    get duplicatable(): boolean {
        return this._duplicatable;
    }

    get name(): string | undefined {
        return this._name;
    }

    public static registerGroupIDIfNoCollision(groupID: GroupID): GroupID | undefined {
        if (groupID) {
            if (!this.collisionProtectionEnabled) {
                return undefined;
            }
            for (let key in GroupID.registeredGroupIDs) {
                let item = GroupID.registeredGroupIDs[key]
                if (item.classID === groupID.classID && item.classInstanceID === groupID.classInstanceID) {
                    if (!item.duplicatable || !groupID.duplicatable) {
                        return item;
                    } else {
                        return undefined;
                    }
                }
            }
            GroupID.registeredGroupIDs.push(groupID);
        } else if (AmpException.areExceptionsEnabled()) {
            throw new BadArgumentException('Null _element argument was passed into registerGroupIDIfNoCollision().');
        }
        return undefined;
    }

    public static unregisterGroupID(groupID: GroupID) {
        if (groupID != null) {
            throw new Error('implement unregisterGroupID')
        } else if (AmpException.areExceptionsEnabled()) {
            throw new BadArgumentException("Null _element argument was passed into unregisterGroupID().");
        }
    }

    public static unregisterAllGroupIDs() {
        GroupID.registeredGroupIDs = [];
    }

    public static enableCollisionProtection() {
        this.collisionProtectionEnabled = true;
    }

    public static disableCollisionProtection() {
        this.collisionProtectionEnabled = false;
        GroupID.unregisterAllGroupIDs()
    }

    public static enableStrongCollisionProtection() {
        this.strongCollisionProtectionEnabled = true;
    }

    public static disableStrongCollisionProtection() {
        this.strongCollisionProtectionEnabled = false;
    }
}