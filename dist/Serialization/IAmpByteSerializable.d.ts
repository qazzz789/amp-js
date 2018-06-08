/// <reference types="bytebuffer" />
import ByteBuffer = require("bytebuffer");
export interface IAmpByteSerializable {
    serializeToBytes(): ByteBuffer;
}
