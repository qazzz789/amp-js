import {IAmpClass} from "./IAmpClass";
import {UnpackedGroup} from "../Groups/UnpackedGroup";
import {Amplet} from "../Amplet";
import {AmpConstants} from "../AmpConstants";
import ByteBuffer = require("bytebuffer");
import {GroupID} from "../Groups/GroupID";
import {IAmpAmpletSerializable} from "../Serialization";

export class AC_ClassInstanceIDIsByteFootprint implements IAmpClass, IAmpAmpletSerializable {
    private _classID: number = 0;
    private _name?: string = undefined;

    private _unpackedGroups: Array<UnpackedGroup> = [];
    private _validClass: boolean = true;

    private constructor(classID: number, name: string) {
        this._classID = classID;
        this._name = name;
        this._validClass = this._classID > -1 && this._classID < AmpConstants.CLASS_ID_MAX_VALUE;
    }

    public static create(classID: number, name: string): AC_ClassInstanceIDIsByteFootprint | null {
        let temp = new AC_ClassInstanceIDIsByteFootprint(classID, name);
        if (temp.validClass) {
            return temp;
        }
        return null;
    }

    public addElement(element: ByteBuffer): boolean {
        if (element) {
            let byteCount: number = element.buffer.length;
            if (byteCount > 0 && byteCount < AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT) {
                let temp;
                for (let i = 0; i < this._unpackedGroups.length; i++) {
                    if (this._unpackedGroups[i].header.classInstanceID == byteCount) {
                        temp = this._unpackedGroups[i];
                    }
                }

                if (temp == null) {
                    let tempGID: GroupID = new GroupID(this._classID, byteCount, this._name, true, true);
                    temp = UnpackedGroup.createFromGroupIDLen(tempGID, byteCount);
                }
                temp.addElement(element);
                this._unpackedGroups.push(temp);
                return true;
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

    getUnpackedGroups(): Array<UnpackedGroup> {
        return this._unpackedGroups;
    }

    serializeToAmplet(): Amplet {
        return Amplet.createFromIAmpClass(this);
    }
}