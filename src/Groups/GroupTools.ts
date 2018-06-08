import {GroupHeader} from "./GroupHeader";
import ByteBuffer = require("bytebuffer");
import {PackedGroup} from "./PackedGroup";
import {GroupHeaderTools} from "./GroupHeaderTools";
import {UnpackedGroup} from "./UnpackedGroup";
import {ByteTools} from "../ByteTools";
import {AmpConstants} from "../AmpConstants";
import {BadArgumentException, InvalidGroupHeaderException} from "../Exceptions";

export class GroupTools {
    public static unpackElementsFromByteArray(header: GroupHeader, bytes: ByteBuffer): Array<ByteBuffer> {
        if (header && bytes) {
            if (header.validGroup) {
                const elementCount = header.elementCount;
                let unpackedElements: Array<ByteBuffer> = [];
                let byteCountPerElement: number = header.byteCountPerElement;
                let copyPosition: number = header.byteArrayStartPosition;

                for (let i = 0; i < elementCount; i++) {
                    // let element: ByteBuffer = ByteBuffer.allocate(byteCountPerElement)
                    // bytes.copyTo(element, 0, copyPosition, byteCountPerElement)
                    let element = bytes.copy(copyPosition, copyPosition + byteCountPerElement);
                    copyPosition += byteCountPerElement
                    unpackedElements.push(element)
                }
                if (unpackedElements.length > 0) {
                    return unpackedElements;
                }
            }
        }
        return [];
    }

    public static extractPackedGroupBytes(header: GroupHeader, bytes: ByteBuffer): ByteBuffer {
        if (header && bytes) {
            if (header.validGroup) {
                let packedElements = bytes.copy(header.byteArrayStartPosition, header.byteArrayStartPosition + header.byteCountTotalAllElements)
                if (packedElements.buffer.length > 0) {
                    return packedElements
                }
            }
        }
        return ByteBuffer.allocate(0);
    }

    public static packGroupFromByteArray(header: GroupHeader, bytes: ByteBuffer): PackedGroup {
        if (header && bytes) {
            if (header.validGroup) {
                return PackedGroup.createFromHeaderAndElements(GroupHeaderTools.packHeader(header), this.extractPackedGroupBytes(header, bytes))
            } else {
                throw new InvalidGroupHeaderException("Invalid group header passed into packGroupFromByteArray().");
            }
        } else {
            if (!header)
            {
                throw new BadArgumentException("Null _header argument was passed into packGroupFromByteArray().");
            }

            if (!bytes)
            {
                throw new BadArgumentException("Null _bytes argument was passed into packGroupFromByteArray().");
            }
            throw new BadArgumentException("Null argument was passed into packGroupFromByteArray().");
        }
    }

    public static repackUnpackedGroup(unpackedGroup: UnpackedGroup): PackedGroup {
        if (unpackedGroup) {
            if (unpackedGroup.validGroup) {
                return PackedGroup.createFromHeaderAndElements(GroupHeaderTools.packHeader(unpackedGroup.header), unpackedGroup.packElementsIntoByteArray())
            } else {
                throw new InvalidGroupHeaderException("Invalid group header passed into repackUnpackedGroup().");
            }
        } else {
            throw new BadArgumentException("Null _unpackedGroup argument was passed into repackUnpackedGroup().");
        }
    }

    public static packElementsIntoByteArray(header: GroupHeader, unpackedElements: Array<ByteBuffer>): ByteBuffer {
        if (header && unpackedElements) {
            if (header.validGroup) {
                let byteCountPerElement: number = header.byteCountPerElement
                let totalBytes: number = header.byteCountTotalAllElements

                let packedElements: ByteBuffer = ByteBuffer.allocate(totalBytes);
                let position: number = 0;

                for (let i = 0; i < unpackedElements.length; i++) {
                    let temp: ByteBuffer = unpackedElements[i]
                    temp.copyTo(packedElements, position, 0, byteCountPerElement)
                    position += byteCountPerElement
                }

                if (packedElements.buffer.length > 0) {
                    return packedElements
                }
            }
        }
        return ByteBuffer.allocate(0);
    }

    public static buildAmpletBytesFromUnpackedGroups(unpackedGroups: Array<UnpackedGroup>): ByteBuffer {
        if (unpackedGroups) {
            let packedGroups: Array<PackedGroup> = unpackedGroups.map((item: UnpackedGroup) => {
                return GroupTools.repackUnpackedGroup(item)
            });
            return GroupTools.buildAmpletBytesFromPackedGroups(packedGroups, undefined)
        } else {
            throw new BadArgumentException("Null _unpackedGroup argument was passed into buildAmpletBytesFromUnpackedGroups().");
        }
    }

    public static buildAmpletBytesFromPackedGroups(packedGroups: Array<PackedGroup>, trailer?: ByteBuffer): ByteBuffer {
        if (packedGroups) {
            let position: number = 0;
            let versionBytes: ByteBuffer = ByteTools.deconstructInt(AmpConstants.VERSIONASINTEGER())

            let groupsCount: number = packedGroups.length;
            let groupsCountBytes: ByteBuffer = ByteTools.deconstructInt(groupsCount);
            let headerByteCount: number = AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants.INT_BYTE_FOOTPRINT + groupsCount * AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            let elementsByteCount: number = 0;

            packedGroups.forEach((item: PackedGroup) => {
                elementsByteCount += item.byteCountTotalAllElements;
            });

            let trailerByteCount: number = 0;

            if (trailer) {
                trailerByteCount = trailer.buffer.length
            }

            let totalByteCount: number = headerByteCount + elementsByteCount + trailerByteCount;
            if (totalByteCount < 1 || totalByteCount > AmpConstants.BYTE_ARRAY_MAX_BYTE_COUNT)
            {
                return ByteBuffer.allocate(0);
            }

            let bytes: ByteBuffer = ByteBuffer.allocate(totalByteCount);

            versionBytes.copyTo(bytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants.INT_BYTE_FOOTPRINT;
            groupsCountBytes.copyTo(bytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants.INT_BYTE_FOOTPRINT;

            packedGroups.forEach((item: PackedGroup) => {
                item.packedHeaderBytes.copyTo(bytes, position, 0, AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT);
                position += AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            })

            packedGroups.forEach((item: PackedGroup) => {
                let temp: ByteBuffer = item.packedElementsBytes;
                let tempLength: number = temp.buffer.length;
                temp.copyTo(bytes, position, 0, tempLength);
                position += tempLength;
            })

            if (trailer) {
                trailer.copyTo(bytes, position, 0, trailerByteCount)
            }
            return bytes
        }
        return ByteBuffer.allocate(0);
    }

}