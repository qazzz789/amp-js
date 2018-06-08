/// <reference types="bytebuffer" />
import ByteBuffer = require("bytebuffer");
import { GrowModeEnum } from "./GrowModeEnum";
export declare class ByteList {
    private static readonly _DEFAULT_CAPACITY;
    private static _UNINFLATED;
    private _bytes;
    private _size;
    private _growMode;
    constructor(bytes?: ByteBuffer, capacity?: number);
    setGrowMode(growMode: GrowModeEnum): void;
    readonly getGrowMode: GrowModeEnum;
    readonly size: number;
    isEmpty(): boolean;
    copy(): ByteList;
    toArray(): ByteBuffer;
    trimToSize(): void;
    ensureCapacity(minCap: number): void;
    private ensureCapacityInternal(minCap);
    private ensureExplicitCapacity(minCap);
    private grow(minCapacity);
    private reallocateBuffer(capacity);
    getNBytes(startIndex: number, n: number): ByteBuffer;
    add(byte: ByteBuffer): boolean;
    addAll(bytes: ByteBuffer): boolean;
    remove(index: number): void;
    removeNBytes(startIndex: number, n: number): void;
    clear(): void;
    private rangeCheck(index);
}
