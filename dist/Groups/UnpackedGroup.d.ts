/// <reference types="bytebuffer" />
import { GroupHeader } from "./GroupHeader";
import ByteBuffer = require("bytebuffer");
import { Amplet } from "../Amplet";
import { GroupID } from "./GroupID";
import BigNumber from "bignumber.js";
import { HeadlessAmplet } from "../HeadlessAmplet";
import { IAmpAmpletSerializable } from "../Serialization";
export declare class UnpackedGroup implements IAmpAmpletSerializable {
    private readonly _header;
    private _changed;
    private _sealed;
    private _unpackedElements;
    private _validGroup;
    private constructor();
    static createFromGroupIDLen(groupID: GroupID, byteCountPerElement: number): UnpackedGroup;
    static createFromGroupHeaderBytes(header: GroupHeader, bytes: ByteBuffer): UnpackedGroup;
    static createFromGroupHeader(header: GroupHeader): UnpackedGroup;
    readonly header: GroupHeader;
    readonly changed: boolean;
    readonly validGroup: boolean;
    getNumberOfElements(): number;
    getElement(index: number): ByteBuffer;
    getElementAsByte(index: number): number | undefined;
    getElementAsUnsignedInt(index: number): number | undefined;
    getElementAsInt(index: number): number | undefined;
    getElementAsString(index: number): string | undefined;
    getElementAsBigNumber(index: number): BigNumber | undefined;
    getElementAsHeadlessAmplet(index: number): HeadlessAmplet | undefined;
    getElementAsAmplet(index: number): Amplet | undefined;
    addElement(element: ByteBuffer): boolean;
    removeElement(index: number): boolean;
    clearElements(): boolean;
    isWriteLockedAndSealed(): boolean;
    doesGroupHaveExpectedByteCountPerElement(byteCount: number): boolean;
    seal(): void;
    packElementsIntoByteArray(): ByteBuffer;
    serializeToAmplet(): Amplet;
}
