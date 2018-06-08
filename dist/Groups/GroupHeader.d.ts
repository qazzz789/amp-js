import { GroupID } from "./GroupID";
export declare class GroupHeader {
    private _groupID;
    private _classID;
    private _classInstanceID;
    private _byteCountPerElement;
    private _elementCount;
    private _byteCountTotalAllElements;
    private _byteArrayStartPosition;
    private _byteArrayEndPosition;
    private _markedForDeletion;
    private _validGroup;
    private constructor();
    static createFromIDEL(groupID: GroupID, byteCountPerElement: number): GroupHeader;
    static createIDELCNPS(groupID: GroupID, byteCountPerElement: number, elementCount: number, byteArrayStartPosition: number): GroupHeader;
    elementCount: number;
    readonly groupID: GroupID;
    readonly classID: number;
    readonly classInstanceID: number;
    readonly byteCountPerElement: number;
    readonly byteCountTotalAllElements: number;
    readonly byteArrayStartPosition: number;
    readonly byteArrayEndPosition: number;
    readonly markedForDeletion: boolean;
    readonly validGroup: boolean;
    isWriteLocked(): boolean;
    isAmpletCompatible(): boolean;
    markForDeletion(): void;
}
