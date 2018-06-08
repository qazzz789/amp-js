/// <reference types="bytebuffer" />
import { UnpackedGroup } from "../Groups/UnpackedGroup";
import { Amplet } from "../Amplet";
import { IAmpClass } from "./IAmpClass";
import ByteBuffer = require("bytebuffer");
import { IAmpAmpletSerializable } from "../Serialization";
export declare class AC_ClassInstanceIDIsIndex implements IAmpClass, IAmpAmpletSerializable {
    private _index;
    private _classID;
    private _name;
    private _unpackedGroups;
    private _validClass;
    private constructor();
    static create(classID: number, name: string): AC_ClassInstanceIDIsIndex | null;
    addElement(element: ByteBuffer): boolean;
    readonly classID: number;
    readonly validClass: boolean;
    getUnpackedGroups(): Array<UnpackedGroup>;
    serializeToAmplet(): Amplet;
}
