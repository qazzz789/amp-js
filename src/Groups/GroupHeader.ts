import {GroupID} from "./GroupID";
import {ByteTools} from "../ByteTools";
import Long = require("long");
import {AmpConstants} from "../AmpConstants";
import {
    BadArgumentException,
    InvalidClassIDException,
    InvalidClassInstanceIDException,
    UnsupportedElementSizeException, UnsupportedNumberOfElementsException
} from "../Exceptions";

export class GroupHeader {

    private _groupID: GroupID;
    private _classID: number = 0;
    private _classInstanceID: number = 0;

    private _byteCountPerElement: number = 0;
    private _elementCount: number = 0;

    private _byteCountTotalAllElements: number = 0;

    private _byteArrayStartPosition: number = 0;
    private _byteArrayEndPosition: number = 0;

    private _markedForDeletion: boolean = false;
    private _validGroup: boolean = false;

    private constructor(groupID: GroupID, byteCountPerElement: number, elementCount?: number, byteArrayStartPosition?: number) {
        if (groupID) {
            this._groupID = groupID;
            this._classID = this._groupID.classID;
            this._classInstanceID = this._groupID.classInstanceID;

            const validClassID: boolean = this._classID > -1 && this._classID < AmpConstants.CLASS_ID_MAX_VALUE;
            const validClassInstanceID: boolean = this._classInstanceID > -1 && this._classInstanceID < AmpConstants.CLASS_ID_MAX_VALUE;
            const validByteCountPerElement: boolean = byteCountPerElement > 0 && byteCountPerElement < AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT;

            if (validClassID && validClassInstanceID && validByteCountPerElement) {
                this._byteCountPerElement = byteCountPerElement;
                this._validGroup = true;

                if (elementCount && byteArrayStartPosition) {
                    const validElementCount: boolean = elementCount > 0 && elementCount < AmpConstants.ELEMENT_COUNT_MAX;
                    if (validElementCount) {
                        this._elementCount = elementCount
                        this._byteCountTotalAllElements = this._elementCount * this._byteCountPerElement;
                        this._byteArrayStartPosition = byteArrayStartPosition
                        this._byteArrayEndPosition = this._byteArrayStartPosition + this._byteCountTotalAllElements
                    } else {
                        throw new UnsupportedNumberOfElementsException(elementCount);
                    }
                }
            } else {
                if (!validClassID)
                {
                    throw new InvalidClassIDException(this._classID);
                }

                if (!validClassInstanceID)
                {
                    throw new InvalidClassInstanceIDException(this._classInstanceID);
                }

                if (!validByteCountPerElement)
                {
                    throw new UnsupportedElementSizeException(byteCountPerElement);
                }
                throw new BadArgumentException("Null argument was passed into GroupHeader().");
            }
        } else {
            throw new BadArgumentException("Null _groupID argument was passed into GroupHeader().");
        }
    }

    public static createFromIDEL(groupID: GroupID, byteCountPerElement: number): GroupHeader  {
        return new GroupHeader(groupID, byteCountPerElement);
    }

    public static createIDELCNPS(groupID: GroupID, byteCountPerElement: number, elementCount: number, byteArrayStartPosition: number): GroupHeader  {
        return new GroupHeader(groupID, byteCountPerElement, elementCount,byteArrayStartPosition);;
    }

    set elementCount(value: number) {
        if (this._validGroup) {
            if (value < 0) {
                value = 0
            }
            this._elementCount = value;
            this._byteCountTotalAllElements = this._elementCount * this._byteCountPerElement;
            this._byteArrayEndPosition = this._byteArrayStartPosition + this._byteCountTotalAllElements;
        }
    }

    get groupID(): GroupID {
        return this._groupID;
    }

    get classID(): number {
        return this._classID;
    }

    get classInstanceID(): number {
        return this._classInstanceID;
    }

    get byteCountPerElement(): number {
        return this._byteCountPerElement;
    }

    get elementCount(): number {
        return this._elementCount;
    }

    get byteCountTotalAllElements(): number {
        return this._byteCountTotalAllElements;
    }

    get byteArrayStartPosition(): number {
        return this._byteArrayStartPosition;
    }

    get byteArrayEndPosition(): number {
        return this._byteArrayEndPosition;
    }

    get markedForDeletion(): boolean {
        return this._markedForDeletion;
    }

    get validGroup(): boolean {
        return this._validGroup;
    }

    public isWriteLocked(): boolean {
        return ByteTools.isClassIDWriteLocked(this.classID);
    }

    public isAmpletCompatible(): boolean {
        return ByteTools.isClassIDAmplified(this.classID);
    }

    public markForDeletion(): void {
        this._markedForDeletion = !this.isWriteLocked();
    }
}