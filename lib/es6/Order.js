/*!
    Copyright 2017 Kuromatch
*/
"use strict";
import { Decimal } from "decimal.js-light";
export class Order {
    constructor(order) {
        this.time = order.time;
        this.price = new Decimal(order.price);
        this.origSize = new Decimal(order.origSize);
        this.size = new Decimal(order.size);
        this.side = order.side;
        this.type = order.type;
    }
    merge(order) {
        if (!this.price.equals(order.price)) {
            throw new Error("Can not merge different price orders.");
        }
        if (this.side !== order.side) {
            // 両建て
            throw new Error("Double options is not supported.");
        }
        this.origSize = this.origSize.plus(order.origSize);
        this.size = this.size.plus(order.size);
    }
}

//# sourceMappingURL=Order.js.map
