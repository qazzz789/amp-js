export declare class GroupID {
    private _classID;
    private _classInstanceID;
    private _duplicatable;
    private _name;
    private _collision;
    private static collisionProtectionEnabled;
    private static strongCollisionProtectionEnabled;
    private static registeredGroupIDs;
    constructor(classID: number, classInstanceID: number, name: string | undefined, duplicatable?: boolean, warning?: boolean);
    readonly classID: number;
    readonly classInstanceID: number;
    readonly duplicatable: boolean;
    readonly name: string | undefined;
    static registerGroupIDIfNoCollision(groupID: GroupID): GroupID | undefined;
    static unregisterGroupID(groupID: GroupID): void;
    static unregisterAllGroupIDs(): void;
    static enableCollisionProtection(): void;
    static disableCollisionProtection(): void;
    static enableStrongCollisionProtection(): void;
    static disableStrongCollisionProtection(): void;
}
