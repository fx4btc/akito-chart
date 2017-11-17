import { Decimal } from "decimal.js-light";
export declare type Side = "L" | "S";
export interface PositionLike {
    time: number;
    price: number | string;
    size: number | string;
    side: Side;
}
export declare class Position {
    readonly time: number;
    readonly price: Decimal;
    readonly size: Decimal;
    readonly side: Side;
    private _sideSign;
    constructor(position: PositionLike);
    marginAgainst(price: number): number;
    merge(position: Position): void;
}
