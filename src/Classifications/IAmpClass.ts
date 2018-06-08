import {UnpackedGroup} from "../Groups/UnpackedGroup";

export interface IAmpClass {
    classID: number;
    validClass: boolean;
    getUnpackedGroups(): Array<UnpackedGroup>;
}