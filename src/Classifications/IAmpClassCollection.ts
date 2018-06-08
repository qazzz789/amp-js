import {UnpackedGroup} from "../Groups/UnpackedGroup";
import {Amplet} from "../Amplet";

export interface IAmpClassCollection {
    getUnpackedGroups(): Array<UnpackedGroup>;

    serializeToAmplet(): Amplet;
}