import {IAmpClass} from "./IAmpClass";
import {IAmpClassCollection} from "./IAmpClassCollection";
import {IAmpAmpletSerializable} from "../Serialization";
import {UnpackedGroup} from "../Groups/UnpackedGroup";
import Long = require("long");
import {Amplet} from "../Amplet";

export class AmpClassCollection implements IAmpClassCollection, IAmpAmpletSerializable {

    private _ampClasses: Array<IAmpClass> = [];

    public addClass(ampClass: IAmpClass): boolean {
        if (ampClass !== undefined || ampClass !== null) {
            let success: boolean = true;
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
                this._ampClasses.push(ampClass)
                return true
            }
        }
        return false;
    }

    getUnpackedGroups(): Array<UnpackedGroup> {
        let unpackedGroups: Array<UnpackedGroup> = [];
        this._ampClasses.forEach((item: IAmpClass) => {
            let temp: Array<UnpackedGroup> = item.getUnpackedGroups();
            temp.forEach((i: UnpackedGroup) => {
                unpackedGroups.push(i);
            })
        });

        return unpackedGroups;
    }

    serializeToAmplet(): Amplet {
        return Amplet.createFromIAmpClassCollection(this);
    }

}