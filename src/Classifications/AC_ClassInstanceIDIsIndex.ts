import {UnpackedGroup} from "../Groups/UnpackedGroup";
import {AmpConstants} from "../AmpConstants";
import {Amplet} from "../Amplet";
import {IAmpClass} from "./IAmpClass";
import ByteBuffer = require("bytebuffer");
import {GroupID} from "../Groups/GroupID";
import {IAmpAmpletSerializable} from "../Serialization";

export class AC_ClassInstanceIDIsIndex implements IAmpClass, IAmpAmpletSerializable {

    private _index: number = 0;
    private _classID: number = 0;
    private _name: string | undefined = undefined;

    private _unpackedGroups: Array<UnpackedGroup> = []
    private _validClass: boolean = true;

    private constructor(classID: number, name: string) {
        this._classID = classID;
        this._name = name;
        this._validClass = this._classID > -1 && this._classID < AmpConstants.CLASS_ID_MAX_VALUE;
    }

    public static create(classID: number, name: string): AC_ClassInstanceIDIsIndex | null {
        let temp = new AC_ClassInstanceIDIsIndex(classID, name)
        if (temp.validClass) {
            return temp;
        }
        return null;
    }

    public addElement(element: ByteBuffer): boolean {
        if (element) {
            let byteCount: number = element.buffer.length;
            if (byteCount > 0 && byteCount < AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT) {
                if (this._index > -1 && this._index < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
                    let tempGID: GroupID = new GroupID(this._classID, this._index, this._name, true, true);
                    let tempUGroup: UnpackedGroup = UnpackedGroup.createFromGroupIDLen(tempGID, byteCount)
                    if (tempUGroup) {
                        tempUGroup.addElement(element)
                        this._unpackedGroups.push(tempUGroup)
                        this._index += 1
                        return true;
                    }
                }
            }
        }
        return false;
    }

    get classID(): number {
        return this._classID;
    }

    get validClass(): boolean {
        return this._validClass;
    }

    public getUnpackedGroups(): Array<UnpackedGroup> {
        return this._unpackedGroups
    }

    serializeToAmplet(): Amplet {
        return Amplet.createFromIAmpClass(this);
    }
}