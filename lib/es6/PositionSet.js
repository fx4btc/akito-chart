/*!
    Copyright 2017 Kuromatch
*/
"use strict";
import { Position } from "./Position";
import { Decimal } from "decimal.js-light";
export class PositionSet {
    constructor(positions) {
        this.positions = {};
        this._size = new Decimal(0);
        this._length = 0;
        if (positions) {
            positions.forEach(position => {
                this.add(new Position(position));
            });
        }
    }
    get size() {
        return this._size.toNumber();
    }
    add(position) {
        this._size = this._size.plus(position.size);
        const key = position.price.toString();
        const existed = this.positions[key];
        if (existed) {
            existed.merge(position);
            return;
        }
        this.positions[key] = position;
        this._length++;
    }
    forEach(callbackFn) {
        const positions = this.positions;
        Object.keys(positions).forEach(key => callbackFn(positions[key], key));
    }
    marginAgainst(price) {
        let margin = 0;
        this.forEach(pos => {
            margin += pos.marginAgainst(price);
        });
        return margin;
    }
    isEmpty() {
        return this._length === 0;
    }
}

//# sourceMappingURL=PositionSet.js.map
