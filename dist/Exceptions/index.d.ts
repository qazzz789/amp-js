import ExtendableError from "ts-error";
import { GroupID } from "../Groups/GroupID";
export declare class AmpException extends ExtendableError {
    private static _exceptionsEnabled;
    constructor(message: string);
    static enableExceptions(): void;
    static disableExceptions(): void;
    static areExceptionsEnabled(): boolean;
}
export declare class AmpBackingListIndexOutOfBoundsException extends AmpException {
    constructor(index: number, size: number);
}
export declare class BadArgumentException extends AmpException {
    constructor(message: string);
}
export declare class ByteArrayOperationFailureException extends AmpException {
}
export declare class ClassIDNotAmplifiedException extends AmpException {
    constructor();
}
export declare class DuplicateGroupIDException extends AmpException {
    constructor(collidingGroupID: GroupID, registeredGroupID: GroupID);
    private static generateMessage(collidingGroupID, registeredGroupID);
}
export declare class InvalidAmpletException extends AmpException {
    constructor(message: string);
}
export declare class InvalidAmpletExceptionOptional extends InvalidAmpletException {
    constructor(areGroupsValid: boolean, doRepeatGroupIDsExist: boolean, areThereSufficientBytes?: boolean);
    private static generateMessage(areGroupsValid, doRepeatGroupIDsExist, areThereSufficientBytes);
}
export declare class InvalidAmpletHeaderException extends AmpException {
    constructor(message: string);
}
export declare class InvalidClassIDException extends AmpException {
    constructor(classID: number);
    private static generateMessage(classID);
}
export declare class InvalidClassInstanceIDException extends AmpException {
    constructor(classInstanceID: number);
    private static generateMessage(classInstanceID);
}
export declare class InvalidGroupException extends AmpException {
    constructor(message: string);
}
export declare class InvalidGroupHeaderException extends AmpException {
    constructor(message: string);
}
export declare class UnsupportedAmpletSizeException extends AmpException {
    constructor(ampletSize: number);
    private static generateMessage(ampletSize);
}
export declare class UnsupportedAmpVersionException extends AmpException {
    constructor(version: number);
    private static generateMessage(version);
}
export declare class UnsupportedGroupCountException extends AmpException {
    constructor(groupCount: number);
    private static generateMessage(groupCount);
}
export declare class UnsupportedElementSizeException extends AmpException {
    constructor(elementLength: number);
    private static generateMessage(elementLength);
}
export declare class UnsupportedNumberOfElementsException extends AmpException {
    constructor(elementCount: number);
    private static generateMessage(elementCount);
}
