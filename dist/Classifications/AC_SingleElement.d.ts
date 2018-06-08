/// <reference types="bytebuffer" />
import { GroupID } from "../Groups/GroupID";
import { UnpackedGroup } from "../Groups/UnpackedGroup";
import { Amplet } from "../Amplet";
import { IAmpClass } from "./IAmpClass";
import ByteBuffer = require("bytebuffer");
import BigNumber from "bignumber.js";
import { IAmpAmpletSerializable, IAmpByteSerializable } from "../Serialization";
export declare class AC_SingleElement implements IAmpClass, IAmpAmpletSerializable {
    private _groupID;
    private _classID;
    private _classInstanceID;
    private _elementLength;
    private _singleElementUnpackedGroup;
    private _validClass;
    private constructor();
    static createFromBigNumber(groupID: GroupID, element: BigNumber): AC_SingleElement;
    static createFromByteArray(groupID: GroupID, element: ByteBuffer): AC_SingleElement;
    static createFromByte(groupID: GroupID, element: number): AC_SingleElement;
    static createFromBoolean(groupID: GroupID, element: boolean): AC_SingleElement;
    static createFromShort(groupID: GroupID, element: number): AC_SingleElement;
    static createFromChar(groupID: GroupID, element: string): AC_SingleElement;
    static createFromInt(groupID: GroupID, element: number): AC_SingleElement;
    static createFromFloat(groupID: GroupID, element: number): AC_SingleElement;
    static createFromLong(groupID: GroupID, element: BigNumber): AC_SingleElement;
    static createFromDouble(groupID: GroupID, element: number): AC_SingleElement;
    static createFromString(groupID: GroupID, element: string): AC_SingleElement;
    static createFromIAmpByteSerializable(groupID: GroupID, element: IAmpByteSerializable): AC_SingleElement;
    readonly groupID: GroupID;
    readonly classID: number;
    readonly classInstanceID: number;
    readonly validClass: boolean;
    serializeToAmplet(): Amplet;
    getElement(): ByteBuffer;
    getUnpackedGroups(): Array<UnpackedGroup>;
}
