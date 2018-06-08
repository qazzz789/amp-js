import { IAmpClass } from "./IAmpClass";
import { IAmpClassCollection } from "./IAmpClassCollection";
import { IAmpAmpletSerializable } from "../Serialization";
import { UnpackedGroup } from "../Groups/UnpackedGroup";
import { Amplet } from "../Amplet";
export declare class AmpClassCollection implements IAmpClassCollection, IAmpAmpletSerializable {
    private _ampClasses;
    addClass(ampClass: IAmpClass): boolean;
    getUnpackedGroups(): Array<UnpackedGroup>;
    serializeToAmplet(): Amplet;
}
