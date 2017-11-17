import { Order, OrderLike } from "./Order";
export declare class OrderSet {
    private orders;
    private _length;
    constructor(orders?: OrderLike[]);
    add(position: Order): void;
    forEach(callbackFn: any): void;
    isEmpty(): boolean;
}
