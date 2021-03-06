/// <reference types="bytebuffer" />
import { ByteList } from "./Backings/ByteList";
import ByteBuffer = require("bytebuffer");
import { GrowModeEnum } from "./Backings/GrowModeEnum";
import { Amplet } from "./Amplet";
import BigNumber from "bignumber.js";
import { IAmpAmpletSerializable, IAmpByteSerializable } from "./Serialization";
export declare class HeadlessAmplet implements IAmpByteSerializable {
    private _bytes;
    private _cursor;
    private _sealed;
    private _validHeadlessAmplet;
    constructor(hamplet?: HeadlessAmplet, bytes?: ByteBuffer);
    static createFromHeadlessAmplet(): HeadlessAmplet;
    static createFromByteBuffer(bytes: ByteBuffer): HeadlessAmplet;
    static createFromTwin(hamplet: HeadlessAmplet): HeadlessAmplet;
    addBytes(bytes: ByteBuffer): boolean;
    addElementByte(value: number): boolean;
    addElementBoolean(value: boolean): boolean;
    addElementShort(value: number): boolean;
    addElementChar(value: string): boolean;
    addElementInt(value: number): boolean;
    addElementLong(value: BigNumber): boolean;
    addElementString(value: string): boolean;
    addElementBigNumber(value: BigNumber): boolean;
    addElementIAmpByteSerializable(value: IAmpByteSerializable): boolean;
    addElementIAmpAmpletSerializable(value: IAmpAmpletSerializable): boolean;
    resetCursor(): void;
    readonly bytes: ByteList;
    cursor: number;
    getMaxCursorPosition(): number;
    getCurrentSize(): number;
    ensureCapacity(minCap: number): void;
    setGrowMode(growMode: GrowModeEnum): void;
    getGrowMode(): GrowModeEnum;
    trimToSize(): void;
    deleteNextNBytes(n: number): boolean;
    getNextNBytes(n: number): ByteBuffer;
    getNextByte(): number | undefined;
    getNextUnsignedByte(): number | undefined;
    getNextBoolean(): boolean | undefined;
    getNextShort(): number | undefined;
    getNextCharacter(): string | undefined;
    getNextInt(): number | undefined;
    getNextLong(): BigNumber | undefined;
    getNextString(n: number): string | undefined;
    getNextBigNumber(n: number): BigNumber | undefined;
    getNextAmplet(n: number): Amplet;
    getByteFootprint(): number;
    isValidHeadlessAmplet(): boolean;
    isSealed(): boolean;
    seal(): void;
    serializeToBytes(): ByteBuffer;
}
