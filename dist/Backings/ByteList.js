"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer = require("bytebuffer");
const GrowModeEnum_1 = require("./GrowModeEnum");
const AmpConstants_1 = require("../AmpConstants");
class ByteList {
    constructor(bytes, capacity) {
        this._size = 0;
        this._growMode = GrowModeEnum_1.GrowModeEnum.NATURAL;
        if (bytes) {
            this._bytes = bytes.clone(true);
            this._size = bytes.buffer.length;
        }
        else if (capacity) {
            if (capacity > 0) {
                this._bytes = ByteBuffer.allocate(capacity);
            }
            else {
                this._bytes = ByteBuffer.allocate(ByteList._DEFAULT_CAPACITY);
            }
        }
        else {
            this._bytes = ByteBuffer.allocate(ByteList._DEFAULT_CAPACITY);
            this._size = ByteList._DEFAULT_CAPACITY;
        }
    }
    setGrowMode(growMode) {
        this._growMode = growMode;
    }
    get getGrowMode() {
        return this._growMode;
    }
    get size() {
        return this._size;
    }
    isEmpty() {
        return this._size === 0;
    }
    copy() {
        return new ByteList(this._bytes.clone(true));
    }
    toArray() {
        return this._bytes.clone(true);
    }
    trimToSize() {
        if (this._size < this._bytes.buffer.length) {
            if (this._size === 0) {
                this._bytes = ByteBuffer.allocate(0);
                return;
            }
            this.reallocateBuffer(this._size);
        }
    }
    ensureCapacity(minCap) {
        if (minCap <= this._bytes.buffer.length || (this._bytes.buffer.length === 0 && minCap < ByteList._DEFAULT_CAPACITY)) {
            return;
        }
        this.ensureExplicitCapacity(minCap);
    }
    ensureCapacityInternal(minCap) {
        let temp = minCap;
        if (this._bytes.buffer.length === 0) {
            temp = Math.max(minCap, ByteList._DEFAULT_CAPACITY);
        }
        this.ensureExplicitCapacity(temp);
    }
    ensureExplicitCapacity(minCap) {
        if (minCap - this._bytes.buffer.length > 0) {
            this.grow(minCap);
        }
    }
    grow(minCapacity) {
        let oldCap = this._bytes.buffer.length;
        let newCap;
        if (this._growMode === GrowModeEnum_1.GrowModeEnum.NATURAL) {
            newCap = oldCap + (oldCap >> 1);
        }
        else {
            newCap = oldCap + this._growMode;
        }
        if (newCap - minCapacity < 0) {
            newCap = minCapacity;
        }
        this.reallocateBuffer(newCap);
    }
    reallocateBuffer(capacity) {
        if (capacity > 0 && capacity < AmpConstants_1.AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT && capacity > this._size) {
            this._bytes = this._bytes.copyTo(ByteBuffer.allocate(capacity), 0, 0, this._size);
        }
    }
    getNBytes(startIndex, n) {
        if (this.rangeCheck(startIndex) && this.rangeCheck(startIndex + n - 1)) {
            // let temp: ByteBuffer = ByteBuffer.allocate(n);
            // this._bytes.copyTo(temp, 0, startIndex, n);
            return this._bytes.copy(startIndex, startIndex + n);
        }
        else {
            return ByteBuffer.allocate(n);
        }
    }
    add(byte) {
        this.ensureCapacityInternal(this._size + 1);
        byte.copyTo(this._bytes, this._bytes.buffer.length, 0, 1);
        this._size += 1;
        return true;
    }
    addAll(bytes) {
        if (bytes != null && bytes.buffer.length > 0) {
            let numNew = bytes.buffer.length;
            this.ensureCapacityInternal(this._size + numNew);
            bytes.copyTo(this._bytes, this._size, 0, numNew);
            this._size += numNew;
            return true;
        }
        return false;
    }
    remove(index) {
        if (this.rangeCheck(index)) {
            let numMoved = this._size - index - 1;
            if (numMoved > 0) {
                this._bytes.copyTo(this._bytes, index, index + 1, numMoved);
                this._size -= 1;
            }
        }
    }
    removeNBytes(startIndex, n) {
        if (this.rangeCheck(startIndex) && this.rangeCheck(startIndex + n - 1)) {
            let numMoved = this._size - startIndex - n;
            if (numMoved > 0) {
                this._bytes.copyTo(this._bytes, startIndex, startIndex + n + 1, numMoved);
                this._size -= n;
            }
        }
    }
    clear() {
        this._size = 0;
    }
    rangeCheck(index) {
        if (index >= this._size) {
            return false;
        }
        return true;
    }
}
ByteList._DEFAULT_CAPACITY = 0;
ByteList._UNINFLATED = ByteBuffer.allocate(0);
exports.ByteList = ByteList;
