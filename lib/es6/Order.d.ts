import { Decimal } from "decimal.js-light";
export declare type Side = "L" | "S" | "L/S";
export interface OrderLike {
    time: number;
    price: number | string;
    origSize: number | string;
    size: number | string;
    side: Side;
    type: string;
}
export declare class Order {
    readonly time: number;
    readonly price: Decimal;
    readonly origSize: Decimal;
    readonly size: Decimal;
    readonly side: Side;
    readonly type: string;
    constructor(order: OrderLike);
    merge(order: Order): void;
}
