import ExtendableError from "ts-error";
import {AmpConstants} from "../AmpConstants";
import {ByteTools} from "../ByteTools";
import {GroupID} from "../Groups/GroupID";

export class AmpException extends ExtendableError{
    private static _exceptionsEnabled: boolean = true;

    constructor(message: string) {
        super(message)
    }

    public static enableExceptions() {
        AmpException._exceptionsEnabled = true;
    }

    public static disableExceptions() {
        AmpException._exceptionsEnabled = false;
    }

    public static areExceptionsEnabled(): boolean {
        return AmpException._exceptionsEnabled;
    }
}

export class AmpBackingListIndexOutOfBoundsException extends AmpException{
    constructor(index: number, size: number) {
        super('Index: ' + index + ' Size: ' + size)
    }
}

export class BadArgumentException extends AmpException {
    constructor(message: string) {
        super(message)
    }
}

export class ByteArrayOperationFailureException extends AmpException {
}

export class ClassIDNotAmplifiedException extends AmpException {
    constructor() {
        super('Failed to store Amplet as element because the class ID was not amplified.')
    }
}

export class DuplicateGroupIDException extends AmpException {
    constructor(collidingGroupID: GroupID, registeredGroupID: GroupID) {
        super(DuplicateGroupIDException.generateMessage(collidingGroupID, registeredGroupID))
    }

    private static generateMessage(collidingGroupID: GroupID, registeredGroupID: GroupID): string
    {
        return "\nThere are colliding Amp Group IDs.\nColliding Class ID is: " + collidingGroupID.classID +
            "\nColliding Class Instance ID is: " + collidingGroupID.classInstanceID +
            "\nThe name of this Group ID is: " + collidingGroupID.name +
            "\nThe name of the other Group ID is: " + registeredGroupID.name;
    }
}

export class InvalidAmpletException extends AmpException {
    constructor(message: string) {
        super(message)
    }
}

export  class InvalidAmpletExceptionOptional extends InvalidAmpletException {
    constructor(areGroupsValid: boolean, doRepeatGroupIDsExist: boolean, areThereSufficientBytes?: boolean) {
        super(InvalidAmpletExceptionOptional.generateMessage(areGroupsValid, doRepeatGroupIDsExist, (areThereSufficientBytes)? areThereSufficientBytes: true))
    }

    private static generateMessage(areGroupsValid: boolean, doRepeatGroupIDsExist: boolean, areThereSufficientBytes: boolean): string {
        let message = '';

        if (!areGroupsValid)
        {
            message += 'Groups are not valid. ';
        }
        if (doRepeatGroupIDsExist)
        {
            message += 'Repeat group IDs exist. ';
        }
        if (!areThereSufficientBytes)
        {
            message += 'Byte count does not match header records.';
        }
        return message;
    }
}

export class InvalidAmpletHeaderException extends AmpException{
    constructor(message: string) {
        super(message)
    }
}

export class InvalidClassIDException extends AmpException{
    constructor(classID: number) {
        super(InvalidClassIDException.generateMessage(classID))
    }

    private static generateMessage(classID: number): string {
        if (classID < 0)
        {
            return "Class ID must be greater than -1.";
        }

        if (classID >= AmpConstants.CLASS_ID_MAX_VALUE)
        {
            return "Class ID must be smaller than " + AmpConstants.CLASS_ID_MAX_VALUE + ".";
        }

        return '';
    }
}

export class InvalidClassInstanceIDException extends AmpException{
    constructor(classInstanceID: number) {
        super(InvalidClassInstanceIDException.generateMessage(classInstanceID))
    }

    private static generateMessage(classInstanceID: number): string {
        if (classInstanceID < 0)
        {
            return "Class Instance ID must be greater than -1.";
        }

        if (classInstanceID >= AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE)
        {
            return "Class Instance ID must be smaller than " + AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE + ".";
        }

        return '';
    }
}

export class InvalidGroupException extends AmpException{
    constructor(message: string) {
        super(message)
    }
}

export class InvalidGroupHeaderException extends AmpException{
    constructor(message: string) {
        super(message)
    }
}

export class UnsupportedAmpletSizeException extends AmpException{
    constructor(ampletSize: number) {
        super(UnsupportedAmpletSizeException.generateMessage(ampletSize))
    }

    private static generateMessage(ampletSize: number): string {
        if (ampletSize <= 0)
        {
            return "Amplet must not be smaller than 1 bytes.";
        }

        if (ampletSize >= AmpConstants.GROUPS_MAX_COUNT)
        {
            return "Amplet must not equal or exceed " + AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT + " bytes.";
        }
        return '';
    }
}

export class UnsupportedAmpVersionException extends AmpException{
    constructor(version: number) {
        super(UnsupportedAmpVersionException.generateMessage(version))
    }

    private static generateMessage(version: number): string {
        let versionArray = ByteTools.deconcatenateShorts(version);
        let  ampletVersion =versionArray[0] + "." + versionArray[1];
        return "\nAmp Standard version mismatch detected during deserialization.\nSerialized Amplet used Amp Standard " + ampletVersion + " and this library uses Amp Standard " + AmpConstants.VERSIONSTRING + ".";
    }
}

export class UnsupportedGroupCountException extends AmpException{
    constructor(groupCount: number) {
        super(UnsupportedGroupCountException.generateMessage(groupCount))
    }

    private static generateMessage(groupCount: number): string {
        if (groupCount <= 0)
        {
            return "There must be at least one group.";
        }

        if (groupCount >= AmpConstants.GROUPS_MAX_COUNT)
        {
            return "The number of groups must not equal of exceed " + AmpConstants.GROUPS_MAX_COUNT + ".";
        }
        return '';
    }
}

export class UnsupportedElementSizeException extends AmpException{
    constructor(elementLength: number) {
        super(UnsupportedElementSizeException.generateMessage(elementLength))
    }

    private static generateMessage(elementLength: number): string {
        if (elementLength <= 0)
        {
            return "Element byte footprint must not be smaller than 1.";
        }

        if (elementLength >= AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT)
        {
            return "Element byte footprint must not equal or exceed " + AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT + ".";
        }
        return ''
    }
}

export class UnsupportedNumberOfElementsException extends AmpException{
    constructor(elementCount: number) {
        super(UnsupportedNumberOfElementsException.generateMessage(elementCount))
    }

    private static generateMessage(elementCount: number): string {
        if (elementCount <= 0)
        {
            return "There must be at least one group.";
        }

        if (elementCount >= AmpConstants.ELEMENT_COUNT_MAX)
        {
            return "The number of groups must not equal of exceed " + AmpConstants.ELEMENT_COUNT_MAX + ".";
        }
        return ''
    }
}