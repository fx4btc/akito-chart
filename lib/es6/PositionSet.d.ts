import { Position, PositionLike } from "./Position";
export declare class PositionSet {
    private positions;
    private _size;
    private _length;
    constructor(positions?: PositionLike[]);
    readonly size: number;
    add(position: Position): void;
    forEach(callbackFn: any): void;
    marginAgainst(price: number): number;
    isEmpty(): boolean;
}
