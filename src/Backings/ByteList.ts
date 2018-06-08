import ByteBuffer = require("bytebuffer");
import {GrowModeEnum} from "./GrowModeEnum";
import {AmpConstants} from "../AmpConstants";

export class ByteList {

    private static readonly _DEFAULT_CAPACITY: number = 0;
    private static _UNINFLATED: ByteBuffer = ByteBuffer.allocate(0);

    private _bytes: ByteBuffer;
    private _size: number = 0;

    private _growMode: GrowModeEnum = GrowModeEnum.NATURAL;

    constructor(bytes?: ByteBuffer, capacity?: number) {
        if (bytes) {
            this._bytes = bytes.clone(true);
            this._size = bytes.buffer.length;
        } else if (capacity) {
            if (capacity > 0) {
                this._bytes = ByteBuffer.allocate(capacity);
            } else {
                this._bytes = ByteBuffer.allocate(ByteList._DEFAULT_CAPACITY);
            }
        } else {
            this._bytes = ByteBuffer.allocate(ByteList._DEFAULT_CAPACITY);
            this._size = ByteList._DEFAULT_CAPACITY;
        }
    }

    public setGrowMode(growMode: GrowModeEnum) {
        this._growMode = growMode;
    }

    get getGrowMode(): GrowModeEnum {
        return this._growMode
    }

    get size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0
    }

    public copy(): ByteList {
        return new ByteList(this._bytes.clone(true), )
    }

    public toArray(): ByteBuffer {
        return this._bytes.clone(true)
    }

    public trimToSize() {
        if (this._size < this._bytes.buffer.length) {
            if (this._size === 0) {
                this._bytes = ByteBuffer.allocate(0)
                return;
            }
            this.reallocateBuffer(this._size)
        }
    }

    public ensureCapacity(minCap: number) {
        if (minCap <= this._bytes.buffer.length || (this._bytes.buffer.length === 0 && minCap < ByteList._DEFAULT_CAPACITY)) {
            return;
        }
        this.ensureExplicitCapacity(minCap)
    }

    private ensureCapacityInternal(minCap: number) {
        let temp: number = minCap
        if (this._bytes.buffer.length === 0) {
            temp = Math.max(minCap, ByteList._DEFAULT_CAPACITY)
        }
        this.ensureExplicitCapacity(temp)
    }

    private ensureExplicitCapacity(minCap: number) {
        if (minCap - this._bytes.buffer.length > 0) {
            this.grow(minCap)
        }
    }

    private grow(minCapacity: number) {
        let oldCap: number = this._bytes.buffer.length;
        let newCap: number;

        if (this._growMode === GrowModeEnum.NATURAL) {
            newCap = oldCap + (oldCap >> 1)
        } else {
            newCap = oldCap + this._growMode
        }

        if (newCap - minCapacity < 0) {
            newCap = minCapacity
        }
        this.reallocateBuffer(newCap)
    }

    private reallocateBuffer(capacity: number) {
        if (capacity > 0 && capacity < AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT && capacity > this._size) {
            this._bytes = this._bytes.copyTo(ByteBuffer.allocate(capacity), 0, 0, this._size)
        }
    }

    public getNBytes(startIndex: number, n: number): ByteBuffer {
        if (this.rangeCheck(startIndex) && this.rangeCheck(startIndex + n - 1)) {
            // let temp: ByteBuffer = ByteBuffer.allocate(n);
            // this._bytes.copyTo(temp, 0, startIndex, n);
            return this._bytes.copy(startIndex, startIndex + n)
        } else {
            return ByteBuffer.allocate(n)
        }
    }

    public add(byte: ByteBuffer): boolean {
        this.ensureCapacityInternal(this._size + 1)
        byte.copyTo(this._bytes, this._bytes.buffer.length, 0, 1)
        this._size += 1
        return true;
    }

    public addAll(bytes: ByteBuffer): boolean {
        if (bytes != null && bytes.buffer.length > 0) {
            let numNew = bytes.buffer.length;
            this.ensureCapacityInternal(this._size + numNew);
            bytes.copyTo(this._bytes, this._size, 0, numNew);
            this._size += numNew;
            return true;
        }
        return false;
    }

    public remove(index: number) {
        if (this.rangeCheck(index)) {
            let numMoved = this._size - index - 1
            if (numMoved > 0) {
                this._bytes.copyTo(this._bytes, index, index + 1, numMoved);
                this._size -= 1;
            }
        }
    }

    public removeNBytes(startIndex: number, n: number) {
        if (this.rangeCheck(startIndex) && this.rangeCheck(startIndex + n - 1)) {
            let numMoved = this._size - startIndex - n;
            if (numMoved > 0) {
                this._bytes.copyTo(this._bytes, startIndex, startIndex + n + 1, numMoved);
                this._size -= n;
            }
        }
    }

    public clear() {
        this._size = 0
    }

    private rangeCheck(index: number): boolean {
        if (index >= this._size) {
            return false;
        }
        return true;
    }
}