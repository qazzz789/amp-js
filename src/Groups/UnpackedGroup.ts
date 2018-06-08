import {GroupHeader} from "./GroupHeader";
import ByteBuffer = require("bytebuffer");
import {Amplet} from "../Amplet";
import {GroupID} from "./GroupID";
import {AmpConstants} from "../AmpConstants";
import {GroupTools} from "./GroupTools";
import BigNumber from "bignumber.js";
import {HeadlessAmplet} from "../HeadlessAmplet";
import {IAmpAmpletSerializable} from "../Serialization";
import {
    BadArgumentException,
    InvalidClassIDException,
    InvalidClassInstanceIDException,
    InvalidGroupHeaderException, UnsupportedElementSizeException
} from "../Exceptions";
import {ByteTools} from "../ByteTools";

export class UnpackedGroup implements IAmpAmpletSerializable {
    private readonly _header: GroupHeader;
    private _changed: boolean = false;
    private _sealed: boolean = false;

    private _unpackedElements: Array<ByteBuffer> = [];
    private _validGroup: boolean = false;

    private constructor(groupID?: GroupID, byteCountPerElement?: number, header?: GroupHeader, bytes?: ByteBuffer) {
        if (groupID && byteCountPerElement) {
            const classID: number = groupID.classID
            const classInstanceID: number = groupID.classInstanceID

            const validClassID = classID > -1 && classID < AmpConstants.CLASS_ID_MAX_VALUE;
            const validClassInstanceID = classInstanceID > -1 && classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE;
            const validByteCountPerElement = byteCountPerElement > 0 && byteCountPerElement < AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT;

            if (validClassID && validClassInstanceID && validByteCountPerElement) {
                this._unpackedElements = [];
                this._changed = true;

                let temp = GroupHeader.createFromIDEL(groupID, byteCountPerElement);
                if (temp) {
                    this._header = temp;
                } else {
                    throw new InvalidGroupHeaderException("Failed to build group header.");
                }
                if (this._header != null) {
                    this._validGroup = this._header.validGroup
                    if (!this._validGroup)
                    {
                        throw new InvalidGroupHeaderException("Invalid header passed into UnpackedGroup().");
                    }
                } else {
                    throw new InvalidGroupHeaderException("Failed to build group header.");
                }
            } else {
                if (!validClassID)
                {
                    throw new InvalidClassIDException(classID);
                }

                if (!validClassInstanceID)
                {
                    throw new InvalidClassInstanceIDException(classInstanceID);
                }

                if (!validByteCountPerElement)
                {
                    throw new UnsupportedElementSizeException(byteCountPerElement);
                }
                throw new InvalidGroupHeaderException("Failed to build group header.");
            }
        } else if (header && bytes) {
            this._sealed = true
            this._header = header
            this._validGroup = this._header.validGroup

            if (this._validGroup) {
                this._unpackedElements = GroupTools.unpackElementsFromByteArray(this._header, bytes);
                if (!this._unpackedElements) {
                    this._validGroup = false
                }
            } else {
                throw new InvalidGroupHeaderException("Invalid header passed into UnpackedGroup().");
            }
        } else if (header) {
            this._unpackedElements = [];
            this._changed = true;
            this._header = header;
            this._validGroup =  this._header.validGroup
        } else {
            throw new BadArgumentException("Null argument was passed into UnpackedGroup().");
        }
    }

    public static createFromGroupIDLen(groupID: GroupID, byteCountPerElement: number): UnpackedGroup {
        return new UnpackedGroup(groupID, byteCountPerElement)
    }

    public static createFromGroupHeaderBytes(header: GroupHeader, bytes: ByteBuffer): UnpackedGroup {
            return new UnpackedGroup(undefined, undefined, header, bytes);
    }

    public static createFromGroupHeader(header: GroupHeader): UnpackedGroup {
        return new UnpackedGroup(undefined , undefined, header);
    }

    get header(): GroupHeader {
        return this._header;
    }

    get changed(): boolean {
        return this._changed;
    }

    get validGroup(): boolean {
        return this._validGroup;
    }

    public getNumberOfElements(): number {
        if (this._validGroup) {
            return this._unpackedElements.length
        }
        return 0
    }

    public getElement(index: number) {
        if (this._validGroup && index <= (this._unpackedElements.length - 1)) {
            return this._unpackedElements[index].clone(true)
        }
        return ByteBuffer.allocate(0);
    }

    public getElementAsByte(index: number): number | undefined  {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants.BYTE_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readByte(0);
        }
        return undefined;
    }

    public getElementAsUnsignedInt(index: number): number | undefined  {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants.INT_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readUint32(0)
        }
        return undefined;
    }

    public getElementAsInt(index: number): number | undefined  {
        if (this._validGroup && index <= (this._unpackedElements.length - 1) && this.header.byteCountPerElement == AmpConstants.INT_BYTE_FOOTPRINT) {
            return this._unpackedElements[0].readInt32(0)
        }
        return undefined;
    }

    public getElementAsString(index: number): string | undefined  {
        if (this._validGroup && index <= (this._unpackedElements.length -1)) {
            return this._unpackedElements[index].toUTF8();
        }
        return undefined;
    }

    public getElementAsBigNumber(index: number): BigNumber | undefined  {
        if (this._validGroup && index <= (this._unpackedElements.length -1)) {
            return ByteTools.buildBigNumber(this._unpackedElements[index])
        }
        return undefined;
    }

    public getElementAsHeadlessAmplet(index: number): HeadlessAmplet | undefined  {
        if (this._validGroup) {
            return HeadlessAmplet.createFromByteBuffer(this._unpackedElements[index])
        }
        return undefined;
    }

    public getElementAsAmplet(index: number): Amplet | undefined {
        if (this._validGroup && this._header.isAmpletCompatible()) {
            return Amplet.createFromBytes(this._unpackedElements[index])
        }
        return undefined;
    }

    public addElement(element: ByteBuffer): boolean {
        if (this._validGroup && !this.isWriteLockedAndSealed() && this._unpackedElements.length < (AmpConstants.ELEMENT_COUNT_MAX - 1)) {
            if (element.buffer.length === this._header.byteCountPerElement) {
                this._unpackedElements.push(element.clone(true))
                this._header.elementCount = this._unpackedElements.length;
                this._changed = true;
                return true;
            }
        }
        return false;
    }

    public removeElement(index: number) {
        if (this._validGroup && !this.isWriteLockedAndSealed() && index < (this._unpackedElements.length - 1)) {
            this._unpackedElements.splice(index, 1)
            this._header.elementCount = this._unpackedElements.length;
            this._changed = true;
            return true;
        }
        return false;
    }

    public clearElements(): boolean {
        if (this._validGroup && !this.isWriteLockedAndSealed()) {
            this._unpackedElements = []
            this._header.elementCount = this._unpackedElements.length
            this._changed = true;
            return true;
        }
        return false;
    }

    public isWriteLockedAndSealed(): boolean {
        return (this._header.isWriteLocked() && this._sealed)
    }

    public doesGroupHaveExpectedByteCountPerElement(byteCount: number): boolean {
        return this._header.byteCountPerElement === byteCount
    }

    public seal(): void {
        this._sealed = true;
    }

    public packElementsIntoByteArray(): ByteBuffer {
        return GroupTools.packElementsIntoByteArray(this._header, this._unpackedElements)
    }

    serializeToAmplet(): Amplet {
        return Amplet.createFromUnpacked(this);
    }
}