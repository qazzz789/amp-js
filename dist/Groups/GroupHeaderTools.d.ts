/// <reference types="bytebuffer" />
import ByteBuffer = require("bytebuffer");
import { GroupHeader } from "./GroupHeader";
export declare class GroupHeaderTools {
    static processHeader(bytes: ByteBuffer): Array<GroupHeader>;
    static getHeaderLength(bytes: ByteBuffer): number;
    static packHeader(header: GroupHeader): ByteBuffer;
}
