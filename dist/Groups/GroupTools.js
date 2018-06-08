"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer = require("bytebuffer");
const PackedGroup_1 = require("./PackedGroup");
const GroupHeaderTools_1 = require("./GroupHeaderTools");
const ByteTools_1 = require("../ByteTools");
const AmpConstants_1 = require("../AmpConstants");
const Exceptions_1 = require("../Exceptions");
class GroupTools {
    static unpackElementsFromByteArray(header, bytes) {
        if (header && bytes) {
            if (header.validGroup) {
                const elementCount = header.elementCount;
                let unpackedElements = [];
                let byteCountPerElement = header.byteCountPerElement;
                let copyPosition = header.byteArrayStartPosition;
                for (let i = 0; i < elementCount; i++) {
                    // let element: ByteBuffer = ByteBuffer.allocate(byteCountPerElement)
                    // bytes.copyTo(element, 0, copyPosition, byteCountPerElement)
                    let element = bytes.copy(copyPosition, copyPosition + byteCountPerElement);
                    copyPosition += byteCountPerElement;
                    unpackedElements.push(element);
                }
                if (unpackedElements.length > 0) {
                    return unpackedElements;
                }
            }
        }
        return [];
    }
    static extractPackedGroupBytes(header, bytes) {
        if (header && bytes) {
            if (header.validGroup) {
                let packedElements = bytes.copy(header.byteArrayStartPosition, header.byteArrayStartPosition + header.byteCountTotalAllElements);
                if (packedElements.buffer.length > 0) {
                    return packedElements;
                }
            }
        }
        return ByteBuffer.allocate(0);
    }
    static packGroupFromByteArray(header, bytes) {
        if (header && bytes) {
            if (header.validGroup) {
                return PackedGroup_1.PackedGroup.createFromHeaderAndElements(GroupHeaderTools_1.GroupHeaderTools.packHeader(header), this.extractPackedGroupBytes(header, bytes));
            }
            else {
                throw new Exceptions_1.InvalidGroupHeaderException("Invalid group header passed into packGroupFromByteArray().");
            }
        }
        else {
            if (!header) {
                throw new Exceptions_1.BadArgumentException("Null _header argument was passed into packGroupFromByteArray().");
            }
            if (!bytes) {
                throw new Exceptions_1.BadArgumentException("Null _bytes argument was passed into packGroupFromByteArray().");
            }
            throw new Exceptions_1.BadArgumentException("Null argument was passed into packGroupFromByteArray().");
        }
    }
    static repackUnpackedGroup(unpackedGroup) {
        if (unpackedGroup) {
            if (unpackedGroup.validGroup) {
                return PackedGroup_1.PackedGroup.createFromHeaderAndElements(GroupHeaderTools_1.GroupHeaderTools.packHeader(unpackedGroup.header), unpackedGroup.packElementsIntoByteArray());
            }
            else {
                throw new Exceptions_1.InvalidGroupHeaderException("Invalid group header passed into repackUnpackedGroup().");
            }
        }
        else {
            throw new Exceptions_1.BadArgumentException("Null _unpackedGroup argument was passed into repackUnpackedGroup().");
        }
    }
    static packElementsIntoByteArray(header, unpackedElements) {
        if (header && unpackedElements) {
            if (header.validGroup) {
                let byteCountPerElement = header.byteCountPerElement;
                let totalBytes = header.byteCountTotalAllElements;
                let packedElements = ByteBuffer.allocate(totalBytes);
                let position = 0;
                for (let i = 0; i < unpackedElements.length; i++) {
                    let temp = unpackedElements[i];
                    temp.copyTo(packedElements, position, 0, byteCountPerElement);
                    position += byteCountPerElement;
                }
                if (packedElements.buffer.length > 0) {
                    return packedElements;
                }
            }
        }
        return ByteBuffer.allocate(0);
    }
    static buildAmpletBytesFromUnpackedGroups(unpackedGroups) {
        if (unpackedGroups) {
            let packedGroups = unpackedGroups.map((item) => {
                return GroupTools.repackUnpackedGroup(item);
            });
            return GroupTools.buildAmpletBytesFromPackedGroups(packedGroups, undefined);
        }
        else {
            throw new Exceptions_1.BadArgumentException("Null _unpackedGroup argument was passed into buildAmpletBytesFromUnpackedGroups().");
        }
    }
    static buildAmpletBytesFromPackedGroups(packedGroups, trailer) {
        if (packedGroups) {
            let position = 0;
            let versionBytes = ByteTools_1.ByteTools.deconstructInt(AmpConstants_1.AmpConstants.VERSIONASINTEGER());
            let groupsCount = packedGroups.length;
            let groupsCountBytes = ByteTools_1.ByteTools.deconstructInt(groupsCount);
            let headerByteCount = AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + groupsCount * AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            let elementsByteCount = 0;
            packedGroups.forEach((item) => {
                elementsByteCount += item.byteCountTotalAllElements;
            });
            let trailerByteCount = 0;
            if (trailer) {
                trailerByteCount = trailer.buffer.length;
            }
            let totalByteCount = headerByteCount + elementsByteCount + trailerByteCount;
            if (totalByteCount < 1 || totalByteCount > AmpConstants_1.AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT) {
                return ByteBuffer.allocate(0);
            }
            let bytes = ByteBuffer.allocate(totalByteCount);
            versionBytes.copyTo(bytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
            groupsCountBytes.copyTo(bytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
            packedGroups.forEach((item) => {
                item.packedHeaderBytes.copyTo(bytes, position, 0, AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT);
                position += AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            });
            packedGroups.forEach((item) => {
                let temp = item.packedElementsBytes;
                let tempLength = temp.buffer.length;
                temp.copyTo(bytes, position, 0, tempLength);
                position += tempLength;
            });
            if (trailer) {
                trailer.copyTo(bytes, position, 0, trailerByteCount);
            }
            return bytes;
        }
        return ByteBuffer.allocate(0);
    }
}
exports.GroupTools = GroupTools;
