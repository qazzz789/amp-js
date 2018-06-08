"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer = require("bytebuffer");
const GroupHeader_1 = require("./GroupHeader");
const AmpConstants_1 = require("../AmpConstants");
const ByteTools_1 = require("../ByteTools");
const GroupID_1 = require("./GroupID");
class GroupHeaderTools {
    static processHeader(bytes) {
        let headerLength = this.getHeaderLength(bytes);
        if (headerLength > 0) {
            let version = bytes.readInt32(0);
            if (version !== AmpConstants_1.AmpConstants.VERSIONASINTEGER()) {
                let versionArray = ByteTools_1.ByteTools.deconcatenateShorts(version);
                let majorVersion = versionArray[0];
                let minorVersion = versionArray[1];
                let compatible = (majorVersion == AmpConstants_1.AmpConstants.MAJOR_VERSION) && (minorVersion <= AmpConstants_1.AmpConstants.MINOR_VERSION);
                if (!compatible) {
                    return [];
                }
            }
            let groupCount = bytes.clear().readInt32(4);
            if (groupCount > 0 && groupCount < AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
                let groupHeaders = [];
                let byteArrayStartPosition = headerLength;
                for (let i = 0; i < groupCount; i++) {
                    let headerPosition = AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT * i;
                    let classID = bytes.readUint32(headerPosition);
                    headerPosition += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
                    let classInstanceID = bytes.readUint32(headerPosition);
                    headerPosition += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
                    let byteCountPerElement = bytes.readInt32(headerPosition);
                    headerPosition += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
                    let elementCount = bytes.readInt32(headerPosition);
                    let tempGroupID = new GroupID_1.GroupID(classID, classInstanceID, 'default', undefined, false);
                    let tempGroupHeader = GroupHeader_1.GroupHeader.createIDELCNPS(tempGroupID, byteCountPerElement, elementCount, byteArrayStartPosition);
                    if (tempGroupHeader == null) {
                        return [];
                    }
                    groupHeaders.push(tempGroupHeader);
                    byteArrayStartPosition += elementCount * byteCountPerElement;
                }
                if (groupHeaders.length > 0 && groupHeaders.length < AmpConstants_1.AmpConstants.GROUPS_MAX_COUNT) {
                    return groupHeaders;
                }
            }
        }
        return [];
    }
    static getHeaderLength(bytes) {
        if (bytes && bytes.buffer.length > (AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT * 2)) {
            let groupCount = bytes.readInt32(4);
            let headerLength = AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT + groupCount * AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT;
            if (groupCount > 0 && bytes.buffer.length > headerLength) {
                return headerLength;
            }
        }
        return 0;
    }
    static packHeader(header) {
        if (header.validGroup) {
            let classIDBytes = ByteTools_1.ByteTools.deconstructUnsignedInt(header.classID);
            let classInstanceIDBytes = ByteTools_1.ByteTools.deconstructUnsignedInt(header.classInstanceID);
            let byteCountPerElementBytes = ByteTools_1.ByteTools.deconstructInt(header.byteCountPerElement);
            let elementCountBytes = ByteTools_1.ByteTools.deconstructInt(header.elementCount);
            let headerBytes = ByteBuffer.allocate(AmpConstants_1.AmpConstants.GROUP_HEADER_BYTE_FOOTPRINT);
            let position = 0;
            classIDBytes.copyTo(headerBytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
            classInstanceIDBytes.copyTo(headerBytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
            byteCountPerElementBytes.copyTo(headerBytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            position += AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT;
            elementCountBytes.copyTo(headerBytes, position, 0, AmpConstants_1.AmpConstants.INT_BYTE_FOOTPRINT);
            return headerBytes;
        }
        return ByteBuffer.allocate(0);
    }
}
exports.GroupHeaderTools = GroupHeaderTools;
