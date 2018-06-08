/// <reference types="bytebuffer" />
import { IAmpClass } from "./IAmpClass";
import { UnpackedGroup } from "../Groups/UnpackedGroup";
import { Amplet } from "../Amplet";
import ByteBuffer = require("bytebuffer");
import { IAmpAmpletSerializable } from "../Serialization";
export declare class AC_ClassInstanceIDIsByteFootprint implements IAmpClass, IAmpAmpletSerializable {
    private _classID;
    private _name?;
    private _unpackedGroups;
    private _validClass;
    private constructor();
    static create(classID: number, name: string): AC_ClassInstanceIDIsByteFootprint | null;
    addElement(element: ByteBuffer): boolean;
    readonly classID: number;
    readonly validClass: boolean;
    getUnpackedGroups(): Array<UnpackedGroup>;
    serializeToAmplet(): Amplet;
}
