import {GroupID} from "../Groups/GroupID";
import {UnpackedGroup} from "../Groups/UnpackedGroup";
import {Amplet} from "../Amplet";
import {IAmpClass} from "./IAmpClass";
import ByteBuffer = require("bytebuffer");
import {AmpConstants} from "../AmpConstants";
import {ByteTools} from "../ByteTools";
import Long = require("long");
import BigNumber from "bignumber.js";
import {
    BadArgumentException,
    InvalidClassIDException,
    InvalidClassInstanceIDException, InvalidGroupException,
    UnsupportedElementSizeException
} from "../Exceptions";
import {IAmpAmpletSerializable, IAmpByteSerializable} from "../Serialization";

export class AC_SingleElement implements IAmpClass, IAmpAmpletSerializable {

    private _groupID: GroupID;
    private _classID: number = 0;
    private _classInstanceID: number = 0;

    private _elementLength: number = 0;

    private _singleElementUnpackedGroup: UnpackedGroup;

    private _validClass: boolean = false;

    private constructor(groupID: GroupID, element: ByteBuffer) {
        if (groupID && element) {
            this._groupID = groupID
            this._classID = this._groupID.classID
            this._classInstanceID = this._groupID.classInstanceID

            this._elementLength = element.buffer.length

            const elementLengthValid: boolean = this._elementLength > 0 && this._elementLength < AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT
            if (elementLengthValid) {
                const classIDValid = this._classID > -1 && this._classID < AmpConstants.CLASS_ID_MAX_VALUE
                const classInstanceIDValid = this._classInstanceID > -1 && this._classInstanceID < AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE
                if (classIDValid && classInstanceIDValid) {
                    this._singleElementUnpackedGroup = UnpackedGroup.createFromGroupIDLen(this._groupID, this._elementLength)
                    if (this._singleElementUnpackedGroup) {
                        this._singleElementUnpackedGroup.addElement(element)
                        this._singleElementUnpackedGroup.seal();
                        this._validClass = true;
                    } else {
                        throw new InvalidGroupException("Unable to make unpacked group.");
                    }
                } else {
                    if (!classIDValid)
                    {
                        throw new InvalidClassIDException(this._classID);
                    }

                    if (!classInstanceIDValid)
                    {
                        throw new InvalidClassInstanceIDException(this._classInstanceID);
                    }
                    throw new InvalidGroupException("Unable to make unpacked group.");
                }
            } else {
                throw new UnsupportedElementSizeException(element.buffer.length);
            }
        } else {
            if (groupID == null)
            {
                throw new BadArgumentException("Null _groupID argument was passed into AC_SingleElement.ts().");
            }

            if (element == null)
            {
                throw new BadArgumentException("Null _element argument was passed into AC_SingleElement.ts().");
            }
            throw new BadArgumentException("Null argument was passed into AC_SingleElement.ts().");
        }
    }

    public static createFromBigNumber(groupID: GroupID, element: BigNumber): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructBigNumber(element))
    }

    public static createFromByteArray(groupID: GroupID, element: ByteBuffer): AC_SingleElement {
        return new AC_SingleElement(groupID, element)
    }

    public static createFromByte(groupID: GroupID, element: number): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteBuffer.allocate(1).writeByte(element).clear())
    }

    public static createFromBoolean(groupID: GroupID, element: boolean): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructBoolean(element))
    }

    public static createFromShort(groupID: GroupID, element: number): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructShort(element))
    }

    public static createFromChar(groupID: GroupID, element: string): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructChar(element))
    }

    public static createFromInt(groupID: GroupID, element: number): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructInt(element))
    }

    public static createFromFloat(groupID: GroupID, element: number): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructFloat(element))
    }

    public static createFromLong(groupID: GroupID, element: BigNumber): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructLong(element))
    }

    public static createFromDouble(groupID: GroupID, element: number): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteTools.deconstructDouble(element))
    }

    public static createFromString(groupID: GroupID, element: string): AC_SingleElement {
        return new AC_SingleElement(groupID, ByteBuffer.fromUTF8(element))
    }

    public static createFromIAmpByteSerializable(groupID: GroupID, element: IAmpByteSerializable): AC_SingleElement {
        return new AC_SingleElement(groupID, element.serializeToBytes())
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

    get validClass(): boolean {
        return this._validClass;
    }

    serializeToAmplet(): Amplet {
        return Amplet.createFromIAmpClass(this);
    }

    public getElement(): ByteBuffer {
        if (this._validClass) {
            return this._singleElementUnpackedGroup.getElement(0)
        }
        return ByteBuffer.allocate(0)
    }

    public getUnpackedGroups(): Array<UnpackedGroup> {
        let tempList: Array<UnpackedGroup> = []
        if (this._validClass) {
            let tempGroup: UnpackedGroup = UnpackedGroup.createFromGroupIDLen(this._groupID, this._elementLength)
            tempGroup.addElement(this.getElement())
            tempGroup.seal()
            tempList.push(tempGroup)
        }
        return tempList;
    }
}