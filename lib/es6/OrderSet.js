/*!
    Copyright 2017 Kuromatch
*/
"use strict";
import { Order } from "./Order";
export class OrderSet {
    constructor(orders) {
        this.orders = {};
        this._length = 0;
        if (orders) {
            orders.forEach(position => {
                this.add(new Order(position));
            });
        }
    }
    add(position) {
        const key = position.price.toString();
        const existed = this.orders[key];
        if (existed) {
            existed.merge(position);
            return;
        }
        this.orders[key] = position;
        this._length++;
    }
    forEach(callbackFn) {
        const orders = this.orders;
        Object.keys(orders).forEach(key => callbackFn(orders[key], key));
    }
    isEmpty() {
        return this._length === 0;
    }
}

//# sourceMappingURL=OrderSet.js.map
