import ByteBuffer = require("bytebuffer");
import {GroupHeader} from "./GroupHeader";
import {AmpConstants} from "../AmpConstants";
import {ByteTools} from "../ByteTools";
import {GroupID} from "./GroupID";

export class GroupHeaderTools {
    public static processHeader(bytes: ByteBuffer): Array<GroupHeader> {
        let headerLength = this.getHeaderLength(bytes)
        if (headerLength > 0) {
            let version: number = bytes.readInt32(0)
            if (version !== AmpConstants.VERSIONASINTEGER()) {
                let versionArray: number[] = ByteTools.deconcatenateShorts(version)
                let majorVersion = versionArray[0];
                let minorVersion = versionArray[1];
                let compatible: boolean = (majorVersion == AmpConstants.MAJOR_VERSION) && (minorVersion <= AmpConstants.MINOR_VERSION);

                if (!compatible) {
                    return [];
                }
            }

            let groupCount: number = bytes.clear().readInt32(4)

            if (groupCount > 0 && groupCount < AmpConstants.GROUPS_MAX_COUNT) {
                let groupHeaders: Array<GroupHeader> = [];
                let byteArrayStartPosition: number = headerLength;

                for (let i = 0; i < groupCount; i++) {
                    let headerPosition: number = AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT * i;
                    let classID: number = bytes.readUint32(headerPosition)
                    headerPosition += AmpConstants.INT_BYTE_FOOTPRINT;
                    let classInstanceID: number = bytes.readUint32(headerPosition)
                    headerPosition += AmpConstants.INT_BYTE_FOOTPRINT;
                    let byteCountPerElement: number = bytes.readInt32(headerPosition)
                    headerPosition += AmpConstants.INT_BYTE_FOOTPRINT;
                    let elementCount: number = bytes.readInt32(headerPosition)

                    let tempGroupID: GroupID = new GroupID(classID, classInstanceID, 'default', undefined,false)
                    let tempGroupHeader: GroupHeader = GroupHeader.createIDELCNPS(tempGroupID, byteCountPerElement, elementCount, byteArrayStartPosition)

                    if (tempGroupHeader == null) {
                        return [];
                    }

                    groupHeaders.push(tempGroupHeader);
                    byteArrayStartPosition += elementCount * byteCountPerElement
                }

                if (groupHeaders.length > 0 && groupHeaders.length < AmpConstants.GROUPS_MAX_COUNT) {
                    return groupHeaders
                }
            }
        }
        return [];
    }

    public static getHeaderLength(bytes: ByteBuffer): number {
        if (bytes && bytes.buffer.length > (AmpConstants.INT_BYTE_FOOTPRINT * 2)) {
            let groupCount: number = bytes.readInt32(4)
            let headerLength = AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants.INT_BYTE_FOOTPRINT + groupCount * AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            if (groupCount > 0 && bytes.buffer.length > headerLength) {
                return headerLength
            }
        }
        return 0
    }

    public static packHeader(header: GroupHeader): ByteBuffer {
        if (header.validGroup) {
            let classIDBytes: ByteBuffer = ByteTools.deconstructUnsignedInt(header.classID)
            let classInstanceIDBytes: ByteBuffer = ByteTools.deconstructUnsignedInt(header.classInstanceID)
            let byteCountPerElementBytes: ByteBuffer = ByteTools.deconstructInt(header.byteCountPerElement)
            let elementCountBytes: ByteBuffer = ByteTools.deconstructInt(header.elementCount)

            let headerBytes: ByteBuffer = ByteBuffer.allocate(AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT)
            let position: number = 0;
            classIDBytes.copyTo(headerBytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT)
            position += AmpConstants.INT_BYTE_FOOTPRINT;
            classInstanceIDBytes.copyTo(headerBytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT)
            position += AmpConstants.INT_BYTE_FOOTPRINT;
            byteCountPerElementBytes.copyTo(headerBytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT)
            position += AmpConstants.INT_BYTE_FOOTPRINT;
            elementCountBytes.copyTo(headerBytes, position, 0, AmpConstants.INT_BYTE_FOOTPRINT)

            return headerBytes
        }
        return ByteBuffer.allocate(0);
    }
}