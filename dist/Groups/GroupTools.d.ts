/// <reference types="bytebuffer" />
import { GroupHeader } from "./GroupHeader";
import ByteBuffer = require("bytebuffer");
import { PackedGroup } from "./PackedGroup";
import { UnpackedGroup } from "./UnpackedGroup";
export declare class GroupTools {
    static unpackElementsFromByteArray(header: GroupHeader, bytes: ByteBuffer): Array<ByteBuffer>;
    static extractPackedGroupBytes(header: GroupHeader, bytes: ByteBuffer): ByteBuffer;
    static packGroupFromByteArray(header: GroupHeader, bytes: ByteBuffer): PackedGroup;
    static repackUnpackedGroup(unpackedGroup: UnpackedGroup): PackedGroup;
    static packElementsIntoByteArray(header: GroupHeader, unpackedElements: Array<ByteBuffer>): ByteBuffer;
    static buildAmpletBytesFromUnpackedGroups(unpackedGroups: Array<UnpackedGroup>): ByteBuffer;
    static buildAmpletBytesFromPackedGroups(packedGroups: Array<PackedGroup>, trailer?: ByteBuffer): ByteBuffer;
}
