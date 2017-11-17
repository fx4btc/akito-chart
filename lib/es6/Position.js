/*!
    Copyright 2017 Kuromatch
*/
"use strict";
import { Decimal } from "decimal.js-light";
export class Position {
    constructor(position) {
        this.time = position.time;
        this.price = new Decimal(position.price);
        this.size = new Decimal(position.size);
        this.side = position.side;
        this._sideSign = new Decimal(position.side === "S" ? 1 : -1);
    }
    marginAgainst(price) {
        return this.price.minus(price).mul(this.size).mul(this._sideSign).toNumber();
    }
    merge(position) {
        if (!this.price.equals(position.price)) {
            throw new Error("Can not merge different price positions.");
        }
        if (this.side != position.side) {
            // 両建て
            throw new Error("Double options is not supported.");
        }
        this.size = this.size.plus(position.size);
    }
}

//# sourceMappingURL=Position.js.map
