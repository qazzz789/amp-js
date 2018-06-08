"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_error_1 = __importDefault(require("ts-error"));
const AmpConstants_1 = require("../AmpConstants");
const ByteTools_1 = require("../ByteTools");
class AmpException extends ts_error_1.default {
    constructor(message) {
        super(message);
    }
    static enableExceptions() {
        AmpException._exceptionsEnabled = true;
    }
    static disableExceptions() {
        AmpException._exceptionsEnabled = false;
    }
    static areExceptionsEnabled() {
        return AmpException._exceptionsEnabled;
    }
}
AmpException._exceptionsEnabled = true;
exports.AmpException = AmpException;
class AmpBackingListIndexOutOfBoundsException extends AmpException {
    constructor(index, size) {
        super('Index: ' + index + ' Size: ' + size);
    }
}
exports.AmpBackingListIndexOutOfBoundsException = AmpBackingListIndexOutOfBoundsException;
class BadArgumentException extends AmpException {
    constructor(message) {
        super(message);
    }
}
exports.BadArgumentException = BadArgumentException;
class ByteArrayOperationFailureException extends AmpException {
}
exports.ByteArrayOperationFailureException = ByteArrayOperationFailureException;
class ClassIDNotAmplifiedException extends AmpException {
    constructor() {
        super('Failed to store Amplet as element because the class ID was not amplified.');
    }
}
exports.ClassIDNotAmplifiedException = ClassIDNotAmplifiedException;
class DuplicateGroupIDException extends AmpException {
    constructor(collidingGroupID, registeredGroupID) {
        super(DuplicateGroupIDException.generateMessage(collidingGroupID, registeredGroupID));
    }
    static generateMessage(collidingGroupID, registeredGroupID) {
        return "\nThere are colliding Amp Group IDs.\nColliding Class ID is: " + collidingGroupID.classID +
            "\nColliding Class Instance ID is: " + collidingGroupID.classInstanceID +
            "\nThe name of this Group ID is: " + collidingGroupID.name +
            "\nThe name of the other Group ID is: " + registeredGroupID.name;
    }
}
exports.DuplicateGroupIDException = DuplicateGroupIDException;
class InvalidAmpletException extends AmpException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidAmpletException = InvalidAmpletException;
class InvalidAmpletExceptionOptional extends InvalidAmpletException {
    constructor(areGroupsValid, doRepeatGroupIDsExist, areThereSufficientBytes) {
        super(InvalidAmpletExceptionOptional.generateMessage(areGroupsValid, doRepeatGroupIDsExist, (areThereSufficientBytes) ? areThereSufficientBytes : true));
    }
    static generateMessage(areGroupsValid, doRepeatGroupIDsExist, areThereSufficientBytes) {
        let message = '';
        if (!areGroupsValid) {
            message += 'Groups are not valid. ';
        }
        if (doRepeatGroupIDsExist) {
            message += 'Repeat group IDs exist. ';
        }
        if (!areThereSufficientBytes) {
            message += 'Byte count does not match header records.';
        }
        return message;
    }
}
exports.InvalidAmpletExceptionOptional = InvalidAmpletExceptionOptional;
class InvalidAmpletHeaderException extends AmpException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidAmpletHeaderException = InvalidAmpletHeaderException;
class InvalidClassIDException extends AmpException {
    constructor(classID) {
        super(InvalidClassIDException.generateMessage(classID));
    }
    static generateMessage(classID) {
        if (classID < 0) {
            return "Class ID must be greater than -1.";
        }
        if (classID >= AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE) {
            return "Class ID must be smaller than " + AmpConstants_1.AmpConstants.CLASS_ID_MAX_VALUE + ".";
        }
        return '';
    }
}
exports.InvalidClassIDException = InvalidClassIDException;
class InvalidClassInstanceIDException extends AmpException {
    constructor(classInstanceID) {
        super(InvalidClassInstanceIDException.generateMessage(classInstanceID));
    }
    static generateMessage(classInstanceID) {
        if (classInstanceID < 0) {
            return "Class Instance ID must be greater than -1.";
        }
        if (classInstanceID >= AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE) {
            return "Class Instance ID must be smaller than " + AmpConstants_1.AmpConstants.CLASS_INSTANCE_ID_MAX_VALUE + ".";
        }
        return '';
    }
}
exports.InvalidClassInstanceIDException = InvalidClassInstanceIDException;
class InvalidGroupException extends AmpException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidGroupException = InvalidGroupException;
class InvalidGroupHeaderException extends AmpException {
    constructor(message) {
        super(message);
    }
}
exports.InvalidGroupHeaderException = InvalidGroupHeaderException;
class UnsupportedAmpletSizeException extends AmpException {
    constructor(ampletSize) {
        super(UnsupportedAmpletSizeException.generateMessage(ampletSize));
    }
    static generateMessage(ampletSize) {
        if (ampletSize <= 0) {
            return "Amplet must not be smaller than 1 bytes.";
        }
        if (ampletSize >= AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
            return "Amplet must not equal or exceed " + AmpConstants_1.AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT + " bytes.";
        }
        return '';
    }
}
exports.UnsupportedAmpletSizeException = UnsupportedAmpletSizeException;
class UnsupportedAmpVersionException extends AmpException {
    constructor(version) {
        super(UnsupportedAmpVersionException.generateMessage(version));
    }
    static generateMessage(version) {
        let versionArray = ByteTools_1.ByteTools.deconcatenateShorts(version);
        let ampletVersion = versionArray[0] + "." + versionArray[1];
        return "\nAmp Standard version mismatch detected during deserialization.\nSerialized Amplet used Amp Standard " + ampletVersion + " and this library uses Amp Standard " + AmpConstants_1.AmpConstants.VERSIONSTRING + ".";
    }
}
exports.UnsupportedAmpVersionException = UnsupportedAmpVersionException;
class UnsupportedGroupCountException extends AmpException {
    constructor(groupCount) {
        super(UnsupportedGroupCountException.generateMessage(groupCount));
    }
    static generateMessage(groupCount) {
        if (groupCount <= 0) {
            return "There must be at least one group.";
        }
        if (groupCount >= AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
            return "The number of groups must not equal of exceed " + AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT + ".";
        }
        return '';
    }
}
exports.UnsupportedGroupCountException = UnsupportedGroupCountException;
class UnsupportedElementSizeException extends AmpException {
    constructor(elementLength) {
        super(UnsupportedElementSizeException.generateMessage(elementLength));
    }
    static generateMessage(elementLength) {
        if (elementLength <= 0) {
            return "Element byte footprint must not be smaller than 1.";
        }
        if (elementLength >= AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT) {
            return "Element byte footprint must not equal or exceed " + AmpConstants_1.AmpConstants.ELEMENT_MAX_BYTE_FOOTPRINT + ".";
        }
        return '';
    }
}
exports.UnsupportedElementSizeException = UnsupportedElementSizeException;
class UnsupportedNumberOfElementsException extends AmpException {
    constructor(elementCount) {
        super(UnsupportedNumberOfElementsException.generateMessage(elementCount));
    }
    static generateMessage(elementCount) {
        if (elementCount <= 0) {
            return "There must be at least one group.";
        }
        if (elementCount >= AmpConstants_1.AmpConstants.ELEMENT_COUNT_MAX) {
            return "The number of groups must not equal of exceed " + AmpConstants_1.AmpConstants.ELEMENT_COUNT_MAX + ".";
        }
        return '';
    }
}
exports.UnsupportedNumberOfElementsException = UnsupportedNumberOfElementsException;
