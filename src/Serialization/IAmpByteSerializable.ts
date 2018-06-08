import ByteBuffer = require("bytebuffer");

export interface IAmpByteSerializable {
    serializeToBytes(): ByteBuffer;
}