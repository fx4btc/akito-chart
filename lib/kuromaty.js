(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
    Copyright 2017 Kuromatch
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Order = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _decimal = require("decimal.js-light");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Order = exports.Order = function () {
    function Order(order) {
        _classCallCheck(this, Order);

        this.time = order.time;
        this.price = new _decimal.Decimal(order.price);
        this.origSize = new _decimal.Decimal(order.origSize);
        this.size = new _decimal.Decimal(order.size);
        this.side = order.side;
        this.type = order.type;
    }

    _createClass(Order, [{
        key: "merge",
        value: function merge(order) {
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
    }]);

    return Order;
}();



},{"decimal.js-light":7}],2:[function(require,module,exports){
/*!
    Copyright 2017 Kuromatch
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Order = require("./Order");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrderSet = exports.OrderSet = function () {
    function OrderSet(orders) {
        var _this = this;

        _classCallCheck(this, OrderSet);

        this.orders = {};
        this._length = 0;
        if (orders) {
            orders.forEach(function (position) {
                _this.add(new _Order.Order(position));
            });
        }
    }

    _createClass(OrderSet, [{
        key: "add",
        value: function add(position) {
            var key = position.price.toString();
            var existed = this.orders[key];
            if (existed) {
                existed.merge(position);
                return;
            }
            this.orders[key] = position;
            this._length++;
        }
    }, {
        key: "forEach",
        value: function forEach(callbackFn) {
            var orders = this.orders;
            Object.keys(orders).forEach(function (key) {
                return callbackFn(orders[key], key);
            });
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this._length === 0;
        }
    }]);

    return OrderSet;
}();



},{"./Order":1}],3:[function(require,module,exports){
/*!
    Copyright 2017 Kuromatch
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Position = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _decimal = require("decimal.js-light");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Position = exports.Position = function () {
    function Position(position) {
        _classCallCheck(this, Position);

        this.time = position.time;
        this.price = new _decimal.Decimal(position.price);
        this.size = new _decimal.Decimal(position.size);
        this.side = position.side;
        this._sideSign = new _decimal.Decimal(position.side === "S" ? 1 : -1);
    }

    _createClass(Position, [{
        key: "marginAgainst",
        value: function marginAgainst(price) {
            return this.price.minus(price).mul(this.size).mul(this._sideSign).toNumber();
        }
    }, {
        key: "merge",
        value: function merge(position) {
            if (!this.price.equals(position.price)) {
                throw new Error("Can not merge different price positions.");
            }
            if (this.side != position.side) {
                // 両建て
                throw new Error("Double options is not supported.");
            }
            this.size = this.size.plus(position.size);
        }
    }]);

    return Position;
}();



},{"decimal.js-light":7}],4:[function(require,module,exports){
/*!
    Copyright 2017 Kuromatch
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PositionSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Position = require("./Position");

var _decimal = require("decimal.js-light");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PositionSet = exports.PositionSet = function () {
    function PositionSet(positions) {
        var _this = this;

        _classCallCheck(this, PositionSet);

        this.positions = {};
        this._size = new _decimal.Decimal(0);
        this._length = 0;
        if (positions) {
            positions.forEach(function (position) {
                _this.add(new _Position.Position(position));
            });
        }
    }

    _createClass(PositionSet, [{
        key: "add",
        value: function add(position) {
            this._size = this._size.plus(position.size);
            var key = position.price.toString();
            var existed = this.positions[key];
            if (existed) {
                existed.merge(position);
                return;
            }
            this.positions[key] = position;
            this._length++;
        }
    }, {
        key: "forEach",
        value: function forEach(callbackFn) {
            var positions = this.positions;
            Object.keys(positions).forEach(function (key) {
                return callbackFn(positions[key], key);
            });
        }
    }, {
        key: "marginAgainst",
        value: function marginAgainst(price) {
            var margin = 0;
            this.forEach(function (pos) {
                margin += pos.marginAgainst(price);
            });
            return margin;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this._length === 0;
        }
    }, {
        key: "size",
        get: function get() {
            return this._size.toNumber();
        }
    }]);

    return PositionSet;
}();



},{"./Position":3,"decimal.js-light":7}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Kuromaty = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Copyright 2017 Kuromatch
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _PositionSet = require("./PositionSet");

var _OrderSet = require("./OrderSet");

var _flagrate = require("flagrate/lib/es6/flagrate");

var _flagrate2 = _interopRequireDefault(_flagrate);

var _decimal = require("decimal.js-light");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kuromaty = function () {
    function Kuromaty(container) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Kuromaty);

        this.options = options;
        this.timePeriod = 1;
        this.barIndex = 0;
        this.cursorPrice = 0;
        this.cursorVolume = 0;
        this.cursorBoard = 0;
        this.cursorBoardPrice = 0;
        this.pinnedPrices = [];
        this.maxBarCount = 8200;
        this.hasDepleted = false;
        this.color = {
            bg: "#fafafa",
            text: "#333333",
            textStrong: "#111111",
            textWeak: "#777777",
            short: "#e9546b",
            long: "#3eb370",
            askOrder: "#ff303e",
            bidOrder: "#17cb00",
            volume: "#9b7cb6",
            askDepth: "rgba(210,179,189,0.21)",
            bidDepth: "rgba(201,210,179,0.25)",
            askDepthLast: "rgba(210,179,189,0.45)",
            bidDepthLast: "rgba(201,210,179,0.55)",
            grid: "#eeeeee",
            border: "#cccccc",
            borderText: "#111111",
            borderLTP: "rgba(255,150,25,0.6)",
            borderLTPText: "#ffffff",
            lineMA1: "#e9e7c6",
            lineMA2: "#c6e6e9",
            lineMA3: "#e9c6e8"
        };
        this.cursorX = -1;
        this.cursorY = -1;
        this.canvasW = 0;
        this.canvasH = 0;
        this._dpr = window.devicePixelRatio;
        this._hasUpdated = false;
        this._hasRemoved = true;
        this._afs = 0;
        this._pricePops = [];
        this._lastPointerdown = [0, 0];
        this._lastPointerButtons = 0;
        this._positions = new _PositionSet.PositionSet();
        this._orders = new _OrderSet.OrderSet();
        this.__keydownHandler = this._keydownHandler.bind(this);
        if (typeof options.chartCount !== "number") {
            options.chartCount = 1;
        }
        if (options.chartTitles === undefined) {
            options.chartTitles = [];
        }
        if (options.chartOverlay === undefined) {
            options.chartOverlay = false;
        }
        options.barWidth = options.barWidth || 5;
        options.barMargin = options.barMargin || 3;
        options.decimalPower = options.decimalPower || 0;
        this._decimal = parseInt("1" + Array(options.decimalPower + 1).join("0"), 10);
        this._create();
        if (container) {
            this.insertTo(container);
        }
    }

    _createClass(Kuromaty, [{
        key: "insertTo",
        value: function insertTo(container) {
            container.appendChild(this._rootContainer);
            this._hasRemoved = false;
            this.resize();
        }
    }, {
        key: "remove",
        value: function remove() {
            this._removeListeners();
            this._rootContainer.parentNode.removeChild(this._rootContainer);
            this.canvasW = this.canvasH = 0;
            this._hasRemoved = true;
            cancelAnimationFrame(this._afr);
        }
    }, {
        key: "resize",
        value: function resize() {
            var w = this.canvasW = this._chartContainer.clientWidth;
            var h = this.canvasH = this._chartContainer.clientHeight;
            w *= this._dpr;
            h *= this._dpr;
            this.canvases.forEach(function (canvas) {
                canvas.width = w;
                canvas.height = h;
            });
            this._hasUpdated = true;
            this._redraw();
        }
    }, {
        key: "zoom",
        value: function zoom(delta) {
            this.options.barWidth = Math.min(11, Math.max(1, this.options.barWidth + delta));
            this._hasUpdated = true;
        }
    }, {
        key: "update",
        value: function update(index, bars) {
            this.charts[index].bars = bars;
            this._hasUpdated = true;
        }
    }, {
        key: "updateHBars",
        value: function updateHBars(index, hBars) {
            this.charts[index].hBars = hBars;
            this._hasUpdated = true;
        }
    }, {
        key: "tick",
        value: function tick(index, _tick) {
            var chart = this.charts[index];
            chart.tickDelta = 0;
            if (chart.ticks[0] && chart.bars[0] && chart.bars[0][4 /* Close */] !== _tick[1 /* Ltp */]) {
                chart.tickDelta = _tick[1 /* Ltp */] - chart.bars[0][4 /* Close */];
            }
            if (!chart.ticks[0] || 1000 < _tick[0 /* Time */] - chart.ticks[0][0 /* Time */]) {
                chart.ticks.unshift(_tick);
                if (chart.ticks.length > 250) {
                    chart.ticks.pop();
                }
            }
            var lastTime = Date.now() - 1000 * 60;
            if (chart.bars.length > 0) {
                lastTime = chart.bars[0][0 /* Time */];
            }
            var bar = chart.bars[0];
            var time = _tick[0 /* Time */];
            if (!bar || new Date(lastTime).getMinutes() !== new Date(time).getMinutes()) {
                var delta = Math.floor((time - lastTime) / 1000 / 60);
                for (var i = delta; i > 0; i--) {
                    if (i === 1) {
                        chart.bars.unshift([new Date(_tick[0 /* Time */]).setSeconds(0, 0), _tick[1 /* Ltp */], _tick[1 /* Ltp */], _tick[1 /* Ltp */], _tick[1 /* Ltp */], _tick[2 /* Volume */], _tick[3 /* AskDepth */], _tick[4 /* BidDepth */], _tick[5 /* SellVolume */], _tick[6 /* BuyVolume */]]);
                    } else {
                        chart.bars.unshift([new Date(_tick[0 /* Time */]).setSeconds(0, 0) - 1000 * 60 * (i - 1), chart.ticks[0][1 /* Ltp */], chart.ticks[0][1 /* Ltp */], chart.ticks[0][1 /* Ltp */], chart.ticks[0][1 /* Ltp */], chart.ticks[0][2 /* Volume */], chart.ticks[0][3 /* AskDepth */], chart.ticks[0][4 /* BidDepth */], chart.ticks[0][5 /* SellVolume */], chart.ticks[0][6 /* BuyVolume */]]);
                    }
                    if (chart.bars.length > this.maxBarCount) {
                        chart.bars.pop();
                    }
                }
            } else {
                if (bar[2 /* High */] < _tick[1 /* Ltp */]) {
                    bar[2 /* High */] = _tick[1 /* Ltp */];
                }
                if (bar[3 /* Low */] > _tick[1 /* Ltp */]) {
                    bar[3 /* Low */] = _tick[1 /* Ltp */];
                }
                bar[4 /* Close */] = _tick[1 /* Ltp */];
                if (bar[5 /* Volume */] < _tick[2 /* Volume */]) {
                    bar[5 /* Volume */] = _tick[2 /* Volume */];
                }
                bar[6 /* AskDepth */] = _tick[3 /* AskDepth */];
                bar[7 /* BidDepth */] = _tick[4 /* BidDepth */];
                if (bar[8 /* SellVolume */] < _tick[5 /* SellVolume */]) {
                    bar[8 /* SellVolume */] = _tick[5 /* SellVolume */];
                }
                if (bar[9 /* BuyVolume */] < _tick[6 /* BuyVolume */]) {
                    bar[9 /* BuyVolume */] = _tick[6 /* BuyVolume */];
                }
            }
            this._hasUpdated = true;
        }
    }, {
        key: "updateBoard",
        value: function updateBoard(index, board) {
            board = util.deepCopy(board);
            var chart = this.charts[index];
            var groupPrice = util.generatePriceGrouping(this._decimal, this.options.boardGroupSize);
            var boardMaxSize = 0;
            var maxPrice = chart.highest;
            var minPrice = chart.lowest;
            function groupUp(boardItems) {
                if (boardItems.length === 0) {
                    return [];
                }
                var current = { price: groupPrice(boardItems[0].price), size: 0 };
                var currentSize = new _decimal.Decimal(0);
                var groupedItems = [current];
                for (var i = 0; i < boardItems.length; i++) {
                    var price = groupPrice(boardItems[i].price);
                    if (price < minPrice || maxPrice < price) {
                        break;
                    }
                    if (current.price !== price) {
                        if (boardMaxSize < current.size) {
                            boardMaxSize = current.size;
                        }
                        current = {
                            price: price,
                            size: boardItems[i].size
                        };
                        currentSize = new _decimal.Decimal(current.size);
                        groupedItems.push(current);
                    } else {
                        currentSize = currentSize.plus(boardItems[i].size);
                        current.size = currentSize.toNumber();
                    }
                }
                if (boardMaxSize < current.size) {
                    boardMaxSize = current.size;
                }
                return groupedItems;
            }
            board.asks = groupUp(board.asks);
            board.bids = groupUp(board.bids);
            chart.board = board;
            chart.boardMaxSize = boardMaxSize;
            this._hasUpdated = true;
        }
    }, {
        key: "setColor",
        value: function setColor(option) {
            for (var key in option) {
                this.color[key] = option[key];
            }
            this._chartContainer.style.borderColor = this.color.border;
        }
    }, {
        key: "setPositions",
        value: function setPositions(positions) {
            this._positions = new _PositionSet.PositionSet(positions);
        }
    }, {
        key: "setOrders",
        value: function setOrders(orders) {
            this._orders = new _OrderSet.OrderSet(orders);
        }
    }, {
        key: "_create",
        value: function _create() {
            var _this = this;

            this._rootContainer = document.createElement("div");
            this._rootContainer.className = "kuromaty";
            this._chartContainer = document.createElement("div");
            this._chartContainer.className = "kuromaty-chart";
            this._chartContainer.style.borderColor = this.color.border;
            this._rootContainer.appendChild(this._chartContainer);
            this.charts = [];
            this.canvases = [];
            this.contexts = [];
            {
                this.overlay = {
                    canvas: document.createElement("canvas"),
                    context: null
                };
                this.overlay.context = this.overlay.canvas.getContext("2d");
                this.canvases.push(this.overlay.canvas);
                this.contexts.push(this.overlay.context);
                this.overlay.canvas.addEventListener("pointerdown", this._pointerdownHandler.bind(this));
                this.overlay.canvas.addEventListener("pointerup", this._pointerupHandler.bind(this));
                this.overlay.canvas.addEventListener("pointermove", this._pointermoveHandler.bind(this));
                this.overlay.canvas.addEventListener("pointerout", this._pointeroutHandler.bind(this));
                this.overlay.canvas.addEventListener("wheel", this._wheelHandler.bind(this) /* , { passive: true } */);
                this.overlay.canvas.addEventListener("contextmenu", this._contextmenuHandler.bind(this));
            }
            for (var i = 0; i < this.options.chartCount; i++) {
                var chart = {
                    title: this.options.chartTitles[i] || "Untitled",
                    canvas: document.createElement("canvas"),
                    context: null,
                    bars: [],
                    hBars: [],
                    _bars: [],
                    ticks: [],
                    board: null,
                    boardMaxSize: 0,
                    range: 0,
                    highest: 0,
                    highestPrice: 0,
                    highestPricePrinted: false,
                    lowest: 0,
                    lowestPrice: 0,
                    lowestPricePrinted: false,
                    askPrice: 0,
                    bidPrice: 0,
                    maxVolume: 0,
                    volumeRatio: 0,
                    maxDepth: 0,
                    minDepth: 0,
                    depthRatio: 1,
                    latest: 0,
                    ratio: 1,
                    tickDelta: 0,
                    selected: i === 0
                };
                chart.context = chart.canvas.getContext("2d");
                this.charts.push(chart);
                this.canvases.push(chart.canvas);
                this.contexts.push(chart.context);
            }
            {
                this.grid = {
                    canvas: document.createElement("canvas"),
                    context: null
                };
                this.grid.context = this.grid.canvas.getContext("2d");
                this.canvases.push(this.grid.canvas);
                this.contexts.push(this.grid.context);
            }
            // insert all canvas
            this.canvases.reverse();
            this.contexts.reverse();
            this.canvases.forEach(function (canvas) {
                _this._chartContainer.appendChild(canvas);
            });
            this._addListeners();
        }
    }, {
        key: "_addListeners",
        value: function _addListeners() {
            window.addEventListener("keydown", this.__keydownHandler);
        }
    }, {
        key: "_removeListeners",
        value: function _removeListeners() {
            window.removeEventListener("keydown", this.__keydownHandler);
        }
    }, {
        key: "_redraw",
        value: function _redraw() {
            var _this2 = this;

            if (this._afr) {
                cancelAnimationFrame(this._afr);
            }
            // initial settings
            this.contexts.forEach(function (context) {
                context.scale(_this2._dpr, _this2._dpr);
                context.imageSmoothingEnabled = false;
            });
            var tick = function tick() {
                if (_this2._hasUpdated && _this2.canvasW > 40 && _this2.canvasH > 40) {
                    _this2._hasUpdated = false;
                    _this2._draw();
                }
                if (!_this2._hasRemoved) {
                    _this2._afr = requestAnimationFrame(tick);
                }
            };
            this._afr = requestAnimationFrame(tick);
        }
    }, {
        key: "_draw",
        value: function _draw() {
            var _this3 = this;

            var canvasW = this.canvasW,
                canvasH = this.canvasH,
                barW = this.options.barWidth + this.options.barMargin,
                chartW = canvasW - 45,
                chartH = canvasH - 16,
                chartM = barW * Math.max(2, 5 - this.barIndex),
                chartI = Math.max(0, this.barIndex - 3),
                barCount = Math.round((chartW - chartM) / barW) - 1,
                decimal = this._decimal,
                decimalPower = this.options.decimalPower,
                period = this.timePeriod;
            var i = 0,
                j = 0,
                l = 0,
                m = this.charts.length,
                end = false,
                highest = 0,
                lowest = Infinity,
                maxVolume = 0,
                minVolume = Infinity,
                maxDepth = 0,
                minDepth = Infinity,
                bar = void 0,
                barH = 0,
                barDate = void 0,
                barDateMinutes = void 0,
                barDateHours = void 0,
                barDateDate = void 0;
            this.hasDepleted = false;
            // pre
            for (j = 0; j < m; j++) {
                var chart = this.charts[j];
                chart.context.clearRect(0, 0, canvasW, canvasH);
                if (period === 0 && !chart.selected) {
                    continue;
                }
                highest = 0;
                lowest = Infinity;
                maxVolume = 0;
                maxDepth = 0;
                minDepth = Infinity;
                chart._bars = this._getBars(j, chartI, barCount * 2);
                l = Math.min(barCount, chart._bars.length);
                if (chart.selected) {
                    if (barCount > chart._bars.length && this.maxBarCount > chart.bars.length) {
                        this.hasDepleted = true;
                    }
                }
                for (i = 0; i < l; i++) {
                    bar = chart._bars[i];
                    if (!bar) {
                        break;
                    }
                    if (highest < bar[2 /* High */]) {
                        highest = bar[2 /* High */];
                    }
                    if (lowest > bar[3 /* Low */]) {
                        lowest = bar[3 /* Low */];
                    }
                    if (maxVolume < bar[5 /* Volume */]) {
                        maxVolume = bar[5 /* Volume */];
                    }
                    if (maxDepth < bar[6 /* AskDepth */]) {
                        maxDepth = bar[6 /* AskDepth */];
                    }
                    if (minDepth > bar[6 /* AskDepth */]) {
                        minDepth = bar[6 /* AskDepth */];
                    }
                    if (maxDepth < bar[7 /* BidDepth */]) {
                        maxDepth = bar[7 /* BidDepth */];
                    }
                    if (minDepth > bar[7 /* BidDepth */]) {
                        minDepth = bar[7 /* BidDepth */];
                    }
                }
                if (chart._bars.length === 0) {
                    return;
                }
                chart.latest = chart.bars[0][4 /* Close */];
                chart.highestPrice = highest;
                chart.lowestPrice = lowest;
                chart.highestPricePrinted = false;
                chart.lowestPricePrinted = false;
                var priceRatio = chartH / (highest - lowest);
                chart.highest = highest + Math.round(chartH / 3 / priceRatio * decimal) / decimal;
                chart.lowest = lowest - Math.round(chartH / 3 / priceRatio * decimal) / decimal;
                chart.range = chart.highest - chart.lowest;
                chart.ratio = chartH / chart.range;
                chart.maxVolume = maxVolume;
                chart.volumeRatio = chartH / 5 / maxVolume;
                chart.maxDepth = maxDepth;
                chart.minDepth = minDepth;
                chart.depthRatio = chartH / 5 / (maxDepth - minDepth);
                chart.canvas.style.opacity = chart.selected ? "1" : "0.2";
                // border
                chart.context.fillStyle = this.color.border;
                chart.context.fillRect(chartW, 0, 1, chartH);
                chart.context.fillRect(0, chartH, chartW + 1, 1);
            } // pre
            this.grid.context.clearRect(0, 0, canvasW, canvasH);
            this.grid.context.fillStyle = this.color.bg;
            this.grid.context.fillRect(0, 0, canvasW, canvasH);
            this.grid.context.textAlign = "center";
            this.overlay.context.clearRect(0, 0, canvasW, canvasH);
            // main

            var _loop = function _loop() {
                var chart = _this3.charts[j];
                var ctx = chart.context;
                var barX = chartW - chartM;
                if (period === 0 && !chart.selected) {
                    return "continue";
                }
                // bars
                for (i = 0; i < l; i++) {
                    bar = chart._bars[i];
                    if (!bar || !chart._bars[i + 1]) {
                        break;
                    }
                    if (i !== 0) {
                        barX -= barW;
                    }
                    // ask/bid depth
                    if (chart.selected) {
                        ctx.fillStyle = i === 0 && chartI < 1 ? _this3.color.askDepthLast : _this3.color.askDepth;
                        ctx.fillRect(barX - _this3.options.barWidth, 0, barW, Math.round((bar[6 /* AskDepth */] - chart.minDepth) * chart.depthRatio));
                        ctx.fillStyle = i === 0 && chartI < 1 ? _this3.color.bidDepthLast : _this3.color.bidDepth;
                        ctx.fillRect(barX - _this3.options.barWidth, chartH, barW, -Math.round((bar[7 /* BidDepth */] - chart.minDepth) * chart.depthRatio));
                    }
                    // volume
                    ctx.fillStyle = _this3.color.volume;
                    ctx.fillRect(barX - Math.ceil(_this3.options.barWidth / 2), chartH, 1, -Math.round(bar[5 /* Volume */] * chart.volumeRatio));
                    if (period !== 0) {
                        // bar height
                        barH = Math.round((bar[1 /* Open */] - bar[4 /* Close */]) * chart.ratio);
                        // candlestick
                        ctx.fillStyle = bar[1 /* Open */] > bar[4 /* Close */] ? _this3.color.short : _this3.color.long;
                        ctx.fillRect(barX - _this3.options.barWidth, Math.round((chart.highest - bar[1 /* Open */]) * chart.ratio), _this3.options.barWidth, barH === 0 ? 1 : barH);
                        // candlestick (hige)
                        ctx.fillRect(barX - Math.ceil(_this3.options.barWidth / 2), Math.round((chart.highest - bar[2 /* High */]) * chart.ratio), 1, Math.round((bar[2 /* High */] - bar[3 /* Low */]) * chart.ratio));
                    }
                    if (!chart.selected) {
                        continue;
                    }
                    // highest
                    if (period !== 0 && bar[2 /* High */] === chart.highestPrice) {
                        _this3.overlay.context.fillStyle = _this3.color.long;
                        var hpX = barX - _this3.options.barWidth / 2;
                        var hpY = Math.round((chart.highest - bar[2 /* High */]) * chart.ratio);
                        _this3.overlay.context.beginPath();
                        _this3.overlay.context.moveTo(hpX, hpY - 2);
                        _this3.overlay.context.lineTo(hpX + 3, hpY - 5);
                        _this3.overlay.context.lineTo(hpX - 3, hpY - 5);
                        _this3.overlay.context.fill();
                        if (chart.highestPricePrinted === false) {
                            chart.highestPricePrinted = true;
                            _this3.overlay.context.textAlign = i < l / 2 ? "right" : "left";
                            _this3.overlay.context.fillText(new _decimal.Decimal(bar[2 /* High */]).toFixed(decimalPower), barX - (i < l / 2 ? 0 : 5), hpY - 8);
                            _this3._drawBorder(_this3.overlay.context, 0, hpY - 0.5, chartW, _this3.color.long, [1, 2]);
                        }
                    }
                    // lowest
                    if (period !== 0 && bar[3 /* Low */] === chart.lowestPrice) {
                        _this3.overlay.context.fillStyle = _this3.color.short;
                        var lpX = barX - _this3.options.barWidth / 2;
                        var lpY = Math.round((chart.highest - bar[3 /* Low */]) * chart.ratio);
                        _this3.overlay.context.beginPath();
                        _this3.overlay.context.moveTo(lpX, lpY + 2);
                        _this3.overlay.context.lineTo(lpX + 3, lpY + 5);
                        _this3.overlay.context.lineTo(lpX - 3, lpY + 5);
                        _this3.overlay.context.fill();
                        if (chart.lowestPricePrinted === false) {
                            chart.lowestPricePrinted = true;
                            _this3.overlay.context.textAlign = i < l / 2 ? "right" : "left";
                            _this3.overlay.context.fillText(new _decimal.Decimal(bar[3 /* Low */]).toFixed(decimalPower), barX - (i < l / 2 ? 0 : 5), lpY + 15);
                            _this3._drawBorder(_this3.overlay.context, 0, lpY + 0.5, chartW, _this3.color.short, [1, 2]);
                        }
                    }
                    // bar date
                    barDate = new Date(bar[0 /* Time */]);
                    barDateMinutes = barDate.getMinutes();
                    barDateHours = barDate.getHours();
                    barDateDate = barDate.getDate();
                    // datetime
                    if (period === 0 && i % 10 === 0 || period >= 1 && period < 3 && barDateMinutes % 15 === 0 || period >= 3 && period < 5 && barDateMinutes % 30 === 0 || period >= 5 && period < 10 && barDateMinutes % 60 === 0 || period >= 10 && period < 15 && barDateMinutes % 60 === 0 && barDateHours % 2 === 0 || period >= 15 && period < 30 && barDateMinutes % 60 === 0 && barDateHours % 3 === 0 || period >= 30 && period < 60 && barDateMinutes % 60 === 0 && barDateHours % 6 === 0 || period >= 60 && period < 120 && barDateMinutes % 60 === 0 && barDateHours % 12 === 0 || period >= 120 && period < 240 && barDateHours === 0 || period >= 240 && period < 360 && barDateHours === 0 && barDateDate % 2 === 0 || period >= 360 && period < 720 && barDateHours === 0 && barDateDate % 3 === 0 || period >= 720 && barDateHours === 0 && barDateDate % 7 === 0) {
                        // vertical grid
                        _this3.grid.context.fillStyle = _this3.color.grid;
                        _this3.grid.context.fillRect(barX - Math.ceil(_this3.options.barWidth / 2), 0, 1, chartH);
                        // time
                        var timeStr = void 0;
                        if (barDateHours === 0 && barDateMinutes === 0) {
                            timeStr = barDate.getMonth() + 1 + "/" + barDateDate + "'";
                        } else {
                            timeStr = barDateHours + ":" + util.zeroPadding(barDateMinutes, 2);
                        }
                        _this3.grid.context.fillStyle = _this3.color.text;
                        _this3.grid.context.font = "10px sans-serif";
                        _this3.grid.context.fillText(timeStr, barX - Math.ceil(_this3.options.barWidth / 2), canvasH - 4);
                    }
                } // bars
                if (chart.selected) {
                    // LTP Position (Y)
                    var ltpp = Math.round((chart.highest - chart.latest) * chart.ratio);
                    if (!ltpp) {
                        ltpp = Math.round(canvasH / 2);
                    }
                    // horizontal grid (price)
                    var lp = Infinity,
                        cp = 0,
                        add = decimal === 1 ? 1000 : 100 / decimal;
                    if (period === 0) {
                        add /= 100;
                    }
                    for (i = chart.lowest - chart.lowest % add; i < chart.highest; i += add) {
                        cp = Math.round((chart.highest - i) * chart.ratio);
                        if (lp - cp < 80 || cp + 30 > chartH) {
                            continue;
                        }
                        // grid
                        _this3.grid.context.fillStyle = _this3.color.grid;
                        _this3.grid.context.fillRect(0, cp, chartW, 1);
                        // text
                        _this3.grid.context.fillStyle = _this3.color.textWeak;
                        _this3.grid.context.font = "11px sans-serif";
                        _this3.grid.context.textAlign = "left";
                        _this3.grid.context.fillText(new _decimal.Decimal(i).toFixed(decimalPower), chartW + 2, cp + 5, 39);
                        lp = cp;
                    }
                    // Price Range Indicator
                    _this3._drawVerticalRange(_this3.grid.context, chartW - chartM + barW, (chart.highest - chart.highestPrice) * chart.ratio, (chart.highestPrice - chart.lowestPrice) * chart.ratio, _this3.color.border, [2, 1]);
                    var priceRangeLabelY = chart.highestPrice - chart._bars[0][2 /* High */] > chart._bars[0][3 /* Low */] - chart.lowestPrice ? (chart.highest - chart.highestPrice) * chart.ratio + 40 : (chart.highest - chart.lowestPrice) * chart.ratio - 40;
                    _this3.grid.context.save();
                    _this3.grid.context.fillStyle = _this3.color.bg;
                    _this3.grid.context.fillRect(chartW - chartM + barW, priceRangeLabelY - 10, 1, 12);
                    _this3.grid.context.textAlign = "right";
                    _this3.grid.context.fillStyle = _this3.color.textWeak;
                    _this3.grid.context.font = "10px sans-serif";
                    _this3.grid.context.globalAlpha = 0.6;
                    _this3.grid.context.fillText(new _decimal.Decimal(chart.highestPrice - chart.lowestPrice).toFixed(decimalPower), chartW - chartM + barW + 6, priceRangeLabelY);
                    _this3.grid.context.restore();
                    // Last Sell/Buy Volume Indicator (experimental)
                    _this3.overlay.context.save();
                    if (chart._bars[0][8 /* SellVolume */] > chart._bars[0][9 /* BuyVolume */]) {
                        var grad = _this3.overlay.context.createLinearGradient(0, 1, 0, ltpp - 2);
                        grad.addColorStop(0, _this3.color.askOrder);
                        grad.addColorStop(1, _this3.color.bg);
                        _this3.overlay.context.fillStyle = grad;
                        _this3.overlay.context.globalAlpha = (chart._bars[0][8 /* SellVolume */] - chart._bars[0][9 /* BuyVolume */]) / chart._bars[0][5 /* Volume */];
                        _this3.overlay.context.fillRect(chartW - 1, 1, -4, ltpp - 2);
                    } else if (chart._bars[0][8 /* SellVolume */] < chart._bars[0][9 /* BuyVolume */]) {
                        var _grad = _this3.overlay.context.createLinearGradient(0, ltpp + 1, 0, chartH);
                        _grad.addColorStop(0, _this3.color.bg);
                        _grad.addColorStop(1, _this3.color.bidOrder);
                        _this3.overlay.context.fillStyle = _grad;
                        _this3.overlay.context.globalAlpha = (chart._bars[0][9 /* BuyVolume */] - chart._bars[0][8 /* SellVolume */]) / chart._bars[0][5 /* Volume */];
                        _this3.overlay.context.fillRect(chartW - 1, chartH - 1, -4, -(chartH - ltpp - 2));
                    }
                    _this3.overlay.context.restore();
                    if (_this3.cursorX > -1) {
                        _this3._drawDepthIndicator(_this3.overlay.context, chartW - chartM - 7, 40, "Sell Vol. " + new _decimal.Decimal(chart._bars[0][8 /* SellVolume */]).toFixed(1), _this3.color.askOrder);
                        _this3._drawDepthIndicator(_this3.overlay.context, chartW - chartM - 7, chartH - 40, "Buy Vol. " + new _decimal.Decimal(chart._bars[0][9 /* BuyVolume */]).toFixed(1), _this3.color.bidOrder);
                    }
                    // Last Depth Indicator (v2.25)
                    if (chart._bars[0][6 /* AskDepth */] && chart._bars[0][7 /* BidDepth */]) {
                        _this3._drawDepthIndicator(_this3.overlay.context, chartW - chartM - 7, 20, "Ask Depth " + Math.round(chart._bars[0][6 /* AskDepth */]), _this3.color.askDepthLast);
                        _this3._drawDepthIndicator(_this3.overlay.context, chartW - chartM - 7, chartH - 20, "Bid Depth " + Math.round(chart._bars[0][7 /* BidDepth */]), _this3.color.bidDepthLast);
                    }
                    // Ask/Bid Price Indicator (v2.24)
                    if (chart.askPrice && chart.bidPrice) {
                        var askp = Math.round((chart.highest - chart.askPrice) * chart.ratio);
                        var bidp = Math.round((chart.highest - chart.bidPrice) * chart.ratio);
                        _this3._drawPriceTag2(_this3.overlay.context, chartW - chartM + Math.round(barW / 2), askp, chartM - Math.round(barW / 2), chart.askPrice, _this3.color.long, [2, 2]);
                        _this3._drawPriceTag2(_this3.overlay.context, chartW - chartM + Math.round(barW / 2), bidp, chartM - Math.round(barW / 2), chart.bidPrice, _this3.color.short, [2, 2]);
                    }
                    // Board (testing)
                    if (chart.board) {
                        var board = void 0;
                        var boardItemHeight = Math.round(_this3.options.boardGroupSize / decimal * chart.ratio);
                        _this3.overlay.context.save();
                        _this3.overlay.context.fillStyle = _this3.color.askOrder;
                        for (i = 0; i < chart.board.asks.length - 1; i++) {
                            board = chart.board.asks[i];
                            _this3.overlay.context.globalAlpha = Math.min(1, board.size / chart.boardMaxSize + 0.12);
                            _this3.overlay.context.fillRect(chartW - 1, Math.round((chart.highest - board.price) * chart.ratio), -(Math.min(19, Math.ceil(board.size / chart.boardMaxSize * 19)) + 1), -boardItemHeight);
                        }
                        _this3.overlay.context.fillStyle = _this3.color.bidOrder;
                        for (i = 0; i < chart.board.bids.length - 1; i++) {
                            board = chart.board.bids[i];
                            _this3.overlay.context.globalAlpha = Math.min(1, board.size / chart.boardMaxSize + 0.12);
                            _this3.overlay.context.fillRect(chartW - 1, Math.round((chart.highest - board.price) * chart.ratio), -(Math.min(19, Math.ceil(board.size / chart.boardMaxSize * 19)) + 1), boardItemHeight);
                        }
                        _this3.overlay.context.restore();
                    }
                    // Pinned Price
                    _this3.pinnedPrices.forEach(function (price) {
                        _this3._drawPriceTag(_this3.overlay.context, 0, Math.round((chart.highest - price) * chart.ratio), chartW, price, price > chart.latest ? _this3.color.long : _this3.color.short, "#ffffff", [3, 3]);
                    });
                    // Positions (testing)
                    _this3._positions.forEach(function (position) {
                        _this3._drawPositionMarker(_this3.overlay.context, 0, Math.round((chart.highest - position.price) * chart.ratio), chartW, position, chart.latest);
                    });
                    // Orders (testing)
                    _this3._orders.forEach(function (order) {
                        _this3._drawOrderMarker(_this3.overlay.context, 0, Math.round((chart.highest - order.price) * chart.ratio), chartW, order, chart.latest);
                    });
                    // LTP
                    var color = _this3.color.borderLTP;
                    if (chart.highestPrice === chart.latest) {
                        color = _this3.color.long;
                    } else if (chart.lowestPrice === chart.latest) {
                        color = _this3.color.short;
                    }
                    _this3._drawPriceTag(_this3.overlay.context, 0, ltpp, chartW, chart.latest, color, _this3.color.borderLTPText, []);
                    // Price Pop Effect (testing)
                    if (_this3.options.pricePopEffect) {
                        _this3._drawPricePopEffect(chart, decimal, chartW, ltpp);
                    }
                }
            };

            for (j = 0; j < m; j++) {
                var _ret = _loop();

                if (_ret === "continue") continue;
            } // main
            // technical
            for (j = 0; j < m; j++) {
                var _chart = this.charts[j];
                if (!_chart.selected) {
                    break;
                }
                var _ctx = _chart.context;
                var _barX = chartW - chartM - 0.5;
                if (period === 0) {
                    // tick (special)
                    this._drawSMA(_ctx, _barX, _chart, l, 1, this.color.text);
                } else {
                    this._drawSMA(_ctx, _barX, _chart, l, 10, this.color.lineMA1);
                    this._drawSMA(_ctx, _barX, _chart, l, 21, this.color.lineMA2);
                    this._drawSMA(_ctx, _barX, _chart, l, 34, this.color.lineMA3);
                }
            } // technical
            // datetime
            barDate = new Date(this.charts[0]._bars[0][0 /* Time */]);
            this.grid.context.textAlign = "right";
            this.grid.context.fillStyle = this.color.text;
            this.grid.context.fillText(":" + util.zeroPadding(barDate.getMinutes(), 2), canvasW - 45, canvasH - 4);
            // cursor
            this.cursorPrice = 0;
            if (this.cursorX > 0 && this.cursorY > 30 && this.cursorX < chartW && this.cursorY < chartH) {
                var pX = this.cursorX - this.cursorX % barW;
                i = Math.round((chartW - pX - chartM - this.options.barWidth) / barW);
                pX = Math.floor(chartW - chartM - i * barW - barW / 2) - 1;
                // bar line
                this.grid.context.fillStyle = this.color.grid;
                this.grid.context.fillRect(pX, 0, this.options.barWidth, chartH);
                var _chart2 = this.charts[0];
                this.cursorPrice = Math.ceil((_chart2.highest - this.cursorY / _chart2.ratio) * decimal) / decimal;
                if (decimal === 1) {
                    this.cursorPrice = Math.round(this.cursorPrice / 50) * 50;
                } else {
                    this.cursorPrice = Math.round(this.cursorPrice * (decimal / 10)) / (decimal / 10);
                }
                var cursorPriceY = Math.round((_chart2.highest - this.cursorPrice) * _chart2.ratio);
                // price
                this._drawPriceTag(this.overlay.context, 0, cursorPriceY, chartW, this.cursorPrice, this.color.border, this.color.textStrong, []);
                // board
                this.cursorBoard = 0;
                this.cursorBoardPrice = 0;
                if (_chart2.board) {
                    if (this.cursorPrice > _chart2.latest) {
                        for (j = _chart2.board.asks.length - 1; j >= 0; j--) {
                            if (_chart2.board.asks[j].price <= this.cursorPrice) {
                                this.cursorBoard = _chart2.board.asks[j].size;
                                this.cursorBoardPrice = _chart2.board.asks[j].price;
                                break;
                            }
                        }
                    }
                    if (this.cursorPrice < _chart2.latest) {
                        for (j = _chart2.board.bids.length - 1; j >= 0; j--) {
                            if (_chart2.board.bids[j].price >= this.cursorPrice) {
                                this.cursorBoard = _chart2.board.bids[j].size;
                                this.cursorBoardPrice = _chart2.board.bids[j].price;
                                break;
                            }
                        }
                    }
                }
                this.cursorBoard = Math.round(this.cursorBoard);
                if (this.cursorBoard > 0) {
                    var cursorBoardPriceY = Math.round((_chart2.highest - this.cursorBoardPrice) * _chart2.ratio);
                    this._drawBorder(this.overlay.context, chartW - 25, cursorBoardPriceY + (this.cursorPrice > _chart2.latest ? -0.5 : +0.5), 10, this.cursorPrice > _chart2.latest ? this.color.askOrder : this.color.bidOrder, [1, 1]);
                    this.overlay.context.save();
                    this.overlay.context.globalAlpha = 0.8;
                    this.overlay.context.fillStyle = this.color.bg;
                    this.overlay.context.fillRect(chartW - 29, cursorBoardPriceY - 7, -22, 13);
                    this.overlay.context.globalAlpha = 1;
                    this.overlay.context.textAlign = "right";
                    this.overlay.context.fillStyle = this.cursorPrice > _chart2.latest ? this.color.askOrder : this.color.bidOrder;
                    this.overlay.context.fillText(this.cursorBoard.toString(10), chartW - 29, cursorBoardPriceY + 3, 20);
                    this.overlay.context.restore();
                }
                this.overlay.context.save();
                if (i >= 0 && i < _chart2._bars.length) {
                    // Time Line
                    this.grid.context.fillStyle = this.color.grid;
                    this.grid.context.fillRect(pX - 13, chartH, 31, 20);
                    // Time Text
                    barDate = new Date(_chart2._bars[i][0 /* Time */]);
                    var barTime = barDate.getHours() === 0 && barDate.getMinutes() === 0 ? barDate.getMonth() + 1 + "/" + barDate.getDate() + "'" : barDate.getHours() + ":" + util.zeroPadding(barDate.getMinutes(), 2);
                    this.grid.context.textAlign = "center";
                    this.grid.context.fillStyle = this.color.textStrong;
                    this.grid.context.font = "10px sans-serif";
                    this.grid.context.fillText(barTime, pX + this.options.barWidth / 2, canvasH - 4);
                    // Bar Info
                    this.overlay.context.textAlign = "left";
                    this.overlay.context.fillStyle = this.color.textStrong;
                    this.overlay.context.font = "12px monospace";
                    var diff = Math.round((100 - _chart2._bars[i][1 /* Open */] / _chart2._bars[i][4 /* Close */] * 100) * 1000) / 1000;
                    this.overlay.context.fillText(barDate.toLocaleString() + ("  O " + new _decimal.Decimal(_chart2._bars[i][1 /* Open */]).toFixed(decimalPower)) + ("  H " + new _decimal.Decimal(_chart2._bars[i][2 /* High */]).toFixed(decimalPower)) + ("  L " + new _decimal.Decimal(_chart2._bars[i][3 /* Low */]).toFixed(decimalPower)) + ("  C " + new _decimal.Decimal(_chart2._bars[i][4 /* Close */]).toFixed(decimalPower)) + ("  " + util.toStringWithSign(diff) + "%"), 10, 20);
                    this.overlay.context.fillText("[価格マーカー] 左クリックで追加・削除", 10, 40);
                    // Volume
                    if (_chart2._bars[i + 1]) {
                        this.overlay.context.globalAlpha = 0.8;
                        this.overlay.context.fillStyle = this.color.bg;
                        this.overlay.context.fillRect(pX + barW / 2 - 17, (_chart2.highest - _chart2.lowestPrice) * _chart2.ratio + 2, 34, 13);
                        this.overlay.context.globalAlpha = 1;
                        this.overlay.context.textAlign = "center";
                        this.overlay.context.font = "10px sans-serif";
                        this.overlay.context.fillStyle = this.color.volume;
                        this.overlay.context.fillText(Math.round(_chart2._bars[i][5 /* Volume */]).toString(10), pX + barW / 2, (_chart2.highest - _chart2.lowestPrice) * _chart2.ratio + 12, 30);
                    }
                }
                this.overlay.context.restore();
                // Total Margin of Positions on Cursor (testing)
                if (!this._positions.isEmpty() && this.cursorPrice) {
                    var margin = Math.floor(this._positions.marginAgainst(this.cursorPrice));
                    var marginText = util.toStringWithSign(margin);
                    this.overlay.context.save();
                    this.overlay.context.globalAlpha = 0.8;
                    this.overlay.context.fillStyle = this.color.bg;
                    this.overlay.context.fillRect(6, cursorPriceY - 5, 60, 13);
                    this.overlay.context.globalAlpha = 1;
                    this.overlay.context.textAlign = "left";
                    this.overlay.context.fillStyle = margin < 0 ? this.color.short : this.color.long;
                    this.overlay.context.fillText(marginText, 10, cursorPriceY + 5, 56);
                    this.overlay.context.restore();
                }
            } else {
                this.overlay.context.save();
                this.overlay.context.textAlign = "left";
                this.overlay.context.font = "11px monospace";
                this.overlay.context.fillStyle = this.color.text;
                this.overlay.context.fillText("> " + this.charts[0].title, 10, 20);
                if (this.charts[1]) {
                    this.overlay.context.fillStyle = this.color.textWeak;
                    this.overlay.context.fillText("  " + this.charts[1].title, 10, 35);
                }
                this.overlay.context.restore();
            } // cursor
            // Total Margin of Positions (testing)
            if (!this._positions.isEmpty()) {
                var _chart3 = this.charts[0];
                var _margin = Math.floor(this._positions.marginAgainst(_chart3.latest));
                var _marginText = "\u5EFA\u7389: " + this._positions.size + "  \u8A55\u4FA1\u640D\u76CA: " + util.toStringWithSign(_margin);
                this.overlay.context.save();
                this.overlay.context.font = "bold 11px sans-serif";
                this.overlay.context.textAlign = "left";
                this.overlay.context.strokeStyle = this.color.bg;
                this.overlay.context.fillStyle = _margin < 0 ? this.color.short : this.color.long;
                this.overlay.context.strokeText(_marginText, 10, 80);
                this.overlay.context.fillText(_marginText, 10, 80);
                this.overlay.context.restore();
            }
            if (this._afs !== 0) {
                this._afs--;
                this._hasUpdated = true;
            }
        }
    }, {
        key: "_drawPricePopEffect",
        value: function _drawPricePopEffect(chart, decimal, chartW, ltpp) {
            var i = void 0;
            for (i = 0; i < this._pricePops.length; i++) {
                this._pricePops[i][0] *= 0.95;
                if (this._pricePops[i][0] < 0.08) {
                    this._pricePops.splice(i, 1);
                    i--;
                    continue;
                }
                if (this._pricePops[i][5]) {
                    this._pricePops[i][4] -= 0.15;
                } else {
                    this._pricePops[i][4] += 0.15;
                }
            }
            if (chart.tickDelta !== 0) {
                this._pricePops.push([1, (Math.round(Math.abs(chart.tickDelta) * decimal) / decimal).toString(10), chart.tickDelta > 0 ? this.color.long : this.color.short, chartW - 12, chart.tickDelta > 0 ? ltpp - 8 : ltpp + 16, chart.tickDelta > 0, Math.abs(chart.tickDelta) / chart.latest * 100 > 0.025 ? "bold 11px sans-serif" : "10px sans-serif"]);
                this._afs = Math.max(50, this._afs);
                chart.tickDelta = 0;
            }
            this.overlay.context.save();
            this.overlay.context.textAlign = "right";
            for (i = 0; i < this._pricePops.length; i++) {
                var _pricePops$i = _slicedToArray(this._pricePops[i], 7),
                    alpha = _pricePops$i[0],
                    delta = _pricePops$i[1],
                    fillStyle = _pricePops$i[2],
                    posX = _pricePops$i[3],
                    posY = _pricePops$i[4],
                    isBuy = _pricePops$i[5],
                    font = _pricePops$i[6];

                this.overlay.context.font = font;
                this.overlay.context.globalAlpha = alpha;
                this.overlay.context.fillStyle = fillStyle;
                this.overlay.context.fillText(delta, posX, posY);
            }
            this.overlay.context.restore();
        }
    }, {
        key: "_getBars",
        value: function _getBars(index, start, barCount) {
            var chart = this.charts[index];
            var period = this.timePeriod;
            if (chart.bars.length === 0) {
                return [];
            }
            if (period === 1) {
                return chart.bars.slice(start, start + barCount);
            } else if (period === 0) {
                return chart.ticks.slice(start, start + barCount).map(function (tick) {
                    return [tick[0 /* Time */], tick[1 /* Ltp */], tick[1 /* Ltp */], tick[1 /* Ltp */], tick[1 /* Ltp */], tick[2 /* Volume */], tick[3 /* AskDepth */], tick[4 /* BidDepth */], tick[5 /* SellVolume */], tick[6 /* BuyVolume */]];
                });
            }
            var bars = [];
            var date = void 0;
            var backCount = 0;
            // use hBars (experimental)
            if (period === 60) {
                bars.push.apply(bars, util.deepCopy(chart.hBars.slice(start, start + barCount)));
            } else if (period > 60) {
                var hBars = chart.hBars;
                if (start !== 0) {
                    date = new Date(hBars[0][0 /* Time */]);
                    backCount = start * (period / 60) + date.getHours() % (period / 60) - period / 60;
                }
                var _i = Math.min(barCount * (period / 60) + backCount - 1, hBars.length - 1);
                for (; _i >= backCount; _i--) {
                    date = new Date(hBars[_i][0 /* Time */]);
                    if (bars.length === 0 || date.getHours() % Math.ceil(period / 60) === 0 && bars[0][0 /* Time */] < hBars[_i][0 /* Time */]) {
                        bars.unshift([date.getTime(), hBars[_i][1 /* Open */], hBars[_i][2 /* High */], hBars[_i][3 /* Low */], hBars[_i][4 /* Close */], hBars[_i][5 /* Volume */], hBars[_i][6 /* AskDepth */] || 0, hBars[_i][7 /* BidDepth */] || 0, hBars[_i][8 /* SellVolume */] || 0, hBars[_i][9 /* BuyVolume */] || 0]);
                        continue;
                    }
                    if (bars[0][2 /* High */] < hBars[_i][2 /* High */]) {
                        bars[0][2 /* High */] = hBars[_i][2 /* High */];
                    }
                    if (bars[0][3 /* Low */] > hBars[_i][3 /* Low */]) {
                        bars[0][3 /* Low */] = hBars[_i][3 /* Low */];
                    }
                    bars[0][4 /* Close */] = hBars[_i][4 /* Close */];
                    bars[0][5 /* Volume */] += hBars[_i][5 /* Volume */];
                    bars[0][6 /* AskDepth */] = hBars[_i][6 /* AskDepth */] || 0;
                    bars[0][7 /* BidDepth */] = hBars[_i][7 /* BidDepth */] || 0;
                    bars[0][8 /* SellVolume */] += hBars[_i][8 /* SellVolume */] || 0;
                    bars[0][9 /* BuyVolume */] += hBars[_i][9 /* BuyVolume */] || 0;
                }
            }
            var mBars = chart.bars;
            if (start !== 0) {
                date = new Date(mBars[0][0 /* Time */]);
                backCount = start * period + date.getMinutes() % period - period;
            }
            var i = Math.min(barCount * period + backCount - 1, mBars.length - 1) - bars.length * (period / 60);
            for (; i >= backCount; i--) {
                if (bars.length !== 0 && bars[0][0 /* Time */] > mBars[i][0 /* Time */]) {
                    continue;
                }
                date = new Date(mBars[i][0 /* Time */]);
                if (bars.length === 0 || date.getMinutes() % period === 0 && date.getHours() % Math.ceil(period / 60) === 0 && bars[0][0 /* Time */] < mBars[i][0 /* Time */]) {
                    bars.unshift([date.setSeconds(0, 0), mBars[i][1 /* Open */], mBars[i][2 /* High */], mBars[i][3 /* Low */], mBars[i][4 /* Close */], mBars[i][5 /* Volume */], mBars[i][6 /* AskDepth */] || 0, mBars[i][7 /* BidDepth */] || 0, mBars[i][8 /* SellVolume */] || 0, mBars[i][9 /* BuyVolume */] || 0]);
                    continue;
                }
                if (bars[0][2 /* High */] < mBars[i][2 /* High */]) {
                    bars[0][2 /* High */] = mBars[i][2 /* High */];
                }
                if (bars[0][3 /* Low */] > mBars[i][3 /* Low */]) {
                    bars[0][3 /* Low */] = mBars[i][3 /* Low */];
                }
                bars[0][4 /* Close */] = mBars[i][4 /* Close */];
                bars[0][5 /* Volume */] += mBars[i][5 /* Volume */];
                bars[0][6 /* AskDepth */] = mBars[i][6 /* AskDepth */] || 0;
                bars[0][7 /* BidDepth */] = mBars[i][7 /* BidDepth */] || 0;
                bars[0][8 /* SellVolume */] += mBars[i][8 /* SellVolume */] || 0;
                bars[0][9 /* BuyVolume */] += mBars[i][9 /* BuyVolume */] || 0;
            }
            return bars.slice(0, barCount);
        }
    }, {
        key: "_keydownHandler",
        value: function _keydownHandler(ev) {
            var active = document.activeElement && document.activeElement.tagName;
            if (active !== "BODY" && active !== "DIV" && active !== "BUTTON") {
                return;
            }
            if (window.getSelection().toString() !== "") {
                return;
            }
            var activated = false;
            switch (ev.keyCode) {
                // Space
                case 32:
                    activated = true;
                    this.barIndex = 0;
                    this._hasUpdated = true;
                    break;
            }
            if (activated) {
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
    }, {
        key: "_contextmenuHandler",
        value: function _contextmenuHandler(ev) {
            var _this4 = this;

            ev.stopPropagation();
            ev.preventDefault();
            var price = this.cursorPrice;
            var limitSide = this.charts[0].latest > price ? "buy" : "sell";
            var stopSide = limitSide === "buy" ? "sell" : "buy";
            var limitSideLabel = limitSide === "buy" ? "買い" : "売り";
            var stopSideLabel = stopSide === "buy" ? "買い" : "売り";
            var quickOrderItems = [];
            if (this.options.quickOrder) {
                quickOrderItems.push({
                    labelHTML: "<span class=\"kuromaty-label " + limitSide + "\">" + limitSideLabel + "</span> \u6307\u5024\u6CE8\u6587...",
                    onSelect: function onSelect() {
                        _this4.options.quickOrderHandler({
                            price: price,
                            type: "limit"
                        });
                    }
                }, {
                    labelHTML: "<span class=\"kuromaty-label " + stopSide + "\">" + stopSideLabel + "</span> STOP-LIMIT \u6CE8\u6587...",
                    onSelect: function onSelect() {
                        _this4.options.quickOrderHandler({
                            price: price,
                            type: "stop-limit"
                        });
                    }
                });
            }
            if (this._contextMenu && this._contextMenu.visible() === true) {
                this._contextMenu.close();
            }
            this._contextMenu = new _flagrate2.default.ContextMenu({
                target: this._rootContainer,
                items: [{
                    label: "" + price,
                    isDisabled: true
                }, "--", {
                    labelHTML: "価格をコピー",
                    onSelect: function onSelect() {
                        util.copyTextToClipboard(price.toString(10));
                    }
                }].concat(quickOrderItems, ["--", {
                    label: "価格マーカー全消去",
                    onSelect: function onSelect() {
                        _this4.pinnedPrices = [];
                        _this4._hasUpdated = true;
                    }
                }, "--", {
                    label: "キャンセル"
                }])
            }).open(ev);
        }
    }, {
        key: "_pointerdownHandler",
        value: function _pointerdownHandler(ev) {
            if (ev.target !== this.overlay.canvas) {
                return;
            }
            ev.preventDefault();
            if (this._contextMenu && this._contextMenu.visible() === true) {
                this._contextMenu.close();
                this._contextMenu = null;
                return;
            }
            var offsetX = ev.offsetX;
            var offsetY = ev.offsetY;
            if (!offsetX && !offsetY && ev.target) {
                var rect = ev.target.getBoundingClientRect();
                offsetX = ev.clientX - rect.left;
                offsetY = ev.clientY - rect.top;
            }
            var buttons = ev.buttons;
            if (buttons === undefined && ev.which) {
                switch (ev.which) {
                    case 2:
                        buttons = 4;
                        break;
                    case 3:
                        buttons = 2;
                        break;
                    default:
                        buttons = ev.which;
                }
            }
            if (buttons === 2) {
                return;
            }
            this._lastPointerdown = [offsetX, offsetY];
            this._lastPointerButtons = buttons;
            this._dragStartX = undefined;
        }
    }, {
        key: "_pointerupHandler",
        value: function _pointerupHandler(ev) {
            if (ev.target !== this.overlay.canvas) {
                return;
            }
            var offsetX = ev.offsetX;
            var offsetY = ev.offsetY;
            if (!offsetX && !offsetY) {
                var rect = ev.target.getBoundingClientRect();
                offsetX = ev.clientX - rect.left;
                offsetY = ev.clientY - rect.top;
            }
            if (ev.pointerType !== "touch" && this._lastPointerdown[0] === offsetX && this._lastPointerdown[1] === offsetY) {
                if (this._lastPointerButtons === 1) {
                    if (this.cursorPrice) {
                        var pinnedPriceIndex = this.pinnedPrices.indexOf(this.cursorPrice);
                        if (pinnedPriceIndex === -1) {
                            this.pinnedPrices.push(this.cursorPrice);
                        } else {
                            this.pinnedPrices.splice(pinnedPriceIndex, 1);
                        }
                    }
                }
            }
            this._lastPointerdown = [0, 0];
            this._lastPointerButtons = 0;
            this._hasUpdated = true;
            ev.preventDefault();
        }
    }, {
        key: "_pointermoveHandler",
        value: function _pointermoveHandler(ev) {
            if (ev.target !== this.overlay.canvas) {
                return;
            }
            var offsetX = ev.offsetX;
            var offsetY = ev.offsetY;
            if (!offsetX && !offsetY) {
                var rect = ev.target.getBoundingClientRect();
                offsetX = ev.clientX - rect.left;
                offsetY = ev.clientY - rect.top;
            }
            var buttons = ev.buttons;
            if (buttons === undefined && ev.which) {
                switch (ev.which) {
                    case 2:
                        buttons = 4;
                        break;
                    case 3:
                        buttons = 2;
                        break;
                    default:
                        buttons = ev.which;
                }
            }
            if (buttons === 1) {
                ev.preventDefault();
                if (!this._dragStartX) {
                    this._dragStartX = offsetX;
                    this._dragStartI = this.barIndex;
                }
                var deltaX = this._dragStartX - offsetX;
                this.barIndex = this._dragStartI - Math.round(deltaX / (this.options.barWidth + this.options.barMargin));
                if (this.barIndex < 0) {
                    this.barIndex = 0;
                } else if (this.barIndex >= this.charts[0].bars.length) {
                    this.barIndex = this.charts[0].bars.length - 1;
                }
            } else {
                this._dragStartX = undefined;
            }
            this.cursorX = offsetX;
            this.cursorY = offsetY;
            this._hasUpdated = true;
        }
    }, {
        key: "_pointeroutHandler",
        value: function _pointeroutHandler(ev) {
            this.cursorX = this.cursorY = -1;
        }
    }, {
        key: "_wheelHandler",
        value: function _wheelHandler(ev) {
            ev.preventDefault();
            if (ev.ctrlKey) {
                this.zoom(ev.deltaY < 0 ? 1 : ev.deltaY > 0 ? -1 : 0);
                return;
            }
            this.barIndex -= Math.round(ev.deltaX ? ev.deltaX : -(ev.deltaY / 6));
            if (this.barIndex < 0) {
                this.barIndex = 0;
            }
            this._hasUpdated = true;
        }
    }, {
        key: "_drawBorder",
        value: function _drawBorder(ctx, x, y, w, color, lineDash) {
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.setLineDash(lineDash);
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.stroke();
            ctx.restore();
        }
    }, {
        key: "_drawVerticalRange",
        value: function _drawVerticalRange(ctx, x, y, h, color, lineDash) {
            x += 0.5;
            y = Math.round(y);
            h = Math.round(h);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.setLineDash(lineDash);
            ctx.moveTo(x, y + 1);
            ctx.lineTo(x, y + h - 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 3, y + 4);
            ctx.lineTo(x - 3, y + 4);
            ctx.moveTo(x, y + h);
            ctx.lineTo(x + 3, y + h - 4);
            ctx.lineTo(x - 3, y + h - 4);
            ctx.fill();
            ctx.restore();
        }
    }, {
        key: "_drawPriceTag",
        value: function _drawPriceTag(ctx, x, y, w, price, color, textColor, lineDash, tagColor, alpha) {
            this._drawBorder(ctx, x, y + 0.5, w - 5, color, lineDash);
            w += x;
            ctx.save();
            ctx.globalAlpha = alpha || 1;
            ctx.fillStyle = tagColor || color;
            ctx.beginPath();
            ctx.moveTo(w - 5, y);
            ctx.lineTo(w + 1, y - 6);
            ctx.lineTo(w + 42, y - 6);
            ctx.lineTo(w + 43, y - 5);
            ctx.lineTo(w + 43, y + 6);
            ctx.lineTo(w + 42, y + 7);
            ctx.lineTo(w + 1, y + 7);
            ctx.lineTo(w - 5, y + 1);
            ctx.fill();
            ctx.textAlign = "left";
            ctx.fillStyle = textColor;
            ctx.font = "11px sans-serif";
            ctx.fillText(new _decimal.Decimal(price).toFixed(this.options.decimalPower), w + 2, y + 5, 39);
            ctx.restore();
        }
    }, {
        key: "_drawPriceTag2",
        value: function _drawPriceTag2(ctx, x, y, w, price, color, lineDash) {
            this._drawBorder(ctx, x, y + 0.5, w - 5, color, lineDash);
            w += x;
            ctx.save();
            ctx.fillStyle = this.color.bg;
            ctx.fillRect(w + 1, y - 5, 40, 10);
            ctx.textAlign = "left";
            ctx.fillStyle = color;
            ctx.font = "11px sans-serif";
            ctx.fillText(new _decimal.Decimal(price).toFixed(this.options.decimalPower), w + 2, y + 5, 39);
            ctx.restore();
        }
    }, {
        key: "_drawDepthIndicator",
        value: function _drawDepthIndicator(ctx, x, y, value, color) {
            this._drawBorder(ctx, x, y + 0.5, -10, color, [2, 2]);
            ctx.save();
            ctx.textAlign = "right";
            ctx.fillStyle = this.color.textWeak;
            ctx.strokeStyle = this.color.bg;
            ctx.lineWidth = 2.5;
            ctx.font = "10px sans-serif";
            ctx.strokeText(value, x - 13, y + 3.5);
            ctx.fillText(value, x - 13, y + 3.5);
            ctx.restore();
        }
    }, {
        key: "_drawPositionMarker",
        value: function _drawPositionMarker(ctx, x, y, w, position, ltp) {
            var color = position.side === "L" ? this.color.long : this.color.short;
            var margin = Math.floor(position.marginAgainst(ltp));
            this._drawPriceTag(ctx, x, y, w, position.price.toNumber(), color, "#ffffff", [1, 2]);
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = this.color.bg;
            ctx.fillRect(x + 4, y - 2, 80, -13);
            ctx.globalAlpha = 1;
            ctx.textAlign = "left";
            ctx.fillStyle = color;
            ctx.fillText(position.size + " " + position.side + ", " + util.toStringWithSign(margin), x + 6, y - 5, 76);
            ctx.restore();
        }
    }, {
        key: "_drawOrderMarker",
        value: function _drawOrderMarker(ctx, x, y, w, order, ltp) {
            var color = this.color.text;
            switch (order.side) {
                case "L":
                    color = this.color.long;
                    break;
                case "S":
                    color = this.color.short;
                    break;
            }
            this._drawPriceTag(ctx, x, y, w, order.price.toNumber(), color, "#ffffff", [1, 5], null, 0.45);
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = this.color.bg;
            ctx.fillRect(x + 4, y - 2, 80, -13);
            ctx.globalAlpha = 1;
            ctx.textAlign = "left";
            ctx.fillStyle = color;
            ctx.fillText(order.size + " " + order.side + " " + order.type, x + 6, y - 5, 76);
            ctx.restore();
        }
    }, {
        key: "_drawSMA",
        value: function _drawSMA(ctx, x, chart, count, value, color) {
            var barW = this.options.barMargin + this.options.barWidth;
            x = x + barW;
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.setLineDash([]);
            ctx.beginPath();
            var i = 0,
                j = void 0,
                bar = void 0,
                p = 0,
                y = 0;
            for (; i < count; i++) {
                if (!chart._bars[i] || !chart._bars[i + value]) {
                    break;
                }
                x -= barW;
                p = 0;
                for (j = 0; j < value; j++) {
                    p += chart._bars[i + j][4 /* Close */];
                }
                p /= value;
                y = Math.round((chart.highest - p) * chart.ratio) + 0.5;
                if (i === 0) {
                    ctx.moveTo(x, y);
                }
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return Kuromaty;
}();

exports.Kuromaty = Kuromaty;

if (window.Kuromaty === undefined) {
    window.Kuromaty = Kuromaty;
}
exports.default = Kuromaty;



},{"./OrderSet":2,"./PositionSet":4,"./util":6,"decimal.js-light":7,"flagrate/lib/es6/flagrate":8}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*!
                                                                                                                                                                                                                                                                                  Copyright 2017 Kuromatch
                                                                                                                                                                                                                                                                              */


exports.zeroPadding = zeroPadding;
exports.generatePriceGrouping = generatePriceGrouping;
exports.toStringWithSign = toStringWithSign;
exports.copyTextToClipboard = copyTextToClipboard;
exports.deepCopy = deepCopy;

var _flagrate = require("flagrate/lib/es6/flagrate");

var _flagrate2 = _interopRequireDefault(_flagrate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function zeroPadding(number, length) {
    return (Array(length).join("0") + number).slice(-length);
}
function generatePriceGrouping(decimal, groupSize) {
    if (decimal === 1) {
        return function (price) {
            return Math.round(price / groupSize) * groupSize;
        };
    }
    return function (price) {
        return Math.round(price * (decimal / groupSize)) / (decimal / groupSize);
    };
}
function toStringWithSign(number) {
    return (number > 0 ? "+" : "") + number.toString(10);
}
function copyTextToClipboard(text) {
    var span = _flagrate2.default.createElement("span").insertText(text).insertTo(document.body);
    var range = document.createRange();
    range.selectNode(span);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    span.remove();
}
function deepCopy(obj) {
    var newObj = void 0;
    if (Array.isArray(obj)) {
        newObj = obj.length > 0 ? obj.slice(0) : [];
        newObj.forEach(function (e, i) {
            if ((typeof e === "undefined" ? "undefined" : _typeof(e)) === "object" && e !== {} || Array.isArray(e) && e.length > 0) {
                newObj[i] = deepCopy(e);
            }
        });
    } else if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
        newObj = Object.assign({}, obj);
        Object.keys(newObj).forEach(function (key) {
            if (_typeof(newObj[key]) === "object" && newObj[key] !== {} || Array.isArray(newObj[key]) && newObj[key].length > 0) {
                newObj[key] = deepCopy(newObj[key]);
            }
        });
    } else {
        newObj = obj;
    }
    return newObj;
}



},{"flagrate/lib/es6/flagrate":8}],7:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! decimal.js-light v2.3.0 https://github.com/MikeMcl/decimal.js-light/LICENCE */
;(function (globalScope) {
  'use strict';

  /*
   *  decimal.js-light v2.3.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js-light
   *  Copyright (c) 2017 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Expat Licence
   */

  // -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


  // The limit on the value of `precision`, and on the value of the first argument to
  // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.

  var MAX_DIGITS = 1e9,
      // 0 to 1e9


  // The initial configuration properties of the Decimal constructor.
  Decimal = {

    // These values must be integers within the stated ranges (inclusive).
    // Most of these values can be changed during run-time using `Decimal.config`.

    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    precision: 20, // 1 to MAX_DIGITS

    // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
    // `toFixed`, `toPrecision` and `toSignificantDigits`.
    //
    // ROUND_UP         0 Away from zero.
    // ROUND_DOWN       1 Towards zero.
    // ROUND_CEIL       2 Towards +Infinity.
    // ROUND_FLOOR      3 Towards -Infinity.
    // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    rounding: 4, // 0 to 8

    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    toExpNeg: -7, // 0 to -MAX_E

    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    toExpPos: 21, // 0 to MAX_E

    // The natural logarithm of 10.
    // 115 digits
    LN10: '2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286'
  },


  // ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


  external = true,
      decimalError = '[DecimalError] ',
      invalidArgument = decimalError + 'Invalid argument: ',
      exponentOutOfRange = decimalError + 'Exponent out of range: ',
      mathfloor = Math.floor,
      mathpow = Math.pow,
      isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
      ONE,
      BASE = 1e7,
      LOG_BASE = 7,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_E = mathfloor(MAX_SAFE_INTEGER / LOG_BASE),
      // 1286742750677284

  // Decimal.prototype object
  P = {};

  // Decimal prototype methods


  /*
   *  absoluteValue                       abs
   *  comparedTo                          cmp
   *  decimalPlaces                       dp
   *  dividedBy                           div
   *  dividedToIntegerBy                  idiv
   *  equals                              eq
   *  exponent
   *  greaterThan                         gt
   *  greaterThanOrEqualTo                gte
   *  isInteger                           isint
   *  isNegative                          isneg
   *  isPositive                          ispos
   *  isZero
   *  lessThan                            lt
   *  lessThanOrEqualTo                   lte
   *  logarithm                           log
   *  minus                               sub
   *  modulo                              mod
   *  naturalExponential                  exp
   *  naturalLogarithm                    ln
   *  negated                             neg
   *  plus                                add
   *  precision                           sd
   *  squareRoot                          sqrt
   *  times                               mul
   *  toDecimalPlaces                     todp
   *  toExponential
   *  toFixed
   *  toInteger                           toint
   *  toNumber
   *  toPower                             pow
   *  toPrecision
   *  toSignificantDigits                 tosd
   *  toString
   *  valueOf                             val
   */

  /*
   * Return a new Decimal whose value is the absolute value of this Decimal.
   *
   */
  P.absoluteValue = P.abs = function () {
    var x = new this.constructor(this);
    if (x.s) x.s = 1;
    return x;
  };

  /*
   * Return
   *   1    if the value of this Decimal is greater than the value of `y`,
   *  -1    if the value of this Decimal is less than the value of `y`,
   *   0    if they have the same value
   *
   */
  P.comparedTo = P.cmp = function (y) {
    var i,
        j,
        xdL,
        ydL,
        x = this;

    y = new x.constructor(y);

    // Signs differ?
    if (x.s !== y.s) return x.s || -y.s;

    // Compare exponents.
    if (x.e !== y.e) return x.e > y.e ^ x.s < 0 ? 1 : -1;

    xdL = x.d.length;
    ydL = y.d.length;

    // Compare digit by digit.
    for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
      if (x.d[i] !== y.d[i]) return x.d[i] > y.d[i] ^ x.s < 0 ? 1 : -1;
    }

    // Compare lengths.
    return xdL === ydL ? 0 : xdL > ydL ^ x.s < 0 ? 1 : -1;
  };

  /*
   * Return the number of decimal places of the value of this Decimal.
   *
   */
  P.decimalPlaces = P.dp = function () {
    var x = this,
        w = x.d.length - 1,
        dp = (w - x.e) * LOG_BASE;

    // Subtract the number of trailing zeros of the last word.
    w = x.d[w];
    if (w) for (; w % 10 == 0; w /= 10) {
      dp--;
    }return dp < 0 ? 0 : dp;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal divided by `y`, truncated to
   * `precision` significant digits.
   *
   */
  P.dividedBy = P.div = function (y) {
    return divide(this, new this.constructor(y));
  };

  /*
   * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
   * by the value of `y`, truncated to `precision` significant digits.
   *
   */
  P.dividedToIntegerBy = P.idiv = function (y) {
    var x = this,
        Ctor = x.constructor;
    return round(divide(x, new Ctor(y), 0, 1), Ctor.precision);
  };

  /*
   * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
   *
   */
  P.equals = P.eq = function (y) {
    return !this.cmp(y);
  };

  /*
   * Return the (base 10) exponent value of this Decimal (this.e is the base 10000000 exponent).
   *
   */
  P.exponent = function () {
    return getBase10Exponent(this);
  };

  /*
   * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
   * false.
   *
   */
  P.greaterThan = P.gt = function (y) {
    return this.cmp(y) > 0;
  };

  /*
   * Return true if the value of this Decimal is greater than or equal to the value of `y`,
   * otherwise return false.
   *
   */
  P.greaterThanOrEqualTo = P.gte = function (y) {
    return this.cmp(y) >= 0;
  };

  /*
   * Return true if the value of this Decimal is an integer, otherwise return false.
   *
   */
  P.isInteger = P.isint = function () {
    return this.e > this.d.length - 2;
  };

  /*
   * Return true if the value of this Decimal is negative, otherwise return false.
   *
   */
  P.isNegative = P.isneg = function () {
    return this.s < 0;
  };

  /*
   * Return true if the value of this Decimal is positive, otherwise return false.
   *
   */
  P.isPositive = P.ispos = function () {
    return this.s > 0;
  };

  /*
   * Return true if the value of this Decimal is 0, otherwise return false.
   *
   */
  P.isZero = function () {
    return this.s === 0;
  };

  /*
   * Return true if the value of this Decimal is less than `y`, otherwise return false.
   *
   */
  P.lessThan = P.lt = function (y) {
    return this.cmp(y) < 0;
  };

  /*
   * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
   *
   */
  P.lessThanOrEqualTo = P.lte = function (y) {
    return this.cmp(y) < 1;
  };

  /*
   * Return the logarithm of the value of this Decimal to the specified base, truncated to
   * `precision` significant digits.
   *
   * If no base is specified, return log[10](x).
   *
   * log[base](x) = ln(x) / ln(base)
   *
   * The maximum error of the result is 1 ulp (unit in the last place).
   *
   * [base] {number|string|Decimal} The base of the logarithm.
   *
   */
  P.logarithm = P.log = function (base) {
    var r,
        x = this,
        Ctor = x.constructor,
        pr = Ctor.precision,
        wpr = pr + 5;

    // Default base is 10.
    if (base === void 0) {
      base = new Ctor(10);
    } else {
      base = new Ctor(base);

      // log[-b](x) = NaN
      // log[0](x)  = NaN
      // log[1](x)  = NaN
      if (base.s < 1 || base.eq(ONE)) throw Error(decimalError + 'NaN');
    }

    // log[b](-x) = NaN
    // log[b](0) = -Infinity
    if (x.s < 1) throw Error(decimalError + (x.s ? 'NaN' : '-Infinity'));

    // log[b](1) = 0
    if (x.eq(ONE)) return new Ctor(0);

    external = false;
    r = divide(ln(x, wpr), ln(base, wpr), wpr);
    external = true;

    return round(r, pr);
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal minus `y`, truncated to
   * `precision` significant digits.
   *
   */
  P.minus = P.sub = function (y) {
    var x = this;
    y = new x.constructor(y);
    return x.s == y.s ? subtract(x, y) : add(x, (y.s = -y.s, y));
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal modulo `y`, truncated to
   * `precision` significant digits.
   *
   */
  P.modulo = P.mod = function (y) {
    var q,
        x = this,
        Ctor = x.constructor,
        pr = Ctor.precision;

    y = new Ctor(y);

    // x % 0 = NaN
    if (!y.s) throw Error(decimalError + 'NaN');

    // Return x if x is 0.
    if (!x.s) return round(new Ctor(x), pr);

    // Prevent rounding of intermediate calculations.
    external = false;
    q = divide(x, y, 0, 1).times(y);
    external = true;

    return x.minus(q);
  };

  /*
   * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
   * i.e. the base e raised to the power the value of this Decimal, truncated to `precision`
   * significant digits.
   *
   */
  P.naturalExponential = P.exp = function () {
    return exp(this);
  };

  /*
   * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
   * truncated to `precision` significant digits.
   *
   */
  P.naturalLogarithm = P.ln = function () {
    return ln(this);
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
   * -1.
   *
   */
  P.negated = P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s || 0;
    return x;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal plus `y`, truncated to
   * `precision` significant digits.
   *
   */
  P.plus = P.add = function (y) {
    var x = this;
    y = new x.constructor(y);
    return x.s == y.s ? add(x, y) : subtract(x, (y.s = -y.s, y));
  };

  /*
   * Return the number of significant digits of the value of this Decimal.
   *
   * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
   *
   */
  P.precision = P.sd = function (z) {
    var e,
        sd,
        w,
        x = this;

    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

    e = getBase10Exponent(x) + 1;
    w = x.d.length - 1;
    sd = w * LOG_BASE + 1;
    w = x.d[w];

    // If non-zero...
    if (w) {

      // Subtract the number of trailing zeros of the last word.
      for (; w % 10 == 0; w /= 10) {
        sd--;
      } // Add the number of digits of the first word.
      for (w = x.d[0]; w >= 10; w /= 10) {
        sd++;
      }
    }

    return z && e > sd ? e : sd;
  };

  /*
   * Return a new Decimal whose value is the square root of this Decimal, truncated to `precision`
   * significant digits.
   *
   */
  P.squareRoot = P.sqrt = function () {
    var e,
        n,
        pr,
        r,
        s,
        t,
        wpr,
        x = this,
        Ctor = x.constructor;

    // Negative or zero?
    if (x.s < 1) {
      if (!x.s) return new Ctor(0);

      // sqrt(-x) = NaN
      throw Error(decimalError + 'NaN');
    }

    e = getBase10Exponent(x);
    external = false;

    // Initial estimate.
    s = Math.sqrt(+x);

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = digitsToString(x.d);
      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(n);
      e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '1e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new Ctor(n);
    } else {
      r = new Ctor(s.toString());
    }

    pr = Ctor.precision;
    s = wpr = pr + 3;

    // Newton-Raphson iteration.
    for (;;) {
      t = r;
      r = t.plus(divide(x, t, wpr + 2)).times(0.5);

      if (digitsToString(t.d).slice(0, wpr) === (n = digitsToString(r.d)).slice(0, wpr)) {
        n = n.slice(wpr - 3, wpr + 1);

        // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
        // 4999, i.e. approaching a rounding boundary, continue the iteration.
        if (s == wpr && n == '4999') {

          // On the first iteration only, check to see if rounding up gives the exact result as the
          // nines may infinitely repeat.
          round(t, pr + 1, 0);

          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        } else if (n != '9999') {
          break;
        }

        wpr += 4;
      }
    }

    external = true;

    return round(r, pr);
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal times `y`, truncated to
   * `precision` significant digits.
   *
   */
  P.times = P.mul = function (y) {
    var carry,
        e,
        i,
        k,
        r,
        rL,
        t,
        xdL,
        ydL,
        x = this,
        Ctor = x.constructor,
        xd = x.d,
        yd = (y = new Ctor(y)).d;

    // Return 0 if either is 0.
    if (!x.s || !y.s) return new Ctor(0);

    y.s *= x.s;
    e = x.e + y.e;
    xdL = xd.length;
    ydL = yd.length;

    // Ensure xd points to the longer array.
    if (xdL < ydL) {
      r = xd;
      xd = yd;
      yd = r;
      rL = xdL;
      xdL = ydL;
      ydL = rL;
    }

    // Initialise the result array with zeros.
    r = [];
    rL = xdL + ydL;
    for (i = rL; i--;) {
      r.push(0);
    } // Multiply!
    for (i = ydL; --i >= 0;) {
      carry = 0;
      for (k = xdL + i; k > i;) {
        t = r[k] + yd[i] * xd[k - i - 1] + carry;
        r[k--] = t % BASE | 0;
        carry = t / BASE | 0;
      }

      r[k] = (r[k] + carry) % BASE | 0;
    }

    // Remove trailing zeros.
    for (; !r[--rL];) {
      r.pop();
    }if (carry) ++e;else r.shift();

    y.d = r;
    y.e = e;

    return external ? round(y, Ctor.precision) : y;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
   * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
   *
   * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toDecimalPlaces = P.todp = function (dp, rm) {
    var x = this,
        Ctor = x.constructor;

    x = new Ctor(x);
    if (dp === void 0) return x;

    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);

    return round(x, dp + getBase10Exponent(x) + 1, rm);
  };

  /*
   * Return a string representing the value of this Decimal in exponential notation rounded to
   * `dp` fixed decimal places using rounding mode `rounding`.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toExponential = function (dp, rm) {
    var str,
        x = this,
        Ctor = x.constructor;

    if (dp === void 0) {
      str = toString(x, true);
    } else {
      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);

      x = round(new Ctor(x), dp + 1, rm);
      str = toString(x, true, dp + 1);
    }

    return str;
  };

  /*
   * Return a string representing the value of this Decimal in normal (fixed-point) notation to
   * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
   * omitted.
   *
   * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   * (-0).toFixed(3) is '0.000'.
   * (-0.5).toFixed(0) is '-0'.
   *
   */
  P.toFixed = function (dp, rm) {
    var str,
        y,
        x = this,
        Ctor = x.constructor;

    if (dp === void 0) return toString(x);

    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);

    y = round(new Ctor(x), dp + getBase10Exponent(x) + 1, rm);
    str = toString(y.abs(), false, dp + getBase10Exponent(y) + 1);

    // To determine whether to add the minus sign look at the value before it was rounded,
    // i.e. look at `x` rather than `y`.
    return x.isneg() && !x.isZero() ? '-' + str : str;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
   * rounding mode `rounding`.
   *
   */
  P.toInteger = P.toint = function () {
    var x = this,
        Ctor = x.constructor;
    return round(new Ctor(x), getBase10Exponent(x) + 1, Ctor.rounding);
  };

  /*
   * Return the value of this Decimal converted to a number primitive.
   *
   */
  P.toNumber = function () {
    return +this;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal raised to the power `y`,
   * truncated to `precision` significant digits.
   *
   * For non-integer or very large exponents pow(x, y) is calculated using
   *
   *   x^y = exp(y*ln(x))
   *
   * The maximum error is 1 ulp (unit in last place).
   *
   * y {number|string|Decimal} The power to which to raise this Decimal.
   *
   */
  P.toPower = P.pow = function (y) {
    var e,
        k,
        pr,
        r,
        sign,
        yIsInt,
        x = this,
        Ctor = x.constructor,
        guard = 12,
        yn = +(y = new Ctor(y));

    // pow(x, 0) = 1
    if (!y.s) return new Ctor(ONE);

    x = new Ctor(x);

    // pow(0, y > 0) = 0
    // pow(0, y < 0) = Infinity
    if (!x.s) {
      if (y.s < 1) throw Error(decimalError + 'Infinity');
      return x;
    }

    // pow(1, y) = 1
    if (x.eq(ONE)) return x;

    pr = Ctor.precision;

    // pow(x, 1) = x
    if (y.eq(ONE)) return round(x, pr);

    e = y.e;
    k = y.d.length - 1;
    yIsInt = e >= k;
    sign = x.s;

    if (!yIsInt) {

      // pow(x < 0, y non-integer) = NaN
      if (sign < 0) throw Error(decimalError + 'NaN');

      // If y is a small integer use the 'exponentiation by squaring' algorithm.
    } else if ((k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
      r = new Ctor(ONE);

      // Max k of 9007199254740991 takes 53 loop iterations.
      // Maximum digits array length; leaves [28, 34] guard digits.
      e = Math.ceil(pr / LOG_BASE + 4);

      external = false;

      for (;;) {
        if (k % 2) {
          r = r.times(x);
          truncate(r.d, e);
        }

        k = mathfloor(k / 2);
        if (k === 0) break;

        x = x.times(x);
        truncate(x.d, e);
      }

      external = true;

      return y.s < 0 ? new Ctor(ONE).div(r) : round(r, pr);
    }

    // Result is negative if x is negative and the last digit of integer y is odd.
    sign = sign < 0 && y.d[Math.max(e, k)] & 1 ? -1 : 1;

    x.s = 1;
    external = false;
    r = y.times(ln(x, pr + guard));
    external = true;
    r = exp(r);
    r.s = sign;

    return r;
  };

  /*
   * Return a string representing the value of this Decimal rounded to `sd` significant digits
   * using rounding mode `rounding`.
   *
   * Return exponential notation if `sd` is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toPrecision = function (sd, rm) {
    var e,
        str,
        x = this,
        Ctor = x.constructor;

    if (sd === void 0) {
      e = getBase10Exponent(x);
      str = toString(x, e <= Ctor.toExpNeg || e >= Ctor.toExpPos);
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);

      x = round(new Ctor(x), sd, rm);
      e = getBase10Exponent(x);
      str = toString(x, sd <= e || e <= Ctor.toExpNeg, sd);
    }

    return str;
  };

  /*
   * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
   * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
   * omitted.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   */
  P.toSignificantDigits = P.tosd = function (sd, rm) {
    var x = this,
        Ctor = x.constructor;

    if (sd === void 0) {
      sd = Ctor.precision;
      rm = Ctor.rounding;
    } else {
      checkInt32(sd, 1, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;else checkInt32(rm, 0, 8);
    }

    return round(new Ctor(x), sd, rm);
  };

  /*
   * Return a string representing the value of this Decimal.
   *
   * Return exponential notation if this Decimal has a positive exponent equal to or greater than
   * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
   *
   */
  P.toString = P.valueOf = P.val = P.toJSON = function () {
    var x = this,
        e = getBase10Exponent(x),
        Ctor = x.constructor;

    return toString(x, e <= Ctor.toExpNeg || e >= Ctor.toExpPos);
  };

  // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


  /*
   *  add                 P.minus, P.plus
   *  checkInt32          P.todp, P.toExponential, P.toFixed, P.toPrecision, P.tosd
   *  digitsToString      P.log, P.sqrt, P.pow, toString, exp, ln
   *  divide              P.div, P.idiv, P.log, P.mod, P.sqrt, exp, ln
   *  exp                 P.exp, P.pow
   *  getBase10Exponent   P.exponent, P.sd, P.toint, P.sqrt, P.todp, P.toFixed, P.toPrecision,
   *                      P.toString, divide, round, toString, exp, ln
   *  getLn10             P.log, ln
   *  getZeroString       digitsToString, toString
   *  ln                  P.log, P.ln, P.pow, exp
   *  parseDecimal        Decimal
   *  round               P.abs, P.idiv, P.log, P.minus, P.mod, P.neg, P.plus, P.toint, P.sqrt,
   *                      P.times, P.todp, P.toExponential, P.toFixed, P.pow, P.toPrecision, P.tosd,
   *                      divide, getLn10, exp, ln
   *  subtract            P.minus, P.plus
   *  toString            P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf
   *  truncate            P.pow
   *
   *  Throws:             P.log, P.mod, P.sd, P.sqrt, P.pow,  checkInt32, divide, round,
   *                      getLn10, exp, ln, parseDecimal, Decimal, config
   */

  function add(x, y) {
    var carry,
        d,
        e,
        i,
        k,
        len,
        xd,
        yd,
        Ctor = x.constructor,
        pr = Ctor.precision;

    // If either is zero...
    if (!x.s || !y.s) {

      // Return x if y is zero.
      // Return y if y is non-zero.
      if (!y.s) y = new Ctor(x);
      return external ? round(y, pr) : y;
    }

    xd = x.d;
    yd = y.d;

    // x and y are finite, non-zero numbers with the same sign.

    k = x.e;
    e = y.e;
    xd = xd.slice();
    i = k - e;

    // If base 1e7 exponents differ...
    if (i) {
      if (i < 0) {
        d = xd;
        i = -i;
        len = yd.length;
      } else {
        d = yd;
        e = k;
        len = xd.length;
      }

      // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
      k = Math.ceil(pr / LOG_BASE);
      len = k > len ? k + 1 : len + 1;

      if (i > len) {
        i = len;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
      d.reverse();
      for (; i--;) {
        d.push(0);
      }d.reverse();
    }

    len = xd.length;
    i = yd.length;

    // If yd is longer than xd, swap xd and yd so xd points to the longer array.
    if (len - i < 0) {
      i = len;
      d = yd;
      yd = xd;
      xd = d;
    }

    // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
    for (carry = 0; i;) {
      carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
      xd[i] %= BASE;
    }

    if (carry) {
      xd.unshift(carry);
      ++e;
    }

    // Remove trailing zeros.
    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    for (len = xd.length; xd[--len] == 0;) {
      xd.pop();
    }y.d = xd;
    y.e = e;

    return external ? round(y, pr) : y;
  }

  function checkInt32(i, min, max) {
    if (i !== ~~i || i < min || i > max) {
      throw Error(invalidArgument + i);
    }
  }

  function digitsToString(d) {
    var i,
        k,
        ws,
        indexOfLastWord = d.length - 1,
        str = '',
        w = d[0];

    if (indexOfLastWord > 0) {
      str += w;
      for (i = 1; i < indexOfLastWord; i++) {
        ws = d[i] + '';
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
        str += ws;
      }

      w = d[i];
      ws = w + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
    } else if (w === 0) {
      return '0';
    }

    // Remove trailing zeros of last w.
    for (; w % 10 === 0;) {
      w /= 10;
    }return str + w;
  }

  var divide = function () {

    // Assumes non-zero x and k, and hence non-zero result.
    function multiplyInteger(x, k) {
      var temp,
          carry = 0,
          i = x.length;

      for (x = x.slice(); i--;) {
        temp = x[i] * k + carry;
        x[i] = temp % BASE | 0;
        carry = temp / BASE | 0;
      }

      if (carry) x.unshift(carry);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, r;

      if (aL != bL) {
        r = aL > bL ? 1 : -1;
      } else {
        for (i = r = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            r = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return r;
    }

    function subtract(a, b, aL) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * BASE + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1;) {
        a.shift();
      }
    }

    return function (x, y, pr, dp) {
      var cmp,
          e,
          i,
          k,
          prod,
          prodL,
          q,
          qd,
          rem,
          remL,
          rem0,
          sd,
          t,
          xi,
          xL,
          yd0,
          yL,
          yz,
          Ctor = x.constructor,
          sign = x.s == y.s ? 1 : -1,
          xd = x.d,
          yd = y.d;

      // Either 0?
      if (!x.s) return new Ctor(x);
      if (!y.s) throw Error(decimalError + 'Division by zero');

      e = x.e - y.e;
      yL = yd.length;
      xL = xd.length;
      q = new Ctor(sign);
      qd = q.d = [];

      // Result exponent may be one less than e.
      for (i = 0; yd[i] == (xd[i] || 0);) {
        ++i;
      }if (yd[i] > (xd[i] || 0)) --e;

      if (pr == null) {
        sd = pr = Ctor.precision;
      } else if (dp) {
        sd = pr + (getBase10Exponent(x) - getBase10Exponent(y)) + 1;
      } else {
        sd = pr;
      }

      if (sd < 0) return new Ctor(0);

      // Convert precision in number of base 10 digits to base 1e7 digits.
      sd = sd / LOG_BASE + 2 | 0;
      i = 0;

      // divisor < 1e7
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;

        // k is the carry.
        for (; (i < xL || k) && sd--; i++) {
          t = k * BASE + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }

        // divisor >= 1e7
      } else {

        // Normalise xd and yd so highest order digit of yd is >= BASE/2
        k = BASE / (yd[0] + 1) | 0;

        if (k > 1) {
          yd = multiplyInteger(yd, k);
          xd = multiplyInteger(xd, k);
          yL = yd.length;
          xL = xd.length;
        }

        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL;) {
          rem[remL++] = 0;
        }yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];

        if (yd[1] >= BASE / 2) ++yd0;

        do {
          k = 0;

          // Compare divisor and remainder.
          cmp = compare(yd, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, k.
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * BASE + (rem[1] || 0);

            // k will be how many times the divisor goes into the current remainder.
            k = rem0 / yd0 | 0;

            //  Algorithm:
            //  1. product = divisor * trial digit (k)
            //  2. if product > remainder: product -= divisor, k--
            //  3. remainder -= product
            //  4. if product was < remainder at 2:
            //    5. compare new remainder and divisor
            //    6. If remainder > divisor: remainder -= divisor, k++

            if (k > 1) {
              if (k >= BASE) k = BASE - 1;

              // product = divisor * trial digit.
              prod = multiplyInteger(yd, k);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              cmp = compare(prod, rem, prodL, remL);

              // product > remainder.
              if (cmp == 1) {
                k--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yd, prodL);
              }
            } else {

              // cmp is -1.
              // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
              // to avoid it. If k is 1 there is a need to compare yd and rem again below.
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }

            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);

            // Subtract product from remainder.
            subtract(rem, prod, remL);

            // If product was < previous remainder.
            if (cmp == -1) {
              remL = rem.length;

              // Compare divisor and new remainder.
              cmp = compare(yd, rem, yL, remL);

              // If divisor < new remainder, subtract divisor from remainder.
              if (cmp < 1) {
                k++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yd, remL);
              }
            }

            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          } // if cmp === 1, k will be 0

          // Add the next digit, k, to the result array.
          qd[i++] = k;

          // Update the remainder.
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
      }

      // Leading zero?
      if (!qd[0]) qd.shift();

      q.e = e;

      return round(q, dp ? pr + getBase10Exponent(q) + 1 : pr);
    };
  }();

  /*
   * Return a new Decimal whose value is the natural exponential of `x` truncated to `sd`
   * significant digits.
   *
   * Taylor/Maclaurin series.
   *
   * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
   *
   * Argument reduction:
   *   Repeat x = x / 32, k += 5, until |x| < 0.1
   *   exp(x) = exp(x / 2^k)^(2^k)
   *
   * Previously, the argument was initially reduced by
   * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
   * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
   * found to be slower than just dividing repeatedly by 32 as above.
   *
   * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
   *
   *  exp(x) is non-terminating for any finite, non-zero x.
   *
   */
  function exp(x, sd) {
    var denominator,
        guard,
        pow,
        sum,
        t,
        wpr,
        i = 0,
        k = 0,
        Ctor = x.constructor,
        pr = Ctor.precision;

    if (getBase10Exponent(x) > 16) throw Error(exponentOutOfRange + getBase10Exponent(x));

    // exp(0) = 1
    if (!x.s) return new Ctor(ONE);

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    t = new Ctor(0.03125);

    while (x.abs().gte(0.1)) {
      x = x.times(t); // x = x / 2^5
      k += 5;
    }

    // Estimate the precision increase necessary to ensure the first 4 rounding digits are correct.
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow = sum = new Ctor(ONE);
    Ctor.precision = wpr;

    for (;;) {
      pow = round(pow.times(x), wpr);
      denominator = denominator.times(++i);
      t = sum.plus(divide(pow, denominator, wpr));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        while (k--) {
          sum = round(sum.times(sum), wpr);
        }Ctor.precision = pr;
        return sd == null ? (external = true, round(sum, pr)) : sum;
      }

      sum = t;
    }
  }

  // Calculate the base 10 exponent from the base 1e7 exponent.
  function getBase10Exponent(x) {
    var e = x.e * LOG_BASE,
        w = x.d[0];

    // Add the number of digits of the first word of the digits array.
    for (; w >= 10; w /= 10) {
      e++;
    }return e;
  }

  function getLn10(Ctor, sd, pr) {

    if (sd > Ctor.LN10.sd()) {

      // Reset global state in case the exception is caught.
      external = true;
      if (pr) Ctor.precision = pr;
      throw Error(decimalError + 'LN10 precision limit exceeded');
    }

    return round(new Ctor(Ctor.LN10), sd);
  }

  function getZeroString(k) {
    var zs = '';
    for (; k--;) {
      zs += '0';
    }return zs;
  }

  /*
   * Return a new Decimal whose value is the natural logarithm of `x` truncated to `sd` significant
   * digits.
   *
   *  ln(n) is non-terminating (n != 1)
   *
   */
  function ln(y, sd) {
    var c,
        c0,
        denominator,
        e,
        numerator,
        sum,
        t,
        wpr,
        x2,
        n = 1,
        guard = 10,
        x = y,
        xd = x.d,
        Ctor = x.constructor,
        pr = Ctor.precision;

    // ln(-x) = NaN
    // ln(0) = -Infinity
    if (x.s < 1) throw Error(decimalError + (x.s ? 'NaN' : '-Infinity'));

    // ln(1) = 0
    if (x.eq(ONE)) return new Ctor(0);

    if (sd == null) {
      external = false;
      wpr = pr;
    } else {
      wpr = sd;
    }

    if (x.eq(10)) {
      if (sd == null) external = true;
      return getLn10(Ctor, wpr);
    }

    wpr += guard;
    Ctor.precision = wpr;
    c = digitsToString(xd);
    c0 = c.charAt(0);
    e = getBase10Exponent(x);

    if (Math.abs(e) < 1.5e15) {

      // Argument reduction.
      // The series converges faster the closer the argument is to 1, so using
      // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
      // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
      // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
      // later be divided by this number, then separate out the power of 10 using
      // ln(a*10^b) = ln(a) + b*ln(10).

      // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
      //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
      // max n is 6 (gives 0.7 - 1.3)
      while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
        x = x.times(y);
        c = digitsToString(x.d);
        c0 = c.charAt(0);
        n++;
      }

      e = getBase10Exponent(x);

      if (c0 > 1) {
        x = new Ctor('0.' + c);
        e++;
      } else {
        x = new Ctor(c0 + '.' + c.slice(1));
      }
    } else {

      // The argument reduction method above may result in overflow if the argument y is a massive
      // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
      // function using ln(x*10^e) = ln(x) + e*ln(10).
      t = getLn10(Ctor, wpr + 2, pr).times(e + '');
      x = ln(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);

      Ctor.precision = pr;
      return sd == null ? (external = true, round(x, pr)) : x;
    }

    // x is reduced to a value near 1.

    // Taylor series.
    // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
    // where x = (y - 1)/(y + 1)    (|x| < 1)
    sum = numerator = x = divide(x.minus(ONE), x.plus(ONE), wpr);
    x2 = round(x.times(x), wpr);
    denominator = 3;

    for (;;) {
      numerator = round(numerator.times(x2), wpr);
      t = sum.plus(divide(numerator, new Ctor(denominator), wpr));

      if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
        sum = sum.times(2);

        // Reverse the argument reduction.
        if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
        sum = divide(sum, new Ctor(n), wpr);

        Ctor.precision = pr;
        return sd == null ? (external = true, round(sum, pr)) : sum;
      }

      sum = t;
      denominator += 2;
    }
  }

  /*
   * Parse the value of a new Decimal `x` from string `str`.
   */
  function parseDecimal(x, str) {
    var e, i, len;

    // Decimal point?
    if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

    // Exponential form?
    if ((i = str.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +str.slice(i + 1);
      str = str.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48;) {
      ++i;
    } // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(len - 1) === 48;) {
      --len;
    }str = str.slice(i, len);

    if (str) {
      len -= i;
      e = e - i - 1;
      x.e = mathfloor(e / LOG_BASE);
      x.d = [];

      // Transform base

      // e is the base 10 exponent.
      // i is where to slice str to get the first word of the digits array.
      i = (e + 1) % LOG_BASE;
      if (e < 0) i += LOG_BASE;

      if (i < len) {
        if (i) x.d.push(+str.slice(0, i));
        for (len -= LOG_BASE; i < len;) {
          x.d.push(+str.slice(i, i += LOG_BASE));
        }str = str.slice(i);
        i = LOG_BASE - str.length;
      } else {
        i -= len;
      }

      for (; i--;) {
        str += '0';
      }x.d.push(+str);

      if (external && (x.e > MAX_E || x.e < -MAX_E)) throw Error(exponentOutOfRange + e);
    } else {

      // Zero.
      x.s = 0;
      x.e = 0;
      x.d = [0];
    }

    return x;
  }

  /*
   * Round `x` to `sd` significant digits, using rounding mode `rm` if present (truncate otherwise).
   */
  function round(x, sd, rm) {
    var i,
        j,
        k,
        n,
        rd,
        doRound,
        w,
        xdi,
        xd = x.d;

    // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
    // w: the word of xd which contains the rounding digit, a base 1e7 number.
    // xdi: the index of w within xd.
    // n: the number of digits of w.
    // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
    // they had leading zeros)
    // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

    // Get the length of the first word of the digits array xd.
    for (n = 1, k = xd[0]; k >= 10; k /= 10) {
      n++;
    }i = sd - n;

    // Is the rounding digit in the first word of xd?
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) return x;
      w = k = xd[xdi];

      // Get the number of digits of w.
      for (n = 1; k >= 10; k /= 10) {
        n++;
      } // Get the index of rd within w.
      i %= LOG_BASE;

      // Get the index of rd within w, adjusted for leading zeros.
      // The number of leading zeros of w is given by LOG_BASE - n.
      j = i - LOG_BASE + n;
    }

    if (rm !== void 0) {
      k = mathpow(10, n - j - 1);

      // Get the rounding digit at index j of w.
      rd = w / k % 10 | 0;

      // Are there any non-zero digits after the rounding digit?
      doRound = sd < 0 || xd[xdi + 1] !== void 0 || w % k;

      // The expression `w % mathpow(10, n - j - 1)` returns all the digits of w to the right of the
      // digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression will give
      // 714.

      doRound = rm < 4 ? (rd || doRound) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || doRound || rm == 6 &&

      // Check whether the digit to the left of the rounding digit is odd.
      (i > 0 ? j > 0 ? w / mathpow(10, n - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
    }

    if (sd < 1 || !xd[0]) {
      if (doRound) {
        k = getBase10Exponent(x);
        xd.length = 1;

        // Convert sd to decimal places.
        sd = sd - k - 1;

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = mathfloor(-sd / LOG_BASE) || 0;
      } else {
        xd.length = 1;

        // Zero.
        xd[0] = x.e = x.s = 0;
      }

      return x;
    }

    // Remove excess digits.
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);

      // E.g. 56700 becomes 56000 if 7 is the rounding digit.
      // j > 0 means i > number of leading zeros of w.
      xd[xdi] = j > 0 ? (w / mathpow(10, n - j) % mathpow(10, j) | 0) * k : 0;
    }

    if (doRound) {
      for (;;) {

        // Is the digit to be rounded up in the first word of xd?
        if (xdi == 0) {
          if ((xd[0] += k) == BASE) {
            xd[0] = 1;
            ++x.e;
          }

          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }

    // Remove trailing zeros.
    for (i = xd.length; xd[--i] === 0;) {
      xd.pop();
    }if (external && (x.e > MAX_E || x.e < -MAX_E)) {
      throw Error(exponentOutOfRange + getBase10Exponent(x));
    }

    return x;
  }

  function subtract(x, y) {
    var d,
        e,
        i,
        j,
        k,
        len,
        xd,
        xe,
        xLTy,
        yd,
        Ctor = x.constructor,
        pr = Ctor.precision;

    // Return y negated if x is zero.
    // Return x if y is zero and x is non-zero.
    if (!x.s || !y.s) {
      if (y.s) y.s = -y.s;else y = new Ctor(x);
      return external ? round(y, pr) : y;
    }

    xd = x.d;
    yd = y.d;

    // x and y are non-zero numbers with the same sign.

    e = y.e;
    xe = x.e;
    xd = xd.slice();
    k = xe - e;

    // If exponents differ...
    if (k) {
      xLTy = k < 0;

      if (xLTy) {
        d = xd;
        k = -k;
        len = yd.length;
      } else {
        d = yd;
        e = xe;
        len = xd.length;
      }

      // Numbers with massively different exponents would result in a very high number of zeros
      // needing to be prepended, but this can be avoided while still ensuring correct rounding by
      // limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
      i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

      if (k > i) {
        k = i;
        d.length = 1;
      }

      // Prepend zeros to equalise exponents.
      d.reverse();
      for (i = k; i--;) {
        d.push(0);
      }d.reverse();

      // Base 1e7 exponents equal.
    } else {

      // Check digits to determine which is the bigger number.

      i = xd.length;
      len = yd.length;
      xLTy = i < len;
      if (xLTy) len = i;

      for (i = 0; i < len; i++) {
        if (xd[i] != yd[i]) {
          xLTy = xd[i] < yd[i];
          break;
        }
      }

      k = 0;
    }

    if (xLTy) {
      d = xd;
      xd = yd;
      yd = d;
      y.s = -y.s;
    }

    len = xd.length;

    // Append zeros to xd if shorter.
    // Don't add zeros to yd if shorter as subtraction only needs to start at yd length.
    for (i = yd.length - len; i > 0; --i) {
      xd[len++] = 0;
    } // Subtract yd from xd.
    for (i = yd.length; i > k;) {
      if (xd[--i] < yd[i]) {
        for (j = i; j && xd[--j] === 0;) {
          xd[j] = BASE - 1;
        }--xd[j];
        xd[i] += BASE;
      }

      xd[i] -= yd[i];
    }

    // Remove trailing zeros.
    for (; xd[--len] === 0;) {
      xd.pop();
    } // Remove leading zeros and adjust exponent accordingly.
    for (; xd[0] === 0; xd.shift()) {
      --e;
    } // Zero?
    if (!xd[0]) return new Ctor(0);

    y.d = xd;
    y.e = e;

    //return external && xd.length >= pr / LOG_BASE ? round(y, pr) : y;
    return external ? round(y, pr) : y;
  }

  function toString(x, isExp, sd) {
    var k,
        e = getBase10Exponent(x),
        str = digitsToString(x.d),
        len = str.length;

    if (isExp) {
      if (sd && (k = sd - len) > 0) {
        str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
      } else if (len > 1) {
        str = str.charAt(0) + '.' + str.slice(1);
      }

      str = str + (e < 0 ? 'e' : 'e+') + e;
    } else if (e < 0) {
      str = '0.' + getZeroString(-e - 1) + str;
      if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
      str += getZeroString(e + 1 - len);
      if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
    } else {
      if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
      if (sd && (k = sd - len) > 0) {
        if (e + 1 === len) str += '.';
        str += getZeroString(k);
      }
    }

    return x.s < 0 ? '-' + str : str;
  }

  // Does not strip trailing zeros.
  function truncate(arr, len) {
    if (arr.length > len) {
      arr.length = len;
      return true;
    }
  }

  // Decimal methods


  /*
   *  clone
   *  config/set
   */

  /*
   * Create and return a Decimal constructor with the same configuration properties as this Decimal
   * constructor.
   *
   */
  function clone(obj) {
    var i, p, ps;

    /*
     * The Decimal constructor and exported function.
     * Return a new Decimal instance.
     *
     * value {number|string|Decimal} A numeric value.
     *
     */
    function Decimal(value) {
      var x = this;

      // Decimal called without new.
      if (!(x instanceof Decimal)) return new Decimal(value);

      // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
      // which points to Object.
      x.constructor = Decimal;

      // Duplicate.
      if (value instanceof Decimal) {
        x.s = value.s;
        x.e = value.e;
        x.d = (value = value.d) ? value.slice() : value;
        return;
      }

      if (typeof value === 'number') {

        // Reject Infinity/NaN.
        if (value * 0 !== 0) {
          throw Error(invalidArgument + value);
        }

        if (value > 0) {
          x.s = 1;
        } else if (value < 0) {
          value = -value;
          x.s = -1;
        } else {
          x.s = 0;
          x.e = 0;
          x.d = [0];
          return;
        }

        // Fast path for small integers.
        if (value === ~~value && value < 1e7) {
          x.e = 0;
          x.d = [value];
          return;
        }

        return parseDecimal(x, value.toString());
      } else if (typeof value !== 'string') {
        throw Error(invalidArgument + value);
      }

      // Minus sign?
      if (value.charCodeAt(0) === 45) {
        value = value.slice(1);
        x.s = -1;
      } else {
        x.s = 1;
      }

      if (isDecimal.test(value)) parseDecimal(x, value);else throw Error(invalidArgument + value);
    }

    Decimal.prototype = P;

    Decimal.ROUND_UP = 0;
    Decimal.ROUND_DOWN = 1;
    Decimal.ROUND_CEIL = 2;
    Decimal.ROUND_FLOOR = 3;
    Decimal.ROUND_HALF_UP = 4;
    Decimal.ROUND_HALF_DOWN = 5;
    Decimal.ROUND_HALF_EVEN = 6;
    Decimal.ROUND_HALF_CEIL = 7;
    Decimal.ROUND_HALF_FLOOR = 8;

    Decimal.clone = clone;
    Decimal.config = Decimal.set = config;

    if (obj === void 0) obj = {};
    if (obj) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'];
      for (i = 0; i < ps.length;) {
        if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
      }
    }

    Decimal.config(obj);

    return Decimal;
  }

  /*
   * Configure global settings for a Decimal constructor.
   *
   * `obj` is an object with one or more of the following properties,
   *
   *   precision  {number}
   *   rounding   {number}
   *   toExpNeg   {number}
   *   toExpPos   {number}
   *
   * E.g. Decimal.config({ precision: 20, rounding: 4 })
   *
   */
  function config(obj) {
    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
      throw Error(decimalError + 'Object expected');
    }
    var i,
        p,
        v,
        ps = ['precision', 1, MAX_DIGITS, 'rounding', 0, 8, 'toExpNeg', -1 / 0, 0, 'toExpPos', 0, 1 / 0];

    for (i = 0; i < ps.length; i += 3) {
      if ((v = obj[p = ps[i]]) !== void 0) {
        if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;else throw Error(invalidArgument + p + ': ' + v);
      }
    }

    if ((v = obj[p = 'LN10']) !== void 0) {
      if (v == Math.LN10) this[p] = new this(v);else throw Error(invalidArgument + p + ': ' + v);
    }

    return this;
  }

  // Create and configure initial Decimal constructor.
  Decimal = clone(Decimal);

  Decimal['default'] = Decimal.Decimal = Decimal;

  // Internal constant.
  ONE = new Decimal(1);

  // Export.


  // AMD.
  if (typeof define == 'function' && define.amd) {
    define(function () {
      return Decimal;
    });

    // Node and other environments that support module.exports.
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Decimal;

    // Browser.
  } else {
    if (!globalScope) {
      globalScope = typeof self != 'undefined' && self && self.self == self ? self : Function('return this')();
    }

    globalScope.Decimal = Decimal;
  }
})(undefined);

},{}],8:[function(require,module,exports){
/*!
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Flagrate = undefined;

var _util = require("./flagrate/util");

var util = _interopRequireWildcard(_util);

var _element = require("./flagrate/element");

var element = _interopRequireWildcard(_element);

var _button = require("./flagrate/button");

var button = _interopRequireWildcard(_button);

var _buttons = require("./flagrate/buttons");

var buttons = _interopRequireWildcard(_buttons);

var _menu = require("./flagrate/menu");

var menu = _interopRequireWildcard(_menu);

var _pulldown = require("./flagrate/pulldown");

var pulldown = _interopRequireWildcard(_pulldown);

var _textInput = require("./flagrate/text-input");

var textInput = _interopRequireWildcard(_textInput);

var _tokenizer = require("./flagrate/tokenizer");

var tokenizer = _interopRequireWildcard(_tokenizer);

var _textArea = require("./flagrate/text-area");

var textArea = _interopRequireWildcard(_textArea);

var _comboBox = require("./flagrate/combo-box");

var comboBox = _interopRequireWildcard(_comboBox);

var _select = require("./flagrate/select");

var select = _interopRequireWildcard(_select);

var _contextMenu = require("./flagrate/context-menu");

var contextMenu = _interopRequireWildcard(_contextMenu);

var _toolbar = require("./flagrate/toolbar");

var toolbar = _interopRequireWildcard(_toolbar);

var _searchBox = require("./flagrate/search-box");

var searchBox = _interopRequireWildcard(_searchBox);

var _checkbox = require("./flagrate/checkbox");

var checkbox = _interopRequireWildcard(_checkbox);

var _checkboxes = require("./flagrate/checkboxes");

var checkboxes = _interopRequireWildcard(_checkboxes);

var _radio = require("./flagrate/radio");

var radio = _interopRequireWildcard(_radio);

var _radios = require("./flagrate/radios");

var radios = _interopRequireWildcard(_radios);

var _switch = require("./flagrate/switch");

var sw = _interopRequireWildcard(_switch);

var _progress = require("./flagrate/progress");

var progress = _interopRequireWildcard(_progress);

var _slider = require("./flagrate/slider");

var slider = _interopRequireWildcard(_slider);

var _tab = require("./flagrate/tab");

var tab = _interopRequireWildcard(_tab);

var _popover = require("./flagrate/popover");

var popover = _interopRequireWildcard(_popover);

var _tutorial = require("./flagrate/tutorial");

var tutorial = _interopRequireWildcard(_tutorial);

var _notify = require("./flagrate/notify");

var notify = _interopRequireWildcard(_notify);

var _modal = require("./flagrate/modal");

var modal = _interopRequireWildcard(_modal);

var _grid = require("./flagrate/grid");

var grid = _interopRequireWildcard(_grid);

var _form = require("./flagrate/form");

var form = _interopRequireWildcard(_form);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Flagrate = exports.Flagrate = undefined;
(function (Flagrate) {
   Flagrate.identity = util.identity;
   Flagrate.extendObject = util.extendObject;
   Flagrate.emptyFunction = util.emptyFunction;
   Flagrate.jsonPointer = util.jsonPointer;
   Flagrate.Element = element.Element;
   Flagrate.createElement = element.createElement;
   Flagrate.Button = button.Button;
   Flagrate.createButton = button.createButton;
   Flagrate.Buttons = buttons.Buttons;
   Flagrate.createButtons = buttons.createButtons;
   Flagrate.Menu = menu.Menu;
   Flagrate.createMenu = menu.createMenu;
   Flagrate.Pulldown = pulldown.Pulldown;
   Flagrate.createPulldown = pulldown.createPulldown;
   Flagrate.TextInput = textInput.TextInput;
   Flagrate.createTextInput = textInput.createTextInput;
   Flagrate.Tokenizer = tokenizer.Tokenizer;
   Flagrate.createTokenizer = tokenizer.createTokenizer;
   Flagrate.TextArea = textArea.TextArea;
   Flagrate.createTextArea = textArea.createTextArea;
   Flagrate.ComboBox = comboBox.ComboBox;
   Flagrate.createComboBox = comboBox.createComboBox;
   Flagrate.Select = select.Select;
   Flagrate.createSelect = select.createSelect;
   Flagrate.ContextMenu = contextMenu.ContextMenu;
   Flagrate.createContextMenu = contextMenu.createContextMenu;
   Flagrate.Toolbar = toolbar.Toolbar;
   Flagrate.createToolbar = toolbar.createToolbar;
   Flagrate.SearchBox = searchBox.SearchBox;
   Flagrate.createSearchBox = searchBox.createSearchBox;
   Flagrate.Checkbox = checkbox.Checkbox;
   Flagrate.createCheckbox = checkbox.createCheckbox;
   Flagrate.Checkboxes = checkboxes.Checkboxes;
   Flagrate.createCheckboxes = checkboxes.createCheckboxes;
   Flagrate.Radio = radio.Radio;
   Flagrate.createRadio = radio.createRadio;
   Flagrate.Radios = radios.Radios;
   Flagrate.createRadios = radios.createRadios;
   Flagrate.Switch = sw.Switch;
   Flagrate.createSwitch = sw.createSwitch;
   Flagrate.Progress = progress.Progress;
   Flagrate.createProgress = progress.createProgress;
   Flagrate.Slider = slider.Slider;
   Flagrate.createSlider = slider.createSlider;
   Flagrate.Tab = tab.Tab;
   Flagrate.createTab = tab.createTab;
   Flagrate.Popover = popover.Popover;
   Flagrate.createPopover = popover.createPopover;
   Flagrate.Tutorial = tutorial.Tutorial;
   Flagrate.createTutorial = tutorial.createTutorial;
   Flagrate.Notify = notify.Notify;
   Flagrate.createNotify = notify.createNotify;
   Flagrate.Modal = modal.Modal;
   Flagrate.createModal = modal.createModal;
   Flagrate.Grid = grid.Grid;
   Flagrate.createGrid = grid.createGrid;
   Flagrate.Form = form.Form;
   Flagrate.createForm = form.createForm;
})(Flagrate || (exports.Flagrate = Flagrate = {}));
if (window.flagrate === undefined) {
   window.flagrate = Flagrate;
}
exports.default = Flagrate;



},{"./flagrate/button":9,"./flagrate/buttons":10,"./flagrate/checkbox":11,"./flagrate/checkboxes":12,"./flagrate/combo-box":13,"./flagrate/context-menu":14,"./flagrate/element":15,"./flagrate/form":16,"./flagrate/grid":17,"./flagrate/menu":18,"./flagrate/modal":19,"./flagrate/notify":20,"./flagrate/popover":21,"./flagrate/progress":22,"./flagrate/pulldown":23,"./flagrate/radio":24,"./flagrate/radios":25,"./flagrate/search-box":26,"./flagrate/select":27,"./flagrate/slider":28,"./flagrate/switch":29,"./flagrate/tab":30,"./flagrate/text-area":31,"./flagrate/text-input":32,"./flagrate/tokenizer":33,"./flagrate/toolbar":34,"./flagrate/tutorial":35,"./flagrate/util":36}],9:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = undefined;
exports.createButton = createButton;

var _util = require("./util");

var _element = require("./element");

/*?
    flagrate.createButton(option)
    new flagrate.Button(option)
    - option (Object) - options.

    Button.

    #### option

    * `id`                       (String): `id` attribute of `button` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `color`                    (String): (using flagrate.Button#setColor)
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `isFocused`                (Boolean; default `false`):
    * `isDisabled`               (Boolean; default `false`):
    * `isRemovableByUser`        (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onRemove`                 (Function):
**/
function FButton() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    option.isRemovableByUser = option.isRemovableByUser || false;
    this.onSelect = option.onSelect || _util.emptyFunction;
    this.onRemove = option.onRemove || _util.emptyFunction;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    if (option.isFocused) {
        attr["autofocus"] = true;
    }
    if (!attr["type"]) {
        attr["type"] = "button";
    }
    // create a button element
    var button = new _element.Element("button", attr);
    (0, _util.extendObject)(button, this);
    button.labelElement = new _element.Element("span").insertTo(button);
    if (option.label) {
        button.labelElement.insertText(option.label);
    } else if (option.labelHTML) {
        button.labelElement.insert(option.labelHTML);
    }
    button.addClassName("flagrate flagrate-button");
    if (option.className) {
        button.addClassName(option.className);
    }
    button.addEventListener("click", button._onSelectHandler.bind(button), true);
    if (option.isRemovableByUser) {
        button.addClassName("flagrate-button-removable");
        button._removeButton = new _element.Element("button", {
            type: "button",
            class: "flagrate-button-remove"
        }).insertTo(button);
        button._removeButton.addEventListener("click", button._onRemoveHandler.bind(button), true);
    }
    if (option.style) {
        button.setStyle(option.style);
    }
    if (option.color) {
        button.setColor(option.color);
    }
    if (option.icon) {
        button.setIcon(option.icon);
    }
    if (option.isDisabled) {
        button.disable();
    }
    return button;
}
var Button = exports.Button = FButton;
function createButton(option) {
    return new Button(option);
}
Button.prototype = {
    select: function select() {
        return this._onSelectHandler(null);
    },
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this.writeAttribute("disabled", true);
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this.writeAttribute("disabled", false);
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    setLabel: function setLabel(text) {
        this.labelElement.updateText(text);
        return this;
    },
    setLabelHTML: function setLabelHTML(html) {
        this.labelElement.update(html);
        return this;
    },
    setColor: function setColor(color) {
        var button = this;
        if (color.charAt(0) === "@") {
            button.style.backgroundColor = "";
            button.style.color = "";
            button.addClassName("flagrate-button-color-" + color.slice(1));
        } else {
            button.style.backgroundColor = color;
            if (/^#[0-9a-f]{6}$/i.test(color) === true) {
                var c = parseInt(color.slice(1), 16);
                if (((c >> 16) + (c >> 8 & 0xff) + (c & 0xff)) / 3 > 150) {
                    button.style.color = "black";
                } else {
                    button.style.color = "white";
                }
            } else {
                button.style.color = "";
            }
        }
        button._color = color;
        return button;
    },
    getColor: function getColor() {
        return this._color || "";
    },
    setIcon: function setIcon(identifier) {
        var button = this;
        button._iconIdentifier = identifier;
        if (identifier) {
            return button.addClassName("flagrate-icon").setStyle({
                backgroundImage: "url(" + identifier + ")"
            });
        } else {
            return button.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
    },
    getIcon: function getIcon() {
        return this._iconIdentifier || "";
    },
    _onSelectHandler: function _onSelectHandler(e) {
        var button = this;
        if (button.isEnabled() === false) {
            return;
        }
        // for Firefox <- until when..?
        if (button._removeButton && e && e.layerX) {
            var bw = button.getWidth();
            var bh = button.getHeight();
            var bp = button._removeButton.getStyle("margin-right") === null ? 0 : parseInt(button._removeButton.getStyle("margin-right").replace("px", ""), 10);
            var rw = button._removeButton.getWidth();
            var rh = button._removeButton.getHeight();
            var lx = e.layerX;
            var ly = e.layerY;
            var isHitRemoveButton = lx > bw - bp - rw && lx < bw - bp && ly > bh - (bh - rh) / 2 - rh && ly < bh - (bh - rh) / 2;
            if (isHitRemoveButton) {
                button._onRemoveHandler(e);
                return button;
            }
        }
        var _e = e;
        _e.targetButton = button;
        button.onSelect(_e, button);
        button.fire("select", { targetButton: button });
    },
    _onRemoveHandler: function _onRemoveHandler(e) {
        var button = this;
        if (button.isEnabled() === true) {
            button.remove();
            var _e = e;
            _e.targetButton = button;
            button.onRemove(_e, button);
            button.fire("remove", { targetButton: button });
        }
    }
};



},{"./element":15,"./util":36}],10:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buttons = undefined;
exports.createButtons = createButtons;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var button = _interopRequireWildcard(_button);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*?
    flagrate.createButtons(option)
    new flagrate.Buttons(option)
    - option (Object) - options.

    Button group.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `items`                    (Array): of item
    * `onSelect`                 (Function):

    #### item

    * `key`                      (String):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `color`                    (String):
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
**/
function FButtons() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    option.items = option.items || [];
    this.onSelect = option.onSelect || _util.emptyFunction;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    // create a container
    var container = new _element.Element("div", attr);
    (0, _util.extendObject)(container, this);
    container.addClassName("flagrate flagrate-buttons");
    if (option.className) {
        container.addClassName(option.className);
    }
    if (option.style) {
        container.setStyle(option.style);
    }
    for (var i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }
    container.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    return container;
}
var Buttons = exports.Buttons = FButtons;
function createButtons(option) {
    return new Buttons(option);
}
Buttons.prototype = {
    push: function push(option) {
        var _this = this;

        var _onSelect = option.onSelect;
        option.onSelect = function (e, button) {
            if (_onSelect) {
                _onSelect.call(button, e, button);
            }
            _this.onSelect(e, _this);
        };
        var btn = new button.Button(option).insertTo(this);
        if (option.key) {
            btn.dataset["_key"] = option.key;
        }
        return this;
    },
    getButtonByKey: function getButtonByKey(key) {
        var elements = this.childNodes;
        for (var i = 0, l = elements.length; i < l; i++) {
            if (elements[i].dataset["_key"] === key) {
                return elements[i];
            }
        }
        return null;
    },
    getButtons: function getButtons() {
        return this.childNodes || [];
    }
};



},{"./button":9,"./element":15,"./util":36}],11:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Checkbox = undefined;
exports.createCheckbox = createCheckbox;

var _util = require("./util");

var _element = require("./element");

var idCounter = 0;
/*?
    flagrate.createCheckbox(option)
    new flagrate.Checkbox(option)
    - option (Object) - options.
**/
function FCheckbox() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var id = "flagrate-checkbox-" + (++idCounter).toString(10);
    var attr = opt.attribute || {};
    attr["id"] = opt.id || null;
    attr["class"] = opt.className || null;
    //create
    var checkbox = new _element.Element("label", attr);
    checkbox.writeAttribute("for", id);
    (0, _util.extendObject)(checkbox, this);
    if (opt.label) {
        checkbox.insertText(opt.label);
    } else if (opt.labelHTML) {
        checkbox.insert(opt.labelHTML);
    }
    checkbox.addClassName("flagrate flagrate-checkbox");
    if (opt.icon) {
        checkbox.addClassName("flagrate-icon");
        checkbox.setStyle({
            backgroundImage: "url(" + opt.icon + ")"
        });
    }
    checkbox.onChange = opt.onChange || null;
    checkbox.onCheck = opt.onCheck || null;
    checkbox.onUncheck = opt.onUncheck || null;
    checkbox._input = new _element.Element("input", { id: id, type: "checkbox" });
    checkbox.insert({ top: new _element.Element() });
    checkbox.insert({ top: checkbox._input });
    checkbox._input.addEventListener("change", function (e) {
        e.stopPropagation();
        var _e = e;
        _e.targetCheckbox = checkbox;
        if (checkbox.isChecked() === true) {
            if (checkbox.onCheck) {
                checkbox.onCheck(_e, checkbox);
            }
            checkbox.fire("check", { targetCheckbox: checkbox });
        } else {
            if (checkbox.onUncheck) {
                checkbox.onUncheck(_e, checkbox);
            }
            checkbox.fire("uncheck", { targetCheckbox: checkbox });
        }
        if (checkbox.onChange) {
            checkbox.onChange(_e, checkbox);
        }
        checkbox.fire("change", { targetCheckbox: checkbox });
    });
    if (opt.isChecked === true) {
        checkbox.check();
    }
    if (opt.isFocused === true) {
        checkbox.focus();
    }
    if (opt.isDisabled === true) {
        checkbox.disable();
    }
    return checkbox;
}
var Checkbox = exports.Checkbox = FCheckbox;
function createCheckbox(option) {
    return new Checkbox(option);
}
Checkbox.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", true);
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", false);
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    isChecked: function isChecked() {
        return !!this._input.checked;
    },
    check: function check() {
        this._input.checked = true;
        return this;
    },
    uncheck: function uncheck() {
        this._input.checked = false;
        return this;
    }
};



},{"./element":15,"./util":36}],12:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Checkboxes = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createCheckboxes = createCheckboxes;

var _util = require("./util");

var _element = require("./element");

var _checkbox = require("./checkbox");

/*?
    flagrate.createCheckboxes(option)
    new flagrate.Checkboxes(option)
    - option (Object) - options.
**/
function FCheckboxes() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var attr = opt.attribute || {};
    if (opt.id) {
        attr["id"] = opt.id;
    }
    //create
    var checkboxes = new _element.Element("div", attr);
    (0, _util.extendObject)(checkboxes, this);
    checkboxes.addClassName("flagrate flagrate-checkboxes");
    if (opt.className) {
        checkboxes.addClassName(opt.className);
    }
    if (opt.style) {
        checkboxes.setStyle(opt.style);
    }
    checkboxes.onChange = opt.onChange;
    checkboxes._items = [];
    (opt.items || []).forEach(function (item) {
        var _item = {};
        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
            (0, _util.extendObject)(_item, item);
        } else {
            _item.label = typeof item === "string" ? item : item.toString();
            _item.value = item;
        }
        _item._checkbox = new _checkbox.Checkbox(_item).insertTo(checkboxes);
        _item._checkbox.addEventListener("change", function (e) {
            if (checkboxes.onChange) {
                checkboxes.onChange(e, checkboxes);
            }
        });
        checkboxes._items.push(_item);
    });
    if (opt.isDisabled) {
        checkboxes.disable();
    }
    if (opt.values) {
        checkboxes.setValues(opt.values);
    }
    return checkboxes;
}
var Checkboxes = exports.Checkboxes = FCheckboxes;
function createCheckboxes(option) {
    return new Checkboxes(option);
}
Checkboxes.prototype = {
    select: function select(index) {
        if (this._items[index]) {
            this._items[index]._checkbox.check();
        }
        return this;
    },
    deselect: function deselect(index) {
        if (this._items[index]) {
            this._items[index]._checkbox.uncheck();
        }
        return this;
    },
    getValues: function getValues() {
        var values = [];
        for (var i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i]._checkbox.isChecked() === true) {
                values.push(this._items[i].value);
            }
        }
        return values;
    },
    addValue: function addValue(value) {
        for (var i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i].value === value) {
                this.select(i);
                break;
            }
        }
        return this;
    },
    removeValue: function removeValue(value) {
        for (var i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i].value === value) {
                this.deselect(i);
                break;
            }
        }
        return this;
    },
    setValues: function setValues(values) {
        for (var i = 0, l = this._items.length; i < l; i++) {
            if (values.indexOf(this._items[i].value) === -1) {
                this.deselect(i);
            } else {
                this.select(i);
            }
        }
        return this;
    },
    selectAll: function selectAll() {
        for (var i = 0, l = this._items.length; i < l; i++) {
            this.select(i);
        }
        return this;
    },
    deselectAll: function deselectAll() {
        return this.setValues([]);
    },
    enable: function enable() {
        for (var i = 0, l = this._items.length; i < l; i++) {
            this._items[i]._checkbox.enable();
        }
        this.removeClassName("flagrate-disabled");
        return this;
    },
    disable: function disable() {
        for (var i = 0, l = this._items.length; i < l; i++) {
            this._items[i]._checkbox.disable();
        }
        this.addClassName("flagrate-disabled");
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    }
};



},{"./checkbox":11,"./element":15,"./util":36}],13:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ComboBox = undefined;
exports.createComboBox = createComboBox;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var _menu = require("./menu");

var _textInput = require("./text-input");

/*?
    flagrate.createComboBox(option)
    new flagrate.ComboBox(option)
    - option (Object) - options.

    Select.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String): default value.
    * `items`                    (Array): of String values.
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FComboBox() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.items = option.items || [];
    this.regexp = option.regexp || null;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    //create
    var container = new _element.Element("div", attr);
    container._textinput = new _textInput.TextInput({
        value: option.value,
        placeholder: option.placeholder,
        icon: option.icon
    }).insertTo(container);
    function createOnSelectHandler(value) {
        return function () {
            container.setValue(value);
            container._textinput.focus();
            container.fire("change");
        };
    }
    container._button = new _button.Button({
        onSelect: function onSelect() {
            if (container._menu) {
                container._menu.remove();
                delete container._menu;
                return;
            }
            var items = [];
            for (var i = 0, l = container.items.length; i < l; i++) {
                items.push({
                    label: container.items[i],
                    onSelect: createOnSelectHandler(container.items[i])
                });
            }
            var menu = container._menu = new _menu.Menu({
                className: "flagrate-combobox-menu",
                items: items,
                onSelect: function onSelect() {
                    menu.remove();
                    delete container._menu;
                }
            }).insertTo(container);
            // To prevent overflow.
            var menuHeight = menu.getHeight();
            var menuMargin = parseInt(menu.getStyle("margin-top").replace("px", ""), 10);
            var cummOffsetTop = container.cumulativeOffset().top;
            var upsideSpace = -window.pageYOffset + cummOffsetTop;
            var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - container.getHeight();
            if (menuHeight + menuMargin > downsideSpace) {
                if (upsideSpace > downsideSpace) {
                    if (upsideSpace < menuHeight + menuMargin) {
                        menuHeight = upsideSpace - menuMargin - menuMargin;
                        menu.style.maxHeight = menuHeight + "px";
                    }
                    menu.addClassName("flagrate-combobox-menu-upper");
                } else {
                    menuHeight = downsideSpace - menuMargin - menuMargin;
                    menu.style.maxHeight = menuHeight + "px";
                }
            }
            function removeMenu(e) {
                document.body.removeEventListener("click", removeMenu);
                container.parentNode.removeEventListener("click", removeMenu);
                container.off("click", removeMenu);
                menu.style.opacity = "0";
                setTimeout(function () {
                    return menu.remove();
                }, 500);
                delete container._menu;
            }
            setTimeout(function () {
                document.body.addEventListener("click", removeMenu);
                container.parentNode.addEventListener("click", removeMenu);
                container.on("click", removeMenu);
            }, 0);
        }
    }).insertTo(container);
    (0, _util.extendObject)(container, this);
    container.addClassName("flagrate flagrate-combobox");
    if (option.className) {
        container.addClassName(option.className);
    }
    if (option.style) {
        container.setStyle(option.style);
    }
    if (option.isDisabled) {
        container.disable();
    }
    return container;
}
var ComboBox = exports.ComboBox = FComboBox;
function createComboBox(option) {
    return new ComboBox(option);
}
ComboBox.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this._textinput.disable();
        this._button.disable();
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this._textinput.enable();
        this._button.enable();
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    getValue: function getValue() {
        return this._textinput.value;
    },
    setValue: function setValue(value) {
        this._textinput.value = value;
        return this;
    },
    setIcon: function setIcon(identifier) {
        this._textinput.setIcon(identifier);
        return this;
    },
    getIcon: function getIcon() {
        return this._textinput.getIcon();
    },
    isValid: function isValid() {
        return this.regexp.test(this.getValue());
    }
};



},{"./button":9,"./element":15,"./menu":18,"./text-input":32,"./util":36}],14:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContextMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createContextMenu = createContextMenu;

var _menu = require("./menu");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createContextMenu(option)
    new flagrate.ContextMenu(option)
    - option (Object) - options.

    ContextMenu.

    #### option

    * `target`                   (Element):
    * `items`                    (Array): of item (see: flagrate.Menu)
**/
var ContextMenu = exports.ContextMenu = function () {
    function ContextMenu() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ContextMenu);

        this._openHandler = this.open.bind(this);
        this._closeHandler = this.close.bind(this);
        this.items = option.items || [];
        this._isShowing = false;
        this.setTarget(option.target || document.body);
    }

    _createClass(ContextMenu, [{
        key: "setTarget",
        value: function setTarget(target) {
            if (this._target) {
                this._target.removeEventListener("contextmenu", this._openHandler);
            }
            target.addEventListener("contextmenu", this._openHandler);
            this._target = target;
            return this;
        }
    }, {
        key: "open",
        value: function open(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if (this._isShowing === true) {
                this.close();
            }
            this._isShowing = true;
            this._menu = new _menu.Menu({
                className: "flagrate-context-menu",
                items: this.items,
                onSelect: this._closeHandler
            });
            var x = 0;
            var y = 0;
            if (e && e.clientX && e.clientY) {
                x = e.clientX;
                y = e.clientY;
            }
            this._menu.style.opacity = "0";
            this._menu.insertTo(document.body);
            if (x + this._menu.getWidth() > window.innerWidth) {
                x = x - this._menu.getWidth() + 1;
            }
            if (y + this._menu.getHeight() > window.innerHeight) {
                y = y - this._menu.getHeight() + 1;
            }
            this._menu.style.top = y + "px";
            this._menu.style.left = x + "px";
            this._menu.style.opacity = "1";
            document.body.addEventListener("click", this._closeHandler);
            document.body.addEventListener("mouseup", this._closeHandler);
            document.body.addEventListener("mousewheel", this._closeHandler);
            return this;
        }
    }, {
        key: "close",
        value: function close() {
            document.body.removeEventListener("click", this._closeHandler);
            document.body.removeEventListener("mouseup", this._closeHandler);
            document.body.removeEventListener("mousewheel", this._closeHandler);
            this._isShowing = false;
            var menu = this._menu;
            setTimeout(function () {
                if (menu && menu.remove) {
                    menu.remove();
                }
            }, 0);
            delete this._menu;
            return this;
        }
        /** Tells whether the visibility. */

    }, {
        key: "visible",
        value: function visible() {
            return this._isShowing;
        }
        /** remove the elements and listeners. */

    }, {
        key: "remove",
        value: function remove() {
            if (this._menu) {
                this.close();
            }
            if (this._target) {
                this._target.removeEventListener("contextmenu", this._openHandler);
            }
        }
    }]);

    return ContextMenu;
}();

function createContextMenu(option) {
    return new ContextMenu(option);
}



},{"./menu":18}],15:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createElement = exports.Element = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = require("./util");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _cache = {};
var _insertionTranslation = {
    before: function before(element, node) {
        element.parentNode.insertBefore(node, element);
    },
    top: function top(element, node) {
        element.insertBefore(node, element.firstChild);
    },
    bottom: function bottom(element, node) {
        element.appendChild(node);
    },
    after: function after(element, node) {
        element.parentNode.insertBefore(node, element.nextSibling);
    }
};
/*?
    flagrate.createElement([tagName = "div", attribute])
    new flagrate.Element([tagName = "div", attribute])
    - tagName (String) - The name of the HTML element to create.
    - attribute (Attribute) - An optional group of attribute/value pairs to set on the element.

    Creates an HTML element with `tagName` as the tag name, optionally with the given attributes.

    #### Example

        // The old way:
        var a = document.createElement("a");
        a.setAttribute("class", "foo");
        a.setAttribute("href", "/foo.html");
        a.appendChild(document.createTextNode("Next page"));
        x.appendChild(a);

        // The new way:
        var a = flagrate.createElement("a", { "class": "foo", href: "/foo.html" })
                        .insertText("Next page")
                        .insertTo(x);
**/
function FElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "div";
    var attribute = arguments[1];

    var node = void 0;
    if (_cache[tagName]) {
        node = _cache[tagName].cloneNode(false);
    } else if (attribute && attribute.hasOwnProperty("type") || tagName === "select") {
        node = document.createElement(tagName);
    } else {
        node = document.createElement(tagName);
        _cache[tagName] = node.cloneNode(false);
    }
    (0, _util.extendObject)(node, this);
    return attribute ? node.writeAttribute(attribute) : node;
}
var Element = exports.Element = FElement;
function _createElement(tagName, attribute) {
    return new Element(tagName, attribute);
}
var createElement = exports.createElement = _createElement;
Element.prototype = {
    isFlagrated: true
};
/*?
    flagrate.Element.visible(element) -> Boolean
    - element (Element) - instance of Element.

    Tells whether `element` is visible

    This method is similar to http://api.prototypejs.org/dom/Element/visible/
**/
Element.visible = function (element) {
    return element.style.display !== "none";
};
/*?
    flagrate.Element.exists(element) -> Boolean
    - element (Element) - instance of Element.

    Tells whether `element` is exists on document.
**/
Element.exists = function (element) {
    if (element.parentNode) {
        while ((element = element.parentNode) !== null) {
            if (element === document) {
                return true;
            }
        }
    }
    return false;
};
/*?
    flagrate.Element.toggle(element) -> Element
    - element (Element) - instance of Element.

    Toggles the visibility of `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/toggle/
**/
Element.toggle = function (element) {
    return Element[Element.visible(element) ? "hide" : "show"](element);
};
/*?
    flagrate.Element.hide(element) -> Element
    - element (Element) - instance of Element.

    Sets `display: none` on `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/hide/
**/
Element.hide = function (element) {
    element.style.display = "none";
    return element;
};
/*?
    flagrate.Element.show(element) -> Element
    - element (Element) - instance of Element.

    Removes `display: none` on `element`. Returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/show/
**/
Element.show = function (element) {
    element.style.display = "";
    return element;
};
/*?
    flagrate.Element.remove(element) -> void
    - element (Element) - instance of Element.

    Completely removes `element` from the document and returns it.

    This method is similar to http://api.prototypejs.org/dom/Element/remove/
**/
Element.remove = function (element) {
    if (element.parentNode) {
        element.parentNode.removeChild(element);
    }
    return;
};
/*?
    flagrate.Element.update(element[, newContent]) -> Element
    - element (Element) - instance of Element.
    - newContent (String|Number|Element) - new content.

    Replaces _the content_ of `element` with the `newContent` argument and
    returns `element`.

    This method is similar to http://api.prototypejs.org/dom/Element/update/
**/
Element.update = function (element, content) {
    var i = element.childNodes.length;
    while (i--) {
        Element.remove(element.childNodes[i]);
    }
    if (!content) {
        return element;
    }
    if (Element.isElement(content) === true) {
        element.appendChild(content);
        return element;
    }
    if (typeof content !== "string") {
        content = content.toString(10);
    }
    element.innerHTML = content;
    return element;
};
/*?
    flagrate.Element.updateText(element[, newContent]) -> Element
    - element (Element) - instance of Element.
    - newContent (String|Number) - new text content.
**/
Element.updateText = function (element, content) {
    var i = element.childNodes.length;
    while (i--) {
        Element.remove(element.childNodes[i]);
    }
    if (content === undefined) {
        return element;
    }
    if (Element.isElement(content) === true && content.toString !== void 0) {
        return Element.updateText(element, content.toString());
    }
    if (typeof content !== "string") {
        content = content.toString(10);
    }
    element.appendChild(document.createTextNode(content));
    return element;
};
/*?
    flagrate.Element.insert(element, content) -> Element
    - element (Element) - instance of Element.
    - content (String|Number|Element|Object) - The content to insert

    Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
    the given element, depending on the option(s) given.

    This method is similar to http://api.prototypejs.org/dom/Element/insert/
**/
Element.insert = function (element, insertion) {
    if (typeof insertion === "string" || typeof insertion === "number" || Element.isElement(insertion) === true) {
        insertion = { bottom: insertion };
    }
    var position = void 0,
        content = void 0,
        insert = void 0,
        div = void 0;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = _insertionTranslation[position];
            if (Element.isElement(content) === true) {
                insert(element, content);
                continue;
            }
            if (typeof content !== "string") {
                content = content.toString(10);
            }
            div = new Element();
            div.innerHTML = content;
            if (position === "top" || position === "after") {
                [].concat(_toConsumableArray(div.childNodes)).reverse();
            }
            while (div.childNodes.length !== 0) {
                insert(element, div.childNodes[0]);
            }
        }
    }
    return element;
};
/*?
    flagrate.Element.insertText(element, content) -> Element
    - element (Element) - instance of Element.
    - content (String|Number|Object) - The content to insert

    Inserts content `above`, `below`, at the `top`, and/or at the `bottom` of
    the given element, depending on the option(s) given.
**/
Element.insertText = function (element, insertion) {
    if (typeof insertion === "string" || typeof insertion === "number") {
        insertion = { bottom: insertion };
    }
    var position = void 0,
        content = void 0,
        insert = void 0;
    for (position in insertion) {
        if (insertion.hasOwnProperty(position)) {
            content = insertion[position];
            position = position.toLowerCase();
            insert = _insertionTranslation[position];
            if (typeof content !== "string") {
                content = content.toString(10);
            }
            insert(element, document.createTextNode(content));
        }
    }
    return element;
};
/*?
    flagrate.Element.insertTo(element, to[, position = "bottom"]) -> Element
    - element (Element) - insert this.
    - to (Element) - insert to this element.
    - position (String) - `before` or `top` or `bottom` or `after`.
**/
Element.insertTo = function (element, to) {
    var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "bottom";

    var insertion = {};
    if (position) {
        insertion[position] = element;
    } else {
        insertion["bottom"] = element;
    }
    Element.insert(to, insertion);
    return element;
};
/*?
    flagrate.Element.readAttribute(element, attributeName) -> String | null
    - element (Element) - instance of Element.
    - attributeName (String) - attribute name.

    Returns the value of `element`'s `attribute` or `null` if `attribute` has
    not been specified.

    This method is similar to http://api.prototypejs.org/dom/Element/readAttribute/
**/
Element.readAttribute = function (element, name) {
    // ref: https://github.com/sstephenson/prototype/blob/1fb9728/src/dom/dom.js#L1856
    return element.getAttribute(name);
};
/*?
    flagrate.Element.writeAttribute(element, attribute[, value = true]) -> Element
    - element (Element) - instance of Element.
    - attribute (String|Object) - attribute name or name/value pairs object.
    - value (Boolean|String) - value of attribute.

    Adds, specifies or removes attributes passed as either a hash or a name/value pair.

    This method is similar to http://api.prototypejs.org/dom/Element/writeAttribute/
**/
Element.writeAttribute = function (element, name, value) {
    var attr = void 0;
    if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") {
        attr = name;
    } else {
        attr = {};
        attr[name] = value === undefined ? true : value;
    }
    var k = void 0;
    for (k in attr) {
        if (attr.hasOwnProperty(k) === true) {
            value = attr[k];
            if (value === false || value === null) {
                element.removeAttribute(k);
            } else if (value === true) {
                element.setAttribute(k, k);
            } else if (value !== undefined) {
                element.setAttribute(k, value);
            }
        }
    }
    return element;
};
/*?
    flagrate.Element.getDimensions(element) -> Object
    - element (Element) - instance of Element.

    Finds the computed width and height of `element` and returns them as
    key/value pairs of an object.

    This method is similar to http://api.prototypejs.org/dom/Element/getDimensions/
**/
Element.getDimensions = function (element) {
    var display = Element.getStyle(element, "display");
    if (display && display !== "none") {
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }
    var before = {
        visibility: element.style.visibility,
        position: element.style.position,
        display: element.style.display
    };
    var after = {
        visibility: "hidden",
        display: "block"
    };
    // Switching `fixed` to `absolute` causes issues in Safari.
    if (before.position !== "fixed") {
        after.position = "absolute";
    }
    Element.setStyle(element, after);
    var dimensions = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
    Element.setStyle(element, before);
    return dimensions;
};
/*?
    flagrate.Element.getHeight(element) -> Number
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/getHeight/
**/
Element.getHeight = function (element) {
    return Element.getDimensions(element).height;
};
/*?
    flagrate.Element.getWidth(element) -> Number
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/getWidth/
**/
Element.getWidth = function (element) {
    return Element.getDimensions(element).width;
};
/*?
    flagrate.Element.cumulativeOffset(element) -> Object
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/cumulativeOffset/
**/
Element.cumulativeOffset = function (element) {
    var t = 0,
        l = 0;
    if (element.parentNode) {
        do {
            t += element.offsetTop || 0;
            l += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
    }
    return {
        top: t,
        left: l
    };
};
/*?
    flagrate.Element.cumulativeScrollOffset(element) -> Object
    - element (Element) - instance of Element.

    This method is similar to http://api.prototypejs.org/dom/Element/cumulativeScrollOffset/
**/
Element.cumulativeScrollOffset = function (element) {
    var t = 0,
        l = 0;
    do {
        t += element.scrollTop || 0;
        l += element.scrollLeft || 0;
        // for Chrome
        if (element.parentNode === document.body && document.documentElement.scrollTop !== 0) {
            element = document.documentElement;
        } else {
            element = element.parentNode;
        }
    } while (element);
    return {
        top: t,
        left: l
    };
};
/*?
    Flagrate.Element.hasClassName(element, className) -> Boolean
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/hasClassName/
**/
Element.hasClassName = function (element, className) {
    return element.className.length > 0 && (element.className === className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className));
};
/*?
    flagrate.Element.addClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) - The class name to add.

    This method is similar to http://api.prototypejs.org/dom/Element/addClassName/
**/
Element.addClassName = function (element, className) {
    if (!Element.hasClassName(element, className)) {
        element.className += (element.className ? " " : "") + className;
    }
    return element;
};
/*?
    flagrate.Element.removeClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/removeClassName/
**/
Element.removeClassName = function (element, className) {
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").trim();
    return element;
};
/*?
    flagrate.Element.toggleClassName(element, className) -> Element
    - element (Element) - instance of Element.
    - className (String) -

    This method is similar to http://api.prototypejs.org/dom/Element/toggleClassName/
**/
Element.toggleClassName = function (element, className) {
    return Element[Element.hasClassName(element, className) ? "removeClassName" : "addClassName"](element, className);
};
/*?
    flagrate.Element.getStyle(element, propertyName) -> String | Number | null
    - element (Element) - instance of Element.
    - propertyName (String) - The property name of style to be retrieved.

    This method is similar to http://api.prototypejs.org/dom/Element/getStyle/
**/
Element.getStyle = function (element, style) {
    style = style === "float" ? "cssFloat" : style.replace(/-+([a-z])?/g, function (m, s) {
        return s ? s.toUpperCase() : "";
    });
    var value = element.style[style];
    if (!value || value === "auto") {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css && css[style] !== void 0 && css[style] !== "" ? css[style] : null;
    }
    if (style === "opacity") {
        return value ? parseFloat(value) : 1.0;
    }
    return value === "auto" ? null : value;
};
/*?
    flagrate.Element.setStyle(element, style) -> Element
    - element (Element) - instance of Element.
    - style (Object) -

    This method is similar to http://api.prototypejs.org/dom/Element/setStyle/
**/
Element.setStyle = function (element, style) {
    var p = void 0;
    for (p in style) {
        if (style.hasOwnProperty(p)) {
            element.style[p === "float" || p === "cssFloat" ? "cssFloat" : p] = style[p];
        }
    }
    return element;
};
/*?
    flagrate.Element.on(element, eventName, listener[, useCapture = false]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - listener (Function) - The function to call when the event occurs.
    - useCapture (Boolean) -

    Registers an event handler on a DOM element.
**/
Element.on = function (element, name, listener, useCapture) {
    if (element._flagrateEvent === undefined) {
        element._flagrateEvent = {};
    }
    if (element._flagrateEvent[name] === undefined) {
        element._flagrateEvent[name] = [];
    }
    element._flagrateEvent[name].push({
        listener: listener,
        useCapture: useCapture
    });
    element.addEventListener(name, listener, useCapture || false);
    return element;
};
/*?
    flagrate.Element.off(element, eventName[, listener, useCapture = false]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - listener (Function) - The function to call when the event occurs.
    - useCapture (Boolean) -

    Unregisters an event handler on a DOM element.
**/
Element.off = function (element, name, listener, useCapture) {
    if (listener) {
        element.removeEventListener(name, listener, useCapture || false);
        return;
    }
    if (element._flagrateEvent === undefined) {
        element._flagrateEvent = {};
    }
    if (element._flagrateEvent[name] === undefined) {
        element._flagrateEvent[name] = [];
    }
    element._flagrateEvent[name].forEach(function (fevent) {
        element.removeEventListener(name, fevent.listener, fevent.useCapture || false);
    });
    return element;
};
/*?
    flagrate.Element.fire(element, eventName[, property]) -> Element
    - element (Element) - instance of Element.
    - eventName (String) - name of event.
    - property (Object) -

    Fires a custom event.
**/
Element.fire = function (element, name, property) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent(name, true, true);
    if (property) {
        (0, _util.extendObject)(event, property);
    }
    element.dispatchEvent(event);
    return element;
};
/*?
    flagrate.Element.emit(element, eventName[, property]) -> Element
    Alias of: flagrate.Element.fire
**/
Element.emit = Element.fire;
//
// create instance methods
//
for (var name in Element) {
    if (!(name in Element.prototype)) {
        Element.prototype[name] = wrapper(name);
    }
}
function wrapper(name) {
    return function () {
        return Element[name].apply(Element, [this].concat(Array.prototype.slice.call(arguments)));
    };
}
//
// extra class methods
//
/*?
    flagrate.Element.extend(element) -> flagrate.Element
    - element (Element) - instance of Element.

    Extends the given `element` instance.

    **Caution**: This method will add Flagrate.Element instance methods to given element instance.
**/
Element.extend = function (element) {
    if (element.isFlagrated) {
        return element;
    }
    (0, _util.extendObject)(element, Element.prototype);
    return element;
};
/*?
    flagrate.Element.isElement(element) -> Boolean
    - element (Element) - instance of Element.
**/
if ((typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object") {
    Element.isElement = function (object) {
        return object instanceof HTMLElement;
    };
} else {
    Element.isElement = function (object) {
        return !!(object && object.nodeType === 1 && typeof object.nodeName === "string");
    };
}



},{"./util":36}],16:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createForm = createForm;

var _util = require("./util");

var _element = require("./element");

var _textInput = require("./text-input");

var _textArea = require("./text-area");

var _comboBox = require("./combo-box");

var _checkbox = require("./checkbox");

var _checkboxes = require("./checkboxes");

var _switch = require("./switch");

var _radios = require("./radios");

var _select = require("./select");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createForm(option)
    new flagrate.Form(option)
    - option (Object) - configuration.

    Create and initialize the Form.

    #### option

    * `fields`                   (Array; default `[]`): of **[field](#field)** object.
    * `id`                       (String): `id` attribute of container.
    * `className`                (String): `class` attribute of container.
    * `attribute`                (Object): additional attribute of container.
    * `style`                    (Object): style of container. (using flagrate.Element.setStyle)
    * `nolabel`                  (Boolean; default `false`): hide labels.
    * `vertical`                 (Boolean; default `false`): vertical label style.

    #### field

    * `key`                      (String):
    * `pointer`                  (String|null):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `input`                    (Object): see **[input](#input)**
    * `depends`                  (Array): of **[depend](#depend)**
    * `id`                       (String): `id` attribute of container.
    * `className`                (String): `class` attribute of container.
    * `attribute`                (Object): additional attribute of container.
    * `style`                    (Object): style of container. (using flagrate.Element.setStyle)

    #### input

    * `type`                     (String|Object; **required**): **[inputtype](#inputType)** String or Object
    * `val`                      (any): default value(s) of this input.
    * `isRequired`               (Boolean; default `false`):
    * `min`                      (Number): (simple validator)
    * `max`                      (Number): (simple validator)
    * `minLength`                (Number): (simple validator)
    * `maxLength`                (Number): (simple validator)
    * `validators`               (Array): of **[inputValidator](#inputvalidator)** String or Object or Function.
    * `toString`                 (Boolean; default `false`): if NOT String, use [#toString()](https://developer.mozilla.org/ja/docs/toString) before resulting.
    * `trim`                     (Boolean; default `false`): if String, use [String#trim()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/trim) before resulting.
    * `toNumber`                 (Boolean; default `false`): if NOT Number, tries to convert to Number.
    * `transform`                (Function): alternate result transform/converting function. (only sync)
    * `id`                       (String): `id` attribute of input element.

    #### depend

    * `key`                      (String): unique key for identifying fields. if looking result, must change to use the pointer.
    * `pointer`                  (String):
    * `val`                      (any):
    * `op`                       (String): `===`, `!==`, `>=`, `<=`, `>`, `<`, `in`
    * `tester`                   (Function): alternate testing function. this disables normal testing. (only sync)

    #### inputType

    if specified a String, will use flagrate.Form.inputType[(specified)].

    #### inputValidator

    if specified a String, will use flagrate.Form.inputValidator[(specified)].

        // Example: custom validator
        validators: [
            // using regex:
            {
                regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
                error: "Please enter a valid hostname string."
            },
            // using async function:
            function (input, done) {
                someAsyncFunction(input, function (err, result) {
                    if (err) {
                        done("error", "This hostname is already in use. (" + err + ")");
                    } else {
                        done("success");
                    }
                });
            },
            // using sync function:
            function (input, done) {
                var err = someSyncFunction(input);
                if (err) {
                    done("error", "This hostname is prohibited. (" + err + ")");
                } else {
                    done("success");
                }
            }
        ]

    see flagrate.Form.inputValidator to read more documents.
**/
var Form = exports.Form = function () {
    function Form() {
        var _opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Form);

        this._opt = _opt;
        this._fields = [];
        this._nolabel = false;
        this._vertical = false;
        this.element = new _element.Element("form", { "class": "flagrate flagrate-form" });
        this._id = "flagrate-form-" + (++Form.idCounter).toString(10);
        if (_opt.nolabel === true) {
            this._nolabel = true;
        }
        if (_opt.vertical === true) {
            this._vertical = true;
        }
        this._create();
        if (_opt.fields && _opt.fields.length !== 0) {
            this.push(_opt.fields);
        }
    }

    _createClass(Form, [{
        key: "insertTo",
        value: function insertTo(element, pos) {
            return this.element.insertTo(element, pos) && this;
        }
    }, {
        key: "on",
        value: function on(eventType, listener, useCapture) {
            return this.element.on(eventType, listener, useCapture) && this;
        }
    }, {
        key: "off",
        value: function off(eventType, listener, useCapture) {
            return this.element.off(eventType, listener, useCapture) && this;
        }
        /** Returns a result Object. */

    }, {
        key: "getResult",
        value: function getResult() {
            var result = {};
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (!field.key && typeof field.pointer !== "string" || field._dependsIsOk !== true) {
                    continue;
                }
                if (field.pointer === null) {
                    // null pointer
                    continue;
                }
                if (typeof field.pointer === "string") {
                    _util.jsonPointer.set(result, field.pointer, field.getVal());
                } else if (field.key) {
                    result[field.key] = field.getVal();
                }
            }
            return result;
        }
        /*?
            #### Example
                  form.validate(function(success) {
                    if (success) {
                        console.log("form is valid.");
                    } else {
                        console.log("form is invalid.");
                    }
                });
        **/

    }, {
        key: "validate",
        value: function validate(callback) {
            var fields = [];
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (field._dependsIsOk === true && field.input && field.input.type) {
                    fields.push(field);
                }
            }
            var hasError = false;
            function fin() {
                if (callback) {
                    callback(!hasError);
                }
            }
            function done(result) {
                if (result === false) {
                    hasError = true;
                }
                run();
            }
            function run() {
                if (fields.length === 0) {
                    return fin();
                }
                fields.shift().validate(done);
            }
            run();
            return this;
        }
    }, {
        key: "enable",
        value: function enable() {
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (field.input && field.input.type) {
                    field.input.type.enable.call(field.input);
                }
            }
            return this;
        }
    }, {
        key: "disable",
        value: function disable() {
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (field.input && field.input.type) {
                    field.input.type.disable.call(field.input);
                }
            }
            return this;
        }
    }, {
        key: "getField",
        value: function getField(key) {
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (field.key && field.key === key) {
                    return field;
                }
            }
            return null;
        }
    }, {
        key: "push",
        value: function push(f) {
            if (f instanceof Array) {
                for (var i = 0, l = f.length; i < l; i++) {
                    this._createField(f[i]);
                    this._fields.push(f[i]);
                }
            } else {
                this._createField(f);
                this._fields.push(f);
            }
            for (var _i = 0, _l = this._fields.length; _i < _l; _i++) {
                this._collectFieldRefs(this._fields[_i]);
                this._checkFieldDepends(this._fields[_i]);
            }
            this._requestRender();
            return this._fields.length;
        }
    }, {
        key: "splice",
        value: function splice(index, c, f) {
            c = typeof c === "undefined" ? this._fields.length - index : c;
            var removes = this._fields.splice(index, c);
            for (var i = 0, l = removes.length; i < l; i++) {
                if (removes[i].container) {
                    removes[i].container.remove();
                    delete removes[i].container;
                }
            }
            if (f) {
                if (f instanceof Array === false) {
                    f = [f];
                }
                for (var _i2 = 0, _l2 = f.length; _i2 < _l2; _i2++) {
                    this._createField(f[_i2]);
                    this._fields.splice(index + _i2, 0, f[_i2]);
                }
            }
            for (var _i3 = 0, _l3 = this._fields.length; _i3 < _l3; _i3++) {
                this._collectFieldRefs(this._fields[_i3]);
                this._checkFieldDepends(this._fields[_i3]);
            }
            this._requestRender();
            return removes;
        }
    }, {
        key: "removeField",
        value: function removeField(f) {
            var removes = [];
            var bulk = true;
            if (f instanceof Array === false) {
                bulk = false;
                f = [f];
            }
            for (var i = 0, l = f.length; i < l; i++) {
                var index = typeof f[i] === "number" ? f[i] : this.indexOf(f[i]);
                if (index !== -1) {
                    removes.push(this.splice(index, 1));
                }
            }
            return bulk ? removes : removes[0];
        }
    }, {
        key: "indexOf",
        value: function indexOf(f) {
            if (typeof f === "string") {
                var index = -1;
                for (var i = 0, l = this._fields.length; i < l; i++) {
                    if (this._fields[i].key === f) {
                        index = i;
                        break;
                    }
                }
                return index;
            } else {
                return this._fields.indexOf(f);
            }
        }
    }, {
        key: "_create",
        value: function _create() {
            if (this._opt.id) {
                this.element.writeAttribute("id", this._opt.id);
            }
            if (this._opt.className) {
                this.element.addClassName(this._opt.className);
            }
            if (this._opt.attribute) {
                this.element.writeAttribute(this._opt.attribute);
            }
            if (this._opt.style) {
                this.element.setStyle(this._opt.style);
            }
            if (this._opt.nolabel === true) {
                this.element.addClassName("flagrate-form-nolabel");
            }
            if (this._opt.vertical === true) {
                this.element.addClassName("flagrate-form-vertical");
            }
            this.element.addEventListener("submit", function (e) {
                return e.preventDefault();
            });
            return this;
        }
    }, {
        key: "_requestRender",
        value: function _requestRender() {
            if (this._renderTimer) {
                clearTimeout(this._renderTimer);
            }
            this._renderTimer = setTimeout(this._render.bind(this), 0);
            return this;
        }
    }, {
        key: "_render",
        value: function _render() {
            var active = document.activeElement;
            for (var i = 0, l = this._fields.length; i < l; i++) {
                var field = this._fields[i];
                if (field._dependsIsOk === true) {
                    field.container.insertTo(this.element);
                } else {
                    if (field.visible() === true) {
                        field.container.remove();
                    }
                }
            }
            if (active) {
                if (/Trident/.test(window.navigator.userAgent) === true) {
                    setTimeout(function () {
                        if (active.focus) {
                            active.focus();
                        }
                        var isMustReselected = active.tagName === "INPUT" && (active.type === "text" || active.type === "password" || active.type === "number") || active.tagName === "TEXTAREA";
                        if (isMustReselected) {
                            if (typeof active.selectionStart === "number") {
                                active.selectionStart = active.selectionEnd = active.value.length;
                            } else if (active["createTextRange"] !== undefined) {
                                var range = active["createTextRange"]();
                                range.collapse(false);
                                range.select();
                            }
                        }
                    }, 0);
                } else {
                    if (active.focus) {
                        active.focus();
                    }
                }
            }
            return this;
        }
    }, {
        key: "_collectFieldRefs",
        value: function _collectFieldRefs(field) {
            field._refs = [];
            // DEPRECATED
            if (typeof field["point"] !== "undefined") {
                field.pointer = field["point"];
                delete field["point"];
            }
            if (!field.key && typeof field.pointer !== "string") {
                return this;
            }
            var i = void 0,
                l = void 0,
                j = void 0,
                m = void 0,
                k = void 0,
                n = void 0,
                fi = void 0,
                s = void 0;
            for (i = 0, l = this._fields.length; i < l; i++) {
                fi = this._fields[i];
                if (field === fi || !fi.depends || fi.depends.length === 0) {
                    continue;
                }
                for (j = 0, m = fi.depends.length; j < m; j++) {
                    if (fi.depends[j] instanceof Array) {
                        s = false;
                        for (k = 0, n = fi.depends[j].length; k < n; k++) {
                            if (fi.depends[j][k].key === field.key) {
                                s = true;
                                break;
                            }
                            if (typeof fi.depends[j][k].point === "string") {
                                fi.depends[j][k].pointer = fi.depends[j][k].point;
                                delete fi.depends[j][k].point;
                            }
                            if (typeof fi.depends[j][k].pointer === "string") {
                                if (fi.depends[j][k].pointer === field.pointer) {
                                    s = true;
                                    break;
                                }
                                if (fi.depends[j][k].pointer === "/" + field.key) {
                                    s = true;
                                    break;
                                }
                            }
                        }
                        if (s) {
                            field._refs.push(fi);
                        }
                        break;
                    } else {
                        if (fi.depends[j].key === field.key) {
                            field._refs.push(fi);
                            break;
                        }
                        if (typeof fi.depends[j].point === "string") {
                            fi.depends[j].pointer = fi.depends[j].point;
                            delete fi.depends[j].point;
                        }
                        if (typeof fi.depends[j].pointer === "string") {
                            if (fi.depends[j].pointer === field.pointer) {
                                field._refs.push(fi);
                                break;
                            }
                            if (fi.depends[j].pointer === "/" + field.key) {
                                field._refs.push(fi);
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        }
    }, {
        key: "_compareDepend",
        value: function _compareDepend(d) {
            var v = void 0;
            if (d.key) {
                var f = this.getField(d.key);
                if (f !== null) {
                    if (!d.op && !d.tester && d.val === undefined) {
                        return true;
                    }
                    if (f._dependsIsOk === true) {
                        v = f.getVal();
                    }
                }
            } else if (typeof d.pointer === "string") {
                try {
                    v = _util.jsonPointer.get(this.getResult(), d.pointer);
                } catch (e) {
                    // undefined
                }
            } else {
                return true;
            }
            if (typeof d.tester === "function") {
                return !!d.tester(v, d);
            }
            if (d.op) {
                if (d.op === "===" && d.val === v) {
                    return true;
                }
                if (d.op === "!==" && d.val !== v) {
                    return true;
                }
                if (d.op === ">=" && d.val >= v) {
                    return true;
                }
                if (d.op === "<=" && d.val <= v) {
                    return true;
                }
                if (d.op === ">" && d.val > v) {
                    return true;
                }
                if (d.op === "<" && d.val < v) {
                    return true;
                }
                if (d.op === "in" && typeof v[d.val] !== "undefined") {
                    return true;
                }
            } else {
                if (d.val === v) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "_checkFieldDepends",
        value: function _checkFieldDepends(field) {
            var depends = field.depends;
            if (!depends || depends.length === 0) {
                field._dependsIsOk = true;
                return true;
            }
            var result = true;
            var i = void 0,
                l = void 0,
                j = void 0,
                m = void 0,
                d = void 0,
                f = void 0,
                s = void 0;
            for (i = 0, l = depends.length; i < l; i++) {
                d = depends[i];
                if (d instanceof Array) {
                    s = false;
                    for (j = 0, m = d.length; j < m; j++) {
                        if (this._compareDepend(d[j]) === true) {
                            s = true;
                            break;
                        }
                    }
                    if (s === false) {
                        result = false;
                        break;
                    }
                } else {
                    if (this._compareDepend(d) === false) {
                        result = false;
                        break;
                    }
                }
            }
            field._dependsIsOk = result;
            return result;
        }
    }, {
        key: "_createField",
        value: function _createField(field) {
            var _this = this;

            field._dependsIsOk = !field.depends || field.depends.length === 0;
            // field container
            field.container = new _element.Element("div");
            // attributes to field container
            if (field.id) {
                field.container.writeAttribute("id", field.id);
            }
            if (field.className) {
                field.container.writeAttribute("class", field.className);
            }
            if (field.attribute) {
                field.container.writeAttribute(field.attribute);
            }
            if (field.style) {
                field.container.setStyle(field.style);
            }
            // create label
            if (this._nolabel === false) {
                field.labelElement = new _element.Element("label").insertText(field.label || "");
                new _element.Element("div", { "class": "flagrate-form-field-label" }).insert(field.labelElement).insertTo(field.container);
                // icon to label
                if (field.icon) {
                    field.labelElement.addClassName("flagrate-icon");
                    field.labelElement.setStyle({
                        backgroundImage: "url(" + field.icon + ")"
                    });
                }
            }
            // input container
            field._input = new _element.Element("div").insertTo(field.container);
            // input ready?
            if (field.input && field.input.type) {
                if (typeof field.input.type === "string") {
                    field.input.type = Form.inputType[field.input.type];
                } else if (!field.input.type.create) {
                    delete field.input;
                }
            }
            // init input
            if (field.input && field.input.type) {
                var input = field.input;
                if (!input.id) {
                    input.id = "flagrate-form-input-" + ++Form.idCounter;
                }
                if (this._nolabel === false) {
                    field.labelElement.writeAttribute("for", input.id);
                }
                input.element = input.type.create.call(input);
                new _element.Element("div", { "class": "flagrate-form-field-input" }).insert(input.element).insertTo(field._input);
                input.element.writeAttribute("id", input.id);
                // value, values is just alias.
                if (input["value"]) {
                    input.val = input["value"];
                } else if (input["values"]) {
                    input.val = input["values"];
                }
                // set the default value
                if (input.val !== undefined) {
                    input.type.setVal.call(input, input.val);
                }
                if (input.style) {
                    input.element.setStyle(input.style);
                }
                if (input.attribute) {
                    input.element.writeAttribute(input.attribute);
                }
                // toString is alias for toStr.
                if (typeof input["toString"] === "boolean" && input.toStr === undefined) {
                    input.toStr = input["toString"];
                }
                // init validator
                if (input.validators) {
                    input.validators.forEach(function (v, i) {
                        if (typeof v === "string") {
                            input.validators[i] = Form.inputValidator[v];
                        }
                    });
                } else {
                    input.validators = [];
                }
                // result block
                input._result = new _element.Element("ul", {
                    "class": "flagrate-form-field-result"
                }).insertTo(field._input);
                // etc
                if (input.isRequired === true) {
                    field.container.addClassName("flagrate-required");
                }
            }
            // misc
            if (field.element) {
                new _element.Element("div", {
                    "class": "flagrate-form-field-element"
                }).insert(field.element).insertTo(field._input);
            }
            if (field.html) {
                new _element.Element("div", {
                    "class": "flagrate-form-field-html"
                }).insert(field.html).insertTo(field._input);
            }
            if (field.text) {
                new _element.Element("p", {
                    "class": "flagrate-form-field-text"
                }).insertText(field.text).insertTo(field._input);
            }
            // field methods
            field.visible = function () {
                return field.container.parentNode !== null && field.container.parentNode === _this.element;
            };
            field.getVal = function () {
                if (!field.input) {
                    return undefined;
                }
                var result = field.input.type.getVal.call(field.input);
                if (field.input.toStr === true) {
                    result = result.toString();
                }
                if (field.input.trim === true && typeof result === "string") {
                    result = result.trim();
                }
                if (field.input.toNumber === true && typeof result !== "number") {
                    if (typeof result === "string") {
                        result = parseFloat(result);
                    } else if (result instanceof Date) {
                        result = result.getTime();
                    } else if (typeof result === "boolean") {
                        result = result === true ? 1 : 0;
                    }
                }
                if (typeof field.input.transform === "function") {
                    result = field.input.transform.call(field.input, result);
                }
                return result;
            };
            field.setVal = function (val) {
                if (!field.input) {
                    return field;
                }
                field.input.type.setVal.call(field.input, val);
                field._inputOnChange();
                return field;
            };
            field.validate = function (callback) {
                var val = field.getVal();
                var hasError = false;
                var hasWarning = false;
                field.input._result.update();
                // simple validator
                if (field.input.isRequired === true) {
                    if (val === undefined) {
                        hasError = true;
                    } else if (val === false || val === null) {
                        hasError = true;
                    } else if (typeof val === "number" && isNaN(val) === true) {
                        hasError = true;
                    } else if (val.length !== undefined && val.length === 0) {
                        hasError = true;
                    }
                }
                if (typeof field.input.min === "number") {
                    if (typeof val === "number") {
                        if (field.input.min > val) {
                            hasError = true;
                        }
                    } else if (typeof val === "string" && val !== "") {
                        if (field.input.min > parseInt(val, 10)) {
                            hasError = true;
                        }
                    } else if (val instanceof Array) {
                        if (field.input.min > val.length) {
                            hasError = true;
                        }
                    }
                }
                if (typeof field.input.max === "number") {
                    if (typeof val === "number") {
                        if (field.input.max < val) {
                            hasError = true;
                        }
                    } else if (typeof val === "string" && val !== "") {
                        if (field.input.max < parseInt(val, 10)) {
                            hasError = true;
                        }
                    } else if (val instanceof Array) {
                        if (field.input.max < val.length) {
                            hasError = true;
                        }
                    }
                }
                if (field.input.minLength && field.input.minLength > (val.length || val.toString && val.toString().length || 0) && typeof val === "string" && val !== "") {
                    hasError = true;
                }
                if (field.input.maxLength && field.input.maxLength < (val.length || val.toString && val.toString().length || 0)) {
                    hasError = true;
                }
                // validators
                var q = [];
                field.input.validators.forEach(function (v) {
                    q.push(v);
                });
                function fin() {
                    if (field.input._result.innerHTML === "") {
                        field.container.removeClassName("flagrate-has-result");
                    } else {
                        field.container.addClassName("flagrate-has-result");
                    }
                    if (hasError) {
                        field.container.removeClassName("flagrate-has-warning");
                        field.container.removeClassName("flagrate-has-success");
                        field.container.addClassName("flagrate-has-error");
                    } else if (hasWarning) {
                        field.container.removeClassName("flagrate-has-error");
                        field.container.removeClassName("flagrate-has-success");
                        field.container.addClassName("flagrate-has-warning");
                    } else {
                        field.container.removeClassName("flagrate-has-error");
                        field.container.removeClassName("flagrate-has-warning");
                        field.container.addClassName("flagrate-has-success");
                    }
                    field._hasError = hasError;
                    field._hasWarning = hasWarning;
                    if (callback) {
                        callback(!hasError);
                    }
                }
                function done(result, message) {
                    switch (result) {
                        case true:
                        case "success":
                            break;
                        case null:
                        case "warning":
                            hasWarning = true;
                            break;
                        case false:
                        case "error":
                            hasError = true;
                            break;
                    }
                    if (message) {
                        new _element.Element("li").insertText(message).insertTo(field.input._result);
                    }
                    run();
                }
                function run() {
                    if (q.length === 0 || hasError === true) {
                        return fin();
                    }
                    var v = q.shift();
                    if (typeof v === "function") {
                        v.call(field.input, val, done);
                    } else if (typeof val === "string" && val !== "") {
                        if (v.regexp.test(val)) {
                            done(true, v.success);
                        } else {
                            done(false, v.error);
                        }
                    } else {
                        done(true);
                    }
                }
                run();
            };
            field._checkRefs = function () {
                var rerend = false;
                for (var i = 0, l = field._refs.length, refField; i < l; i++) {
                    refField = field._refs[i];
                    if (refField._dependsIsOk !== _this._checkFieldDepends(refField)) {
                        refField._checkRefs();
                        rerend = true;
                    }
                }
                if (rerend === true) {
                    _this._requestRender();
                }
            };
            field._inputOnChange = function () {
                // validation
                field.validate();
                // dependency
                field._checkRefs();
            };
            // listen change event
            if (field.input && field.input.type) {
                var changeEvents = field.input.type.changeEvents || ["change"];
                changeEvents.forEach(function (eventName) {
                    field.input.element.addEventListener(eventName, field._inputOnChange);
                });
            }
            return this;
        }
    }]);

    return Form;
}();

Form.idCounter = 0;
/*?
    flagrate.Form.inputValidator -> Object

    #### Built-in validators

    * numeric
    * alphanumeric

    #### Basic validator

        // success and error messages are optional
        { regexp: /RegExp/, success: "String", error: "String" }
        // warning state is not available in this way, see Advanced.

    #### Advanced validator

        // Sync or Async validation
        function (input, done) { done(result, message); }// message is optional

        // Examples
        function (input, done) { done(true); }// success
        function (input, done) { done(null); }// warning
        function (input, done) { done(false); }// error
        function (input, done) { done("success"); }// success
        function (input, done) { done("warning"); }// warning
        function (input, done) { done("error"); }// error
        function (input, done) { done(true, "..."); }// success with message
        function (input, done) { done(null, "..."); }// warning with message
        function (input, done) { done(false, "..."); }// error with message

    #### Example: adding error message to built-in validators

        flagrate.Form.inputValidator.numeric.error = "Please enter a numbers.";
        flagrate.Form.inputValidator.alphanumeric.error = "Please enter a alphanumeric.";

    #### Example: add the custom validator to Flagrate (to create plugin)

        flagrate.Form.inputValidator.hostname = {
            regexp: /^[a-z0-9]+(-[a-z0-9]+)*(\.([a-z0-9]+(-[a-z0-9]+)*))*$/i,
            error: "Please enter a valid hostname string."
        };
**/
Form.inputValidator = {
    numeric: {
        regexp: /^[0-9]+$/
    },
    alphanumeric: {
        regexp: /^[a-z0-9]+$/i
    }
};
/*?
    flagrate.Form.inputType -> Object

    #### Built-in input types

    * [text](#text-string-) -> `String`
    * [password](#password-string-) -> `String`
    * [textarea](#textarea-string-) -> `String`
    * [number](#number-number-) -> `Number`
    * [combobox](#combobox-string-) -> `String`
    * [checkbox](#checkbox-boolean-) -> `Boolean`
    * [checkboxes](#checkboxes-array-) -> `Array`
    * [switch](#switch-boolean-) -> `Boolean`
    * [radios](#radios-any-) -> `any`
    * [select](#select-any-array-) -> `any`|`Array`
    * [file](#file-file-) -> `File`
    * [files](#files-filelist-) -> `FileList`
**/
Form.inputType = {
    /*?
        #### text -> `String`
        most basic single-line text input. (uses flagrate.TextInput)
          * `placeholder` (String):
        * `icon`        (String):
        * `maxLength`   (Number):
    **/
    text: {
        changeEvents: ["change", "keyup"],
        create: function create() {
            // return to define this.element
            return new _textInput.TextInput({
                placeholder: this.placeholder,
                icon: this.icon,
                attribute: {
                    maxlength: this.maxLength
                }
            });
        },
        getVal: function getVal() {
            return this.element.getValue();
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### password -> `String`
        password input. Almost the same to [text](#text).
    **/
    password: {
        changeEvents: ["change", "keyup"],
        create: function create() {
            return new _textInput.TextInput({
                placeholder: this.placeholder,
                icon: this.icon,
                attribute: {
                    type: "password",
                    maxlength: this.maxLength
                }
            });
        },
        getVal: function getVal() {
            return this.element.getValue();
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### textarea -> `String`
        textarea input. (uses flagrate.TextArea)
          * `placeholder` (String):
        * `icon`        (String):
        * `maxLength`   (Number):
    **/
    textarea: {
        changeEvents: ["change", "keyup"],
        create: function create() {
            return new _textArea.TextArea({
                placeholder: this.placeholder,
                icon: this.icon,
                attribute: {
                    maxlength: this.maxLength
                }
            });
        },
        getVal: function getVal() {
            return this.element.getValue();
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### number -> `Number`
        number input. (uses flagrate.TextInput)
          * `placeholder` (String):
        * `icon`        (String):
        * `min`         (Number):
        * `max`         (Number):
        * `maxLength`   (Number):
    **/
    number: {
        changeEvents: ["change", "keyup"],
        create: function create() {
            return new _textInput.TextInput({
                placeholder: this.placeholder,
                icon: this.icon,
                attribute: {
                    type: "number",
                    inputmode: "numeric",
                    min: this.min,
                    max: this.max,
                    maxlength: this.maxLength
                }
            });
        },
        getVal: function getVal() {
            return parseFloat(this.element.getValue());
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### combobox -> `String`
        combobox input. (uses flagrate.ComboBox)
          * `placeholder` (String):
        * `icon`        (String):
        * `maxLength`   (Number):
        * `items`       (Array): of String values.
    **/
    combobox: {
        changeEvents: ["change", "keyup"],
        create: function create() {
            return new _comboBox.ComboBox({
                placeholder: this.placeholder,
                icon: this.icon,
                items: this.items,
                attribute: {
                    maxlength: this.maxLength
                }
            });
        },
        getVal: function getVal() {
            return this.element.getValue();
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### checkbox -> `Boolean`
        Checkbox input. (uses flagrate.Checkbox)
          * `label`       (String):
        * `labelHTML`   (String):
        * `icon`        (String):
    **/
    checkbox: {
        create: function create() {
            return new _checkbox.Checkbox({
                icon: this.icon,
                label: this.label,
                labelHTML: this.labelHTML
            });
        },
        getVal: function getVal() {
            return this.element.isChecked();
        },
        setVal: function setVal(value) {
            if (value) {
                this.element.check();
            } else {
                this.element.uncheck();
            }
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### checkboxes -> `Array`
        Checkboxes input. (uses flagrate.Checkboxes)
          * `items` (Array):
    **/
    checkboxes: {
        create: function create() {
            return new _checkboxes.Checkboxes({
                items: this.items
            });
        },
        getVal: function getVal() {
            return this.element.getValues();
        },
        setVal: function setVal(values) {
            this.element.setValues(values);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### switch -> `Boolean`
        Switch input. (uses flagrate.Switch)
    **/
    "switch": {
        create: function create() {
            return new _switch.Switch();
        },
        getVal: function getVal() {
            return this.element.isOn();
        },
        setVal: function setVal(value) {
            if (value) {
                this.element.switchOn();
            } else {
                this.element.switchOff();
            }
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### radios -> `any`
        Radio buttons input. (uses flagrate.Radios)
          * `items` (Array):
    **/
    radios: {
        create: function create() {
            return new _radios.Radios({
                items: this.items
            });
        },
        getVal: function getVal() {
            return this.element.getValue();
        },
        setVal: function setVal(value) {
            this.element.setValue(value);
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### select -> `any`|`array`
        Select input. (uses flagrate.Select)
          * `items` (Array):
        * `listView` (Boolean; default `false`):
        * `multiple` (Boolean; default `false`):
        * `max` (Number; default `-1`):
        * `selectedIndex` (Number):
        * `selectedIndexes` (Array): of Number
    **/
    select: {
        create: function create() {
            return new _select.Select({
                items: this.items,
                listView: this.listView,
                multiple: this.multiple,
                max: this.max,
                selectedIndex: this.selectedIndex,
                selectedIndexes: this.selectedIndexes
            });
        },
        getVal: function getVal() {
            return this.element.multiple === true ? this.element.getValues() : this.element.getValue();
        },
        setVal: function setVal(val) {
            if (this.element.multiple === false) {
                val = [val];
            } else {
                this.element.deselectAll();
            }
            for (var i = 0, l = val.length, m = this.element.items.length; i < l; i++) {
                for (var j = 0; j < m; j++) {
                    if (val[i] === this.element.items[j].value) {
                        this.element.select(j);
                        break;
                    }
                }
            }
        },
        enable: function enable() {
            this.element.enable();
        },
        disable: function disable() {
            this.element.disable();
        }
    },
    /*?
        #### file -> `File`
        File input for [File API](http://www.w3.org/TR/file-upload/)
          * `accept` (String): pass to `accept` attribute value.
        * `acceptTypes` (Array): Array of MIME type string.
    **/
    file: {
        create: function create() {
            return new _element.Element("input", {
                type: "file",
                accept: this.accept || (this.acceptTypes ? this.acceptTypes.join(",") : undefined)
            });
        },
        getVal: function getVal() {
            return this.element.files[0];
        },
        setVal: function setVal(file) {
            this.element.files[0] = file;
        },
        enable: function enable() {
            this.element.writeAttribute("disabled", false);
        },
        disable: function disable() {
            this.element.writeAttribute("disabled", true);
        }
    },
    /*?
        #### files -> `FileList`
        File input for [File API](http://www.w3.org/TR/file-upload/)
          * `accept` (String): pass to `accept` attribute value.
        * `acceptTypes` (Array): Array of MIME type string.
    **/
    files: {
        create: function create() {
            return new _element.Element("input", {
                type: "file",
                accept: this.accept || (this.acceptTypes ? this.acceptTypes.join(",") : undefined),
                multiple: true
            });
        },
        getVal: function getVal() {
            return this.element.files;
        },
        setVal: function setVal(files) {
            this.element.files = files;
        },
        enable: function enable() {
            this.element.writeAttribute("disabled", false);
        },
        disable: function disable() {
            this.element.writeAttribute("disabled", true);
        }
    }
};
function createForm(option) {
    return new Form(option);
}



},{"./checkbox":11,"./checkboxes":12,"./combo-box":13,"./element":15,"./radios":25,"./select":27,"./switch":29,"./text-area":31,"./text-input":32,"./util":36}],17:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Grid = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createGrid = createGrid;

var _element = require("./element");

var _button = require("./button");

var _checkbox = require("./checkbox");

var _toolbar = require("./toolbar");

var _contextMenu = require("./context-menu");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createGrid(option)
    new flagrate.Grid(option)
    - option (Object) - configuration for the grid.

    Create and initialize the grid.

    #### option

    * `id`                       (String): `id` attribute of container.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `cols`                     (Array): of col object.
    * `rows`                     (Array): of row object.
    * `pagination`               (Boolean; default `false`):
    * `numberOfRowsPerPage`      (Number; default `20`): pagination.
    * `fill`                     (Boolean; default `false`):
    * `headless`                 (Boolean; default `false`):
    * `multiSelect`              (Boolean; default `false`):
    * `disableCheckbox`          (Boolean; default `false`):
    * `disableSelect`            (Boolean; default `false`):
    * `disableSort`              (Boolean; default `false`):
    * `disableFilter`            (Boolean; default `false`):
    * `disableResize`            (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onDeselect`               (Function):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `onRender`                 (Function):
    * `onRendered`               (Function):
    * `postProcessOfRow`         (Function):

    #### col

    * `id`                       (String): `id` attribute of `th`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `th` (using flagrate.Element.setStyle)
    * `key`                      (String; required):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `align`                    (String):
    * `width`                    (Number):
    * `disableSort`              (Boolean; default `false`):
    * `disableResize`            (Boolean; default `false`):

    #### row

    * `id`                       (String): `id` attribute of `tr`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `tr` (using flagrate.Element.setStyle)
    * `cell`                     (Object|String; default `{}`): of cell object. or String for text.
    * `menuItems`                (Array): of Menu items.
    * `isSelected`               (Boolean):
    * `onSelect`                 (Function):
    * `onDeselect`               (Function):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `postProcess`              (Function):

    #### cell

    * `id`                       (String): `id` attribute of `td`
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): styling of `td` (using flagrate.Element.setStyle)
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `icon`                     (String):
    * `sortAlt`                  (Number|String):
    * `onClick`                  (Function):
    * `onDblClick`               (Function):
    * `postProcess`              (Function):
**/
var Grid = exports.Grid = function () {
    function Grid() {
        var _opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Grid);

        this._opt = _opt;
        this._cols = [];
        this._rows = [];
        this._pagePosition = 0;
        this._selectedRows = [];
        this._sortedByKey = null;
        this._sortedByAsc = null;
        this.element = new _element.Element("div", { "class": "flagrate flagrate-grid" });
        this._head = new _element.Element("div", { "class": "flagrate-grid-head" }).insertTo(this.element);
        this._thead = new _element.Element("thead").insertTo(new _element.Element("table").insertTo(this._head));
        this._tr = new _element.Element("tr").insertTo(this._thead);
        this._body = new _element.Element("div", { "class": "flagrate-grid-body" }).insertTo(this.element);
        this._tbody = new _element.Element("tbody").insertTo(new _element.Element("table").insertTo(this._body));
        this._style = new _element.Element("style").insertTo(this.element);
        this._id = "flagrate-grid-" + (++Grid.idCounter).toString(10);
        if (_opt.id) {
            this.element.writeAttribute("id", _opt.id);
        }
        if (_opt.className) {
            this.element.addClassName(_opt.className);
        }
        if (_opt.attribute) {
            this.element.writeAttribute(_opt.attribute);
        }
        if (_opt.style) {
            this.element.setStyle(_opt.style);
        }
        if (_opt.cols) {
            this._cols = _opt.cols;
        }
        if (_opt.rows) {
            this._rows = _opt.rows;
        }
        if (_opt.colMinWidth === undefined) {
            _opt.colMinWidth = 16;
        }
        if (_opt.pagination === undefined) {
            _opt.pagination = false;
        }
        if (!_opt.numberOfRowsPerPage) {
            _opt.numberOfRowsPerPage = 20;
        }
        if (_opt.fill === undefined) {
            _opt.fill = false;
        }
        if (_opt.headless === true) {
            _opt.disableSort = true;
            _opt.disableResize = true;
            this.element.addClassName("flagrate-grid-headless");
        }
        if (_opt.multiSelect === undefined) {
            _opt.multiSelect = false;
        }
        if (_opt.disableCheckbox === undefined) {
            _opt.disableCheckbox = false;
        }
        if (_opt.disableSelect === undefined) {
            _opt.disableSelect = false;
        }
        if (_opt.disableSort === undefined) {
            _opt.disableSort = false;
        }
        /* if (_opt.disableFilter === undefined) {
            _opt.disableFilter = false;
        } */
        if (_opt.disableResize === undefined) {
            _opt.disableResize = false;
        }
        this.onSelect = _opt.onSelect;
        this.onDeselect = _opt.onDeselect;
        this.onClick = _opt.onClick;
        this.onDblClick = _opt.onDblClick;
        this.onRender = _opt.onRender;
        this.onRendered = _opt.onRendered;
        this.postProcessOfRow = _opt.postProcessOfRow;
        this._create()._requestRender();
    }

    _createClass(Grid, [{
        key: "insertTo",
        value: function insertTo(element, pos) {
            return this.element.insertTo(element, pos) && this;
        }
    }, {
        key: "on",
        value: function on(eventType, listener, useCapture) {
            return this.element.on(eventType, listener, useCapture) && this;
        }
    }, {
        key: "off",
        value: function off(eventType, listener, useCapture) {
            return this.element.off(eventType, listener, useCapture) && this;
        }
    }, {
        key: "select",
        value: function select(a) {
            var _this = this;

            var rows = void 0;
            if (Array.isArray(a) === true) {
                rows = a;
            } else {
                rows = [];
                for (var i = 0, l = arguments.length; i < l; i++) {
                    rows.push(arguments[i]);
                }
            }
            if (this._opt.multiSelect === false) {
                this.deselectAll();
            }

            var _loop = function _loop(_i, _l) {
                var row = rows[_i];
                if (typeof row === "number") {
                    row = _this._rows[row];
                }
                row.isSelected = true;
                if (row._tr && row._tr.hasClassName("flagrate-grid-row-selected") === true) {
                    return "continue";
                }
                _this._selectedRows.push(row);
                if (row._tr) {
                    row._tr.addClassName("flagrate-grid-row-selected");
                }
                if (row._checkbox) {
                    row._checkbox.check();
                    setTimeout(function () {
                        if (row.isSelected === true) {
                            row._checkbox.check();
                        }
                    }, 0);
                }
                if (row.onSelect) {
                    row.onSelect.call(_this, window.event, row, _this);
                }
                if (_this.onSelect) {
                    _this.onSelect(window.event, row, _this);
                }
            };

            for (var _i = 0, _l = rows.length; _i < _l; _i++) {
                var _ret = _loop(_i, _l);

                if (_ret === "continue") continue;
            }
            if (this._selectedRows.length !== 0 && this._checkbox) {
                this._checkbox.check();
            }
            this.element.fire("change", { targetGrid: this });
            return this;
        }
    }, {
        key: "deselect",
        value: function deselect(a) {
            var _this2 = this;

            var rows = void 0;
            if (Array.isArray(a)) {
                rows = a;
            } else {
                rows = [];
                for (var i = 0, l = arguments.length; i < l; i++) {
                    rows.push(arguments[i]);
                }
            }

            var _loop2 = function _loop2(_i2, _l2) {
                var row = rows[_i2];
                if (typeof row === "number") {
                    row = _this2._rows[row];
                }
                row.isSelected = false;
                if (row._tr && row._tr.hasClassName("flagrate-grid-row-selected") === false) {
                    return "continue";
                }
                _this2._selectedRows.splice(_this2._selectedRows.indexOf(row), 1);
                if (row._tr) {
                    row._tr.removeClassName("flagrate-grid-row-selected");
                }
                if (row._checkbox) {
                    row._checkbox.uncheck();
                    setTimeout(function () {
                        if (row.isSelected === false) {
                            row._checkbox.uncheck();
                        }
                    }, 0);
                }
                if (row.onDeselect) {
                    row.onDeselect.call(_this2, window.event, row, _this2);
                }
                if (_this2.onDeselect) {
                    _this2.onDeselect(window.event, row, _this2);
                }
            };

            for (var _i2 = 0, _l2 = rows.length; _i2 < _l2; _i2++) {
                var _ret2 = _loop2(_i2, _l2);

                if (_ret2 === "continue") continue;
            }
            if (this._selectedRows.length === 0 && this._checkbox) {
                this._checkbox.uncheck();
            }
            this.element.fire("change", { targetGrid: this });
            return this;
        }
        /** select all rows */

    }, {
        key: "selectAll",
        value: function selectAll() {
            return this.select(this._rows);
        }
        /** deselect all rows */

    }, {
        key: "deselectAll",
        value: function deselectAll() {
            return this.deselect(this._rows);
        }
        /** get selected rows */

    }, {
        key: "getSelectedRows",
        value: function getSelectedRows() {
            return this._selectedRows;
        }
        /** get values of selected rows */

    }, {
        key: "getValues",
        value: function getValues() {
            return this._selectedRows.map(function (row) {
                return getValue.call(row);
            });
        }
        /** sort rows by key */

    }, {
        key: "sort",
        value: function sort(key, isAsc) {
            if (isAsc === undefined) {
                isAsc = true;
            }
            this._rows.sort(function (a, b) {
                var A = 0;
                var B = 0;
                var cellA = a.cell[key];
                var cellB = b.cell[key];
                if ((typeof cellA === "undefined" ? "undefined" : _typeof(cellA)) === "object") {
                    A = cellA.sortAlt !== undefined ? cellA.sortAlt : cellA.text || cellA.html || cellA.element && cellA.element.innerHTML || cellA._div && cellA._div.innerHTML || 0;
                } else {
                    A = cellA || 0;
                }
                if ((typeof cellB === "undefined" ? "undefined" : _typeof(cellB)) === "object") {
                    B = cellB.sortAlt !== undefined ? cellB.sortAlt : cellB.text || cellB.html || cellB.element && cellB.element.innerHTML || cellB._div && cellB._div.innerHTML || 0;
                } else {
                    B = cellB || 0;
                }
                return A === B ? 0 : A > B ? 1 : -1;
            });
            if (isAsc === false) {
                this._rows.reverse();
            }
            for (var i = 0, l = this._cols.length; i < l; i++) {
                if (this._cols[i].key === key) {
                    if (isAsc) {
                        this._cols[i]._th.addClassName("flagrate-grid-col-sorted-asc");
                        this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-desc");
                    } else {
                        this._cols[i]._th.addClassName("flagrate-grid-col-sorted-desc");
                        this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-asc");
                    }
                    this._cols[i].isSorted = true;
                    this._cols[i].isAsc = isAsc;
                    this._sortedByKey = key;
                    this._sortedByAsc = isAsc;
                } else {
                    if (this._cols[i].isSorted) {
                        this._cols[i]._th.removeClassName("flagrate-grid-col-sorted-asc").removeClassName("flagrate-grid-col-sorted-desc");
                    }
                    this._cols[i].isSorted = false;
                    this._cols[i].isAsc = null;
                }
            }
            this._requestRender();
            return this;
        }
    }, {
        key: "unshift",
        value: function unshift(r) {
            if (Array.isArray(r) === true) {
                for (var i = 0, l = r.length; i < l; i++) {
                    this._rows.unshift(r[i]);
                }
            } else {
                this._rows.unshift(r);
            }
            if (this._sortedByKey === null) {
                this._requestRender();
            } else {
                this.sort(this._sortedByKey, this._sortedByAsc);
            }
            return this._rows.length;
        }
    }, {
        key: "push",
        value: function push(r) {
            if (Array.isArray(r) === true) {
                for (var i = 0, l = r.length; i < l; i++) {
                    this._rows.push(r[i]);
                }
            } else {
                this._rows.push(r);
            }
            if (this._sortedByKey === null) {
                this._requestRender();
            } else {
                this.sort(this._sortedByKey, this._sortedByAsc);
            }
            return this._rows.length;
        }
    }, {
        key: "shift",
        value: function shift(c) {
            var count = c || 1;
            var removes = [];
            for (var i = 0, l = this._rows.length; i < l && i < count; i++) {
                removes.push(this._rows.shift());
            }
            this._requestRender();
            return !c ? removes[0] : removes;
        }
    }, {
        key: "pop",
        value: function pop(c) {
            var count = c || 1;
            var removes = [];
            for (var i = 0, l = this._rows.length; i < l && i < count; i++) {
                removes.push(this._rows.pop());
            }
            this._requestRender();
            return !c ? removes[0] : removes;
        }
    }, {
        key: "splice",
        value: function splice(index, c, r) {
            c = typeof c === "undefined" ? this._rows.length - index : c;
            var removes = this._rows.splice(index, c);
            if (r) {
                if (r instanceof Array === false) {
                    r = [r];
                }
                for (var i = 0, l = r.length; i < l; i++) {
                    this._rows.splice(index + i, 0, r[i]);
                }
            }
            if (this._sortedByKey === null) {
                this._requestRender();
            } else {
                this.sort(this._sortedByKey, this._sortedByAsc);
            }
            return removes;
        }
    }, {
        key: "indexOf",
        value: function indexOf(row, fromIndex) {
            return this._rows.indexOf(row, fromIndex);
        }
    }, {
        key: "removeRow",
        value: function removeRow(r) {
            var removes = [];
            var bulk = true;
            if (r instanceof Array === false) {
                bulk = false;
                r = [r];
            }
            for (var i = 0, l = r.length; i < l; i++) {
                var index = this.indexOf(r[i]);
                if (index !== -1) {
                    removes.push(this.splice(index, 1));
                }
            }
            return bulk ? removes : removes[0];
        }
    }, {
        key: "disable",
        value: function disable() {
            this.element.addClassName("flagrate-disabled");
            return this;
        }
    }, {
        key: "enable",
        value: function enable() {
            this.element.removeClassName("flagrate-disabled");
            return this;
        }
    }, {
        key: "isEnabled",
        value: function isEnabled() {
            return !this.element.hasClassName("flagrate-disabled");
        }
    }, {
        key: "_create",
        value: function _create() {
            var _this3 = this;

            if (this._opt.disableCheckbox === false && this._opt.disableSelect === false && this._opt.multiSelect === true) {
                this._checkbox = new _checkbox.Checkbox({
                    onCheck: this.selectAll.bind(this),
                    onUncheck: this.deselectAll.bind(this)
                }).insertTo(new _element.Element("th", { "class": "flagrate-grid-cell-checkbox" }).insertTo(this._tr));
            }
            for (var i = 0, l = this._cols.length; i < l; i++) {
                var col = this._cols[i];
                col._id = this._id + "-col-" + col.key;
                col._th = new _element.Element("th").insertTo(this._tr);
                if (col.id) {
                    col._th.writeAttribute("id", col.id);
                }
                if (col.className) {
                    col._th.writeAttribute("class", col.className);
                }
                if (col.attribute) {
                    col._th.writeAttribute(col.attribute);
                }
                if (col.style) {
                    col._th.setStyle(col.style);
                }
                col._th.addClassName(col._id);
                var width = !!col.width ? col.width.toString(10) + "px" : "auto";
                this._style.insertText("." + col._id + "{width:" + width + "}");
                if (col.align) {
                    col._th.style.textAlign = col.align;
                }
                col._div = new _element.Element().insertTo(col._th);
                if (col.label) {
                    col._div.updateText(col.label);
                }
                if (col.icon) {
                    col._div.addClassName("flagrate-icon");
                    col._div.setStyle({
                        backgroundImage: "url(" + col.icon + ")"
                    });
                }
                if (this._opt.disableResize === false && !col.disableResize) {
                    col._resizeHandle = new _element.Element("div", {
                        "class": "flagrate-grid-col-resize-handle"
                    }).insertTo(this.element);
                    col._resizeHandle.onmousedown = this._createResizeHandleOnMousedownHandler(col);
                }
                if (this._opt.disableSort === false && !col.disableSort) {
                    col._th.addClassName("flagrate-grid-col-sortable");
                    col._th.onclick = this._createColOnClickHandler(col);
                }
            }
            this._lastCol = new _element.Element("th", { "class": this._id + "-col-last" }).insertTo(this._tr);
            this._style.insertText("." + this._id + "-col-last:after{right:0}");
            // pagination (testing)
            if (this._opt.pagination) {
                this.element.addClassName("flagrate-grid-pagination");
                // pager container
                this._pager = new _toolbar.Toolbar({
                    className: "flagrate-grid-pager",
                    items: [{
                        key: "rn",
                        element: new _element.Element("span").insertText("-")
                    }, {
                        key: "first",
                        element: new _button.Button({
                            className: "flagrate-grid-pager-first",
                            onSelect: function onSelect() {
                                _this3._pagePosition = 0;
                                _this3._requestRender();
                            }
                        })
                    }, {
                        key: "prev",
                        element: new _button.Button({
                            className: "flagrate-grid-pager-prev",
                            onSelect: function onSelect() {
                                --_this3._pagePosition;
                                _this3._requestRender();
                            }
                        })
                    }, {
                        key: "num",
                        element: new _element.Element("span", { "class": "flagrate-grid-pager-num" }).insertText("-")
                    }, {
                        key: "next",
                        element: new _button.Button({
                            className: "flagrate-grid-pager-next",
                            onSelect: function onSelect() {
                                ++_this3._pagePosition;
                                _this3._requestRender();
                            }
                        })
                    }, {
                        key: "last",
                        element: new _button.Button({
                            className: "flagrate-grid-pager-last",
                            onSelect: function onSelect() {
                                _this3._pagePosition = Math.floor(_this3._rows.length / _this3._opt.numberOfRowsPerPage);
                                _this3._requestRender();
                            }
                        })
                    }]
                }).insertTo(this.element);
            }
            if (this._opt.fill) {
                this.element.addClassName("flagrate-grid-fill");
                this._body.onscroll = this._createBodyOnScrollHandler();
            } else {
                this.element.onscroll = this._createOnScrollHandler();
            }
            if (this._opt.disableResize === false) {
                this._layoutUpdater();
            }
            return this;
        }
    }, {
        key: "_layoutUpdater",
        value: function _layoutUpdater() {
            var _this4 = this;

            if (this._layoutInterval) {
                clearInterval(this._layoutInterval);
            }
            this._layoutInterval = setInterval(function () {
                if (_this4.element.exists() === false) {
                    clearInterval(_this4._layoutInterval);
                    return;
                }
                _this4._requestUpdateLayout();
            }, 1000);
        }
    }, {
        key: "_requestUpdateLayout",
        value: function _requestUpdateLayout() {
            var _this5 = this;

            if (this._layoutWidth === this.element.clientWidth) {
                return;
            }
            if (this._layoutTimer) {
                clearTimeout(this._layoutTimer);
            }
            this._layoutTimer = setTimeout(function () {
                _this5._layoutWidth = _this5.element.clientWidth;
                _this5._updateLayoutOfCols();
                _this5._updatePositionOfResizeHandles();
            }, 0);
        }
    }, {
        key: "_requestRender",
        value: function _requestRender() {
            if (this._renderTimer) {
                clearTimeout(this._renderTimer);
            }
            this._renderTimer = setTimeout(this._render.bind(this), 0);
            return this;
        }
    }, {
        key: "_render",
        value: function _render() {
            if (!!this.onRender && this.onRender(this) === false) {
                return this;
            }
            var isCheckable = this._opt.disableCheckbox === false && this._opt.disableSelect === false && this._opt.multiSelect === true;
            var i = void 0,
                j = void 0,
                row = void 0,
                col = void 0,
                cell = void 0,
                pl = void 0,
                pages = void 0,
                from = void 0,
                to = void 0;
            var rl = this._rows.length;
            var cl = this._cols.length;
            if (this._opt.pagination) {
                pl = 0;
                pages = Math.ceil(rl / this._opt.numberOfRowsPerPage);
                if (pages <= this._pagePosition) {
                    this._pagePosition = pages - 1;
                }
                if (this._pagePosition <= 0) {
                    this._pagePosition = 0;
                }
                from = this._pagePosition * this._opt.numberOfRowsPerPage;
                to = from + this._opt.numberOfRowsPerPage;
            }
            this._tbody.update();
            for (i = 0; i < rl; i++) {
                if (this._opt.pagination) {
                    if (i < from) {
                        continue;
                    }
                    if (i >= to) {
                        break;
                    }
                    ++pl;
                }
                row = this._rows[i];
                if (row._tr) {
                    row._tr.insertTo(this._tbody);
                    continue;
                }
                // init row
                row._grid = this;
                row._tr = new _element.Element("tr").insertTo(this._tbody);
                if (row.id) {
                    row._tr.id = row.id;
                }
                if (row.className) {
                    row._tr.className = row.className;
                }
                if (row.attribute) {
                    row._tr.writeAttribute(row.attribute);
                }
                if (row.style) {
                    row._tr.setStyle(row.style);
                }
                if (row.onClick || this.onClick || this._opt.disableSelect === false) {
                    if (this._opt.disableSelect === false) {
                        row._tr.addClassName("flagrate-grid-row-selectable");
                    }
                    if (row.onClick || this.onClick) {
                        row._tr.addClassName("flagrate-grid-row-clickable");
                    }
                    row._tr.onclick = this._createRowOnClickHandler(row);
                }
                if (row.onDblClick || this.onDblClick) {
                    row._tr.ondblclick = this._createRowOnDblClickHandler(row);
                }
                if (isCheckable && !row._checkbox) {
                    row._checkbox = new _checkbox.Checkbox({
                        onChange: this._createRowOnCheckHandler(row)
                    }).insertTo(new _element.Element("td", { "class": "flagrate-grid-cell-checkbox" }).insertTo(row._tr));
                }
                if (row.isSelected === true) {
                    this.select(row);
                }
                for (j = 0; j < cl; j++) {
                    col = this._cols[j];
                    cell = row.cell[col.key] === undefined ? row.cell[col.key] = {} : row.cell[col.key];
                    if (typeof cell === "string" || typeof cell === "number") {
                        cell = row.cell[col.key] = { text: cell };
                    }
                    if (cell._td) {
                        cell._td.insertTo(row._tr);
                        continue;
                    }
                    // init cell
                    cell._td = new _element.Element("td").insertTo(row._tr);
                    if (cell.id) {
                        cell._td.id = cell.id;
                    }
                    if (cell.className) {
                        cell._td.className = cell.className;
                    }
                    if (cell.attribute) {
                        cell._td.writeAttribute(cell.attribute);
                    }
                    if (cell.style) {
                        cell._td.setStyle(cell.style);
                    }
                    if (col.align) {
                        cell._td.style.textAlign = col.align;
                    }
                    cell._td.addClassName(col._id);
                    // init cell content
                    cell._div = new _element.Element().insertTo(cell._td);
                    if (cell.text !== undefined) {
                        cell._div.updateText(cell.text);
                    }
                    if (cell.html) {
                        cell._div.update(cell.html);
                    }
                    if (cell.element) {
                        cell._div.update(cell.element);
                    }
                    if (cell.icon) {
                        cell._div.addClassName("flagrate-icon");
                        cell._div.style.backgroundImage = "url(" + cell.icon + ")";
                    }
                    if (cell.onClick) {
                        cell._td.addClassName("flagrate-grid-cell-clickable");
                        cell._td.onclick = this._createCellOnClickHandler(cell);
                    }
                    if (cell.onDblClick) {
                        cell._td.ondblclick = this._createCellOnDblClickHandler(cell);
                    }
                    // redefine props
                    Object.defineProperties(cell, cellProps);
                    // post-processing
                    if (cell.postProcess) {
                        cell.postProcess.call(this, cell._td, cell, this);
                    }
                }
                if (!row._last) {
                    row._last = new _element.Element("td", { "class": this._id + "-col-last" });
                }
                row._last.insertTo(row._tr);
                // menu
                if (row.menuItems) {
                    this._updateRowMenu(row, row.menuItems);
                }
                // redefine props
                Object.defineProperties(row, rowProps);
                // post-processing
                if (row.postProcess) {
                    row.postProcess.call(this, row._tr, row, this);
                }
                if (this.postProcessOfRow) {
                    this.postProcessOfRow(row._tr, row, this);
                }
            } //<--for
            if (this._opt.pagination) {
                this._pager.getElementByKey("rn").updateText(from + 1 + " - " + (from + pl) + " / " + rl);
                this._pager.getElementByKey("num").updateText(this._pagePosition + 1 + " / " + pages);
            }
            if (this._opt.disableResize === false) {
                if (this._opt.fill) {
                    this._head.style.right = this._body.offsetWidth - this._body.clientWidth + "px";
                    this._head.scrollLeft = this._body.scrollLeft;
                }
                this._requestUpdateLayout();
            }
            if (this.onRendered) {
                this.onRendered(this);
            }
            return this;
        }
    }, {
        key: "_updateRowMenu",
        value: function _updateRowMenu(row, items) {
            if (row._menu) {
                row._menu.remove();
                delete row._menu;
            }
            if (items && items.length !== 0) {
                row._last.addClassName("flagrate-grid-cell-menu");
                row._menu = new _contextMenu.ContextMenu({
                    target: row._tr,
                    items: items
                });
                if (!row._last.onclick) {
                    row._last.onclick = row._grid._createLastRowOnClickHandler(row);
                }
            } else {
                row._last.removeClassName("flagrate-grid-cell-menu");
            }
        }
    }, {
        key: "_updatePositionOfResizeHandles",
        value: function _updatePositionOfResizeHandles() {
            var adj = this._opt.fill ? -this._body.scrollLeft : 0;
            var col = void 0;
            for (var i = 0, l = this._cols.length; i < l; i++) {
                col = this._cols[i];
                if (col._resizeHandle) {
                    col._resizeHandle.style.left = col._th.offsetLeft + col._th.getWidth() + adj + "px";
                }
            }
        }
    }, {
        key: "_updateLayoutOfCols",
        value: function _updateLayoutOfCols(surplus) {
            var _this6 = this;

            var fixed = true;
            var minimized = 0;
            var col = void 0;
            for (var i = 0, l = this._cols.length; i < l; i++) {
                col = this._cols[i];
                if (col.width) {
                    continue;
                }
                var width = "auto";
                var minWidth = col.minWidth === undefined ? this._opt.colMinWidth : col.minWidth;
                if (surplus) {
                    width = surplus + "px";
                } else if (minWidth >= col._th.getWidth()) {
                    width = minWidth + "px";
                    ++minimized;
                } else {
                    fixed = false;
                }
                this._style.updateText(this._style.innerHTML.replace(new RegExp("(" + col._id + "{width:)([^}]*)}"), "$1" + width + "}"));
            }
            if (fixed) {
                this.element.addClassName("flagrate-grid-fixed");
            } else {
                this.element.removeClassName("flagrate-grid-fixed");
            }
            setTimeout(function () {
                var base = _this6._opt.fill ? _this6._body : _this6.element;
                _this6._style.updateText(_this6._style.innerHTML.replace(new RegExp("(" + _this6._id + "-col-last:after{right:)([^}]*)}"), "$1" + (base.scrollWidth - base.clientWidth - base.scrollLeft) + "px!important}"));
                var _surplus = _this6._lastCol.getWidth();
                if (fixed && !surplus && _surplus && minimized) {
                    _this6._updateLayoutOfCols(Math.floor(_surplus / minimized));
                }
            }, 0);
        }
    }, {
        key: "_createOnScrollHandler",
        value: function _createOnScrollHandler() {
            var _this7 = this;

            return function (e) {
                if (_this7._opt.disableResize === false) {
                    _this7._updateLayoutOfCols();
                }
            };
        }
    }, {
        key: "_createBodyOnScrollHandler",
        value: function _createBodyOnScrollHandler() {
            var _this8 = this;

            return function (e) {
                _this8._head.style.right = _this8._body.offsetWidth - _this8._body.clientWidth + "px";
                _this8._head.scrollLeft = _this8._body.scrollLeft;
                if (_this8._opt.disableResize === false) {
                    _this8._updateLayoutOfCols();
                    _this8._updatePositionOfResizeHandles();
                }
            };
        }
    }, {
        key: "_createColOnClickHandler",
        value: function _createColOnClickHandler(col) {
            var _this9 = this;

            return function (e) {
                _this9.sort(col.key, !col.isAsc);
            };
        }
    }, {
        key: "_createRowOnClickHandler",
        value: function _createRowOnClickHandler(row) {
            var _this10 = this;

            return function (e) {
                if (/firefox/i.test(navigator.userAgent) === true) {
                    window.event = e;
                }
                if (_this10.isEnabled() === false) {
                    return;
                }
                if (row.onClick) {
                    row.onClick.call(_this10, e, row, _this10);
                }
                if (_this10.onClick) {
                    _this10.onClick(e, row, _this10);
                }
                if (_this10._opt.disableSelect === false) {
                    if (row.isSelected === true) {
                        _this10.deselect(row);
                    } else {
                        _this10.select(row);
                    }
                }
                if (row._checkbox) {
                    row._checkbox.focus();
                }
                return false;
            };
        }
    }, {
        key: "_createRowOnDblClickHandler",
        value: function _createRowOnDblClickHandler(row) {
            var _this11 = this;

            return function (e) {
                if (/firefox/i.test(navigator.userAgent) === true) {
                    window.event = e;
                }
                if (_this11.isEnabled() === false) {
                    return;
                }
                if (row.onDblClick) {
                    row.onDblClick.call(_this11, e, row, _this11);
                }
                if (_this11.onDblClick) {
                    _this11.onDblClick(e, row, _this11);
                }
            };
        }
    }, {
        key: "_createCellOnClickHandler",
        value: function _createCellOnClickHandler(cell) {
            var _this12 = this;

            return function (e) {
                if (_this12.isEnabled() === false) {
                    return;
                }
                if (cell.onClick) {
                    cell.onClick.call(_this12, e, cell, _this12);
                }
            };
        }
    }, {
        key: "_createCellOnDblClickHandler",
        value: function _createCellOnDblClickHandler(cell) {
            var _this13 = this;

            return function (e) {
                if (_this13.isEnabled() === false) {
                    return;
                }
                if (cell.onDblClick) {
                    cell.onDblClick.call(_this13, e, cell, _this13);
                }
            };
        }
    }, {
        key: "_createRowOnCheckHandler",
        value: function _createRowOnCheckHandler(row) {
            var _this14 = this;

            return function (e) {
                if (_this14.isEnabled() === false) {
                    if (e.targetCheckbox.isChecked() === true) {
                        e.targetCheckbox.uncheck();
                    } else {
                        e.targetCheckbox.check();
                    }
                    return;
                }
                if (_this14._opt.disableSelect === false) {
                    if (row._checkbox.isChecked() === true) {
                        _this14.select(row);
                    } else {
                        _this14.deselect(row);
                    }
                }
            };
        }
    }, {
        key: "_createLastRowOnClickHandler",
        value: function _createLastRowOnClickHandler(row) {
            var _this15 = this;

            return function (e) {
                if (_this15.isEnabled() === false) {
                    return;
                }
                e.stopPropagation();
                if (row._menu) {
                    row._menu.open(e);
                }
            };
        }
    }, {
        key: "_createResizeHandleOnMousedownHandler",
        value: function _createResizeHandleOnMousedownHandler(col) {
            var _this16 = this;

            return function (e) {
                //e.stopPropagation();
                e.preventDefault();
                var current = e.clientX;
                var origin = current;
                var onMove = function onMove(e) {
                    e.preventDefault();
                    var delta = e.clientX - current;
                    current += delta;
                    col._resizeHandle.style.left = parseInt(col._resizeHandle.style.left.replace("px", ""), 10) + delta + "px";
                };
                var onUp = function onUp(e) {
                    e.preventDefault();
                    document.removeEventListener("mousemove", onMove, true);
                    document.removeEventListener("mouseup", onUp, true);
                    var minWidth = col.minWidth === undefined ? _this16._opt.colMinWidth : col.minWidth;
                    var delta = e.clientX - origin;
                    var width = col._th.getWidth() + delta;
                    width = col.width = Math.max(width, minWidth);
                    _this16._style.updateText(_this16._style.innerHTML.replace(new RegExp("(" + col._id + "{width:)([^}]*)}"), "$1" + width + "px}"));
                    _this16._updateLayoutOfCols();
                    _this16._updatePositionOfResizeHandles();
                };
                document.addEventListener("mousemove", onMove, true);
                document.addEventListener("mouseup", onUp, true);
            };
        }
    }, {
        key: "headless",
        get: function get() {
            return this.element.hasClassName("flagrate-grid-headless");
        },
        set: function set(enable) {
            if (enable) {
                this.element.addClassName("flagrate-grid-headless");
            } else {
                this.element.removeClassName("flagrate-grid-headless");
            }
        }
    }, {
        key: "fill",
        get: function get() {
            return this.element.hasClassName("flagrate-grid-fill");
        },
        set: function set(enable) {
            if (enable) {
                this.element.addClassName("flagrate-grid-fill");
                this._body.onscroll = this._createBodyOnScrollHandler();
            } else {
                this.element.removeClassName("flagrate-grid-fill");
                this.element.onscroll = this._createOnScrollHandler();
            }
            this._requestRender();
        }
    }, {
        key: "rows",
        get: function get() {
            return this._rows;
        },
        set: function set(rows) {
            this._rows = rows;
            this._requestRender();
        }
    }, {
        key: "sortedByKey",
        get: function get() {
            return this._sortedByKey;
        }
    }, {
        key: "sortedByAsc",
        get: function get() {
            return this._sortedByAsc;
        }
    }, {
        key: "selectedRows",
        get: function get() {
            return this.getSelectedRows();
        },
        set: function set(rows) {
            this.select(rows);
        }
    }]);

    return Grid;
}();

Grid.idCounter = 0;
function createGrid(a) {
    return new Grid(a);
}
/** get value of row */
function getValue() {
    var row = this;
    if (row.value !== undefined) {
        return row.value;
    }
    var ret = {};
    for (var key in row.cell) {
        if (_typeof(row.cell[key]) === "object" && row.cell[key].value !== undefined) {
            ret[key] = row.cell[key].value;
        }
    }
    return ret;
}
var hiddenProp = { enumerable: false };
var rowProps = {
    _checkbox: hiddenProp,
    _grid: hiddenProp,
    _last: hiddenProp,
    _menu: hiddenProp,
    _tr: hiddenProp,
    className: hiddenProp,
    attribute: hiddenProp,
    style: hiddenProp,
    postProcess: hiddenProp,
    tr: {
        enumerable: true,
        get: function get() {
            return this._tr;
        }
    },
    id: {
        enumerable: true,
        get: function get() {
            return this._tr.id || undefined;
        },
        set: function set(id) {
            this._tr.id = id;
        }
    },
    menuItems: {
        enumerable: true,
        get: function get() {
            if (this._menu) {
                return this._menu.items;
            }
        },
        set: function set(items) {
            this._grid._updateRowMenu(this, items);
        }
    }
};
var cellProps = {
    _td: hiddenProp,
    _div: hiddenProp,
    className: hiddenProp,
    attribute: hiddenProp,
    style: hiddenProp,
    postProcess: hiddenProp,
    td: {
        enumerable: true,
        get: function get() {
            return this._td;
        }
    },
    div: {
        enumerable: true,
        get: function get() {
            return this._div;
        }
    },
    id: {
        enumerable: true,
        get: function get() {
            return this._td.id || undefined;
        },
        set: function set(id) {
            this._td.id = id;
        }
    },
    align: {
        enumerable: true,
        get: function get() {
            return this._td.style.textAlign || undefined;
        },
        set: function set(align) {
            this._td.style.textAlign = align;
        }
    },
    text: {
        enumerable: false,
        get: function get() {
            return this._div.innerText;
        },
        set: function set(text) {
            this._div.updateText(text);
        }
    },
    html: {
        enumerable: false,
        get: function get() {
            return this._div.innerHTML;
        },
        set: function set(html) {
            this._div.update(html);
        }
    },
    element: {
        enumerable: false,
        get: function get() {
            return this._div.firstChild;
        },
        set: function set(element) {
            this._div.update(element);
        }
    },
    icon: {
        enumerable: true,
        get: function get() {
            return this._div.style.backgroundImage.replace(/(.*url\()([^)]+)(\).*)/, "$2") || undefined;
        },
        set: function set(url) {
            var cell = this;
            if (url) {
                cell._div.addClassName("flagrate-icon");
                cell._div.style.backgroundImage = "url(" + url + ")";
            } else {
                cell._div.removeClassName("flagrate-icon");
                cell._div.style.backgroundImage = "";
            }
        }
    }
};



},{"./button":9,"./checkbox":11,"./context-menu":14,"./element":15,"./toolbar":34}],18:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;
exports.createMenu = createMenu;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var button = _interopRequireWildcard(_button);

var _buttons = require("./buttons");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*?
    flagrate.createMenu(option)
    new flagrate.Menu(option)
    - option (Object) - options.

    Menu.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `items`                    (Array): of item
    * `onSelect`                 (Function):

    #### item

    * `key`                      (String):
    * `label`                    (String; default `""`):
    * `icon`                     (String):
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
**/
function FMenu() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    option.items = option.items || [];
    this.onSelect = option.onSelect || _util.emptyFunction;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    // create a container
    var container = new _element.Element("div", attr);
    (0, _util.extendObject)(container, this);
    container.addClassName("flagrate flagrate-menu");
    if (option.className) {
        container.addClassName(option.className);
    }
    if (option.style) {
        container.setStyle(option.style);
    }
    for (var i = 0, l = option.items.length; i < l; i++) {
        container.push(option.items[i]);
    }
    container.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    container.addEventListener("mouseup", function (e) {
        e.stopPropagation();
    });
    return container;
}
var Menu = exports.Menu = FMenu;
function createMenu(option) {
    return new Menu(option);
}
Menu.prototype = {
    push: function push(option) {
        var _this = this;

        if (typeof option === "string") {
            new _element.Element("hr").insertTo(this);
        } else {
            var _onSelect = option.onSelect;
            option.onSelect = function (e, button) {
                if (_onSelect) {
                    _onSelect.call(button, e, button);
                }
                _this.onSelect(e, _this);
            };
            var btn = new button.Button(option).insertTo(this);
            if (option.key) {
                btn.dataset["_key"] = option.key;
            }
        }
        return this;
    },

    getButtonByKey: _buttons.Buttons.prototype.getButtonByKey,
    getButtons: _buttons.Buttons.prototype.getButtons
};



},{"./button":9,"./buttons":10,"./element":15,"./util":36}],19:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Modal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createModal = createModal;

var _element = require("./element");

var _button = require("./button");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createModal(option)
    new flagrate.Modal(option)
    - option (Object) - configuration for the modal.

    Create and initialize the modal.

    #### option

    * `target`                   (Element; default `document.body`):
    * `id`                       (String):
    * `className`                (String):
    * `title`                    (String):
    * `subtitle`                 (String):
    * `text`                     (String):
    * `html`                     (String):
    * `element`                  (Element):
    * `href`                     (String):
    * `buttons`                  (Array): of button object.
    * `sizing`                   (String;  default `"flex"`; `"flex"` | `"full"`):
    * `onBeforeClose`            (Function):
    * `onClose`                  (Function):
    * `onShow`                   (Function):
    * `disableCloseButton`       (Boolean; default `false`):
    * `disableCloseByMask`       (Boolean; default `false`):
    * `disableCloseByEsc`        (Boolean; default `false`):

    #### button

    * `key`                      (String):
    * `label`                    (String; required):
    * `icon`                     (String):
    * `color`                    (String):
    * `onSelect`                 (Function):
    * `isFocused`                (Boolean; default `false`):
    * `isDisabled`               (Boolean; default `false`):
    * `className`                (String):
**/
var Modal = exports.Modal = function () {
    function Modal() {
        var _opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Modal);

        this._opt = _opt;
        this._buttons = [];
        this._close = this.close.bind(this);
        this.__onKeydownHandler = this._onKeydownHandler.bind(this);
        if (!_opt.target) {
            _opt.target = document.body;
        }
        if (!_opt.sizing) {
            _opt.sizing = "flex";
        }
        if (_opt.disableCloseButton === undefined) {
            _opt.disableCloseButton = false;
        }
        if (_opt.disableCloseByMask === undefined) {
            _opt.disableCloseByMask = false;
        }
        if (_opt.disableCloseByEsc === undefined) {
            _opt.disableCloseByEsc = false;
        }
        if (_opt["description"]) {
            // description has deprecated but no schedule to remove.
            this._opt.subtitle = _opt["description"];
        }
        if (_opt.buttons) {
            this._buttons = _opt.buttons;
        }
        if (_opt.onBeforeClose) {
            this.onBeforeClose = _opt.onBeforeClose;
        }
        if (_opt.onClose) {
            this.onClose = _opt.onClose;
        }
        if (_opt.onShow) {
            this.onShow = _opt.onShow;
        }
        if (this._buttons.length === 0) {
            this._buttons = [{
                label: "OK",
                color: "@primary",
                onSelect: this._close,
                isFocused: true
            }];
        }
        this._create();
    }

    _createClass(Modal, [{
        key: "setId",
        value: function setId(id) {
            this._container.id = id;
            return this;
        }
    }, {
        key: "setClassName",
        value: function setClassName(className) {
            this._container.className = className;
            return this;
        }
    }, {
        key: "setContent",
        value: function setContent(div) {
            this._opt.content = div;
            this._middle.update(div);
            return this;
        }
    }, {
        key: "setSizing",
        value: function setSizing(sizing) {
            this._container.removeClassName("flagrate-sizing-" + this._opt.sizing);
            this._container.addClassName("flagrate-sizing-" + sizing);
            this._opt.sizing = sizing;
            return this;
        }
    }, {
        key: "setElement",
        value: function setElement(element) {
            this._opt.element = element;
            this._content.update(element);
            return this;
        }
    }, {
        key: "setHTML",
        value: function setHTML(html) {
            this._opt.html = html;
            this._content.update(html);
            return this;
        }
    }, {
        key: "setText",
        value: function setText(text) {
            this._opt.text = text;
            this._content.updateText(text);
            return this;
        }
    }, {
        key: "setTitle",
        value: function setTitle(title) {
            this._opt.title = title;
            this._title.updateText(title);
            return this;
        }
    }, {
        key: "setSubtitle",
        value: function setSubtitle(subtitle) {
            this._opt.subtitle = subtitle;
            this._subtitle.updateText(subtitle);
            return this;
        }
    }, {
        key: "visible",
        value: function visible() {
            return this._container.hasClassName("flagrate-modal-visible");
        }
    }, {
        key: "open",
        value: function open() {
            var _this = this;

            if (this.visible() === true) {
                return this;
            }
            // make free
            if (document.activeElement && document.activeElement["blur"]) {
                document.activeElement.blur();
            }
            window.getSelection().removeAllRanges();
            if (this._closingTimer) {
                clearTimeout(this._closingTimer);
            }
            _element.Element.insert(this._opt.target, this._container);
            setTimeout(function () {
                return _this._container.addClassName("flagrate-modal-visible");
            }, 0);
            // Callback: onShow
            if (this.onShow) {
                this.onShow(this);
            }
            this._positioning();
            // focus to primary button
            if (this._buttons[0]) {
                this._buttons[0]._button.focus();
            }
            window.addEventListener("keydown", this.__onKeydownHandler, true);
            return this;
        }
        /** DEPRECATED */

    }, {
        key: "show",
        value: function show() {
            return this.open();
        }
        /** DEPRECATED */

    }, {
        key: "render",
        value: function render() {
            return this.open();
        }
    }, {
        key: "close",
        value: function close(e) {
            var _this2 = this;

            if (this.visible() === false) {
                return this;
            }
            this._container.removeClassName("flagrate-modal-visible");
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            // Callback: onBeforeClose
            if (this.onBeforeClose) {
                if (this.onBeforeClose(this, e) === false) {
                    return this; //abort closing
                }
            }
            clearTimeout(this._positioningTimer);
            this._closingTimer = setTimeout(function () {
                return _this2._container.remove();
            }, 1000);
            window.removeEventListener("keydown", this.__onKeydownHandler, true);
            // Callback: onClose
            if (this.onClose) {
                this.onClose(this, e);
            }
            return this;
        }
    }, {
        key: "getButtonByKey",
        value: function getButtonByKey(key) {
            var result = null;
            var buttons = this._buttons;
            for (var i = 0; i < buttons.length; i++) {
                if (!buttons[i].key) {
                    continue;
                }
                if (buttons[i].key === key) {
                    result = buttons[i]._button;
                    break;
                }
            }
            return result;
        }
    }, {
        key: "getButtons",
        value: function getButtons() {
            return this._buttons.map(function (button) {
                return button._button;
            });
        }
    }, {
        key: "setButtons",
        value: function setButtons(buttons) {
            this._buttons = buttons;
            this._createButtons();
            return this;
        }
    }, {
        key: "_create",
        value: function _create() {
            this._createBase();
            this._createModal();
            this._createButtons();
        }
    }, {
        key: "_createBase",
        value: function _createBase() {
            this._container = new _element.Element("div", {
                id: this._opt.id,
                "class": "flagrate flagrate-modal flagrate-sizing-" + this._opt.sizing
            });
            if (this._opt.className) {
                this._container.addClassName(this._opt.className);
            }
            if (this._opt.target !== document.body) {
                this._container.style.position = "absolute";
            }
            this._obi = new _element.Element().insertTo(this._container);
            if (this._opt.disableCloseByMask === false) {
                this._container.addEventListener("click", this._close);
            }
        }
    }, {
        key: "_createModal",
        value: function _createModal() {
            this._modal = new _element.Element().insertTo(this._obi);
            this._modal.addEventListener("click", function (e) {
                return e.stopPropagation();
            });
            this._closeButton = new _button.Button({
                label: "",
                onSelect: this._close
            });
            if (this._opt.disableCloseButton === false) {
                this._closeButton.insertTo(this._modal);
            }
            this._header = new _element.Element("hgroup").insertTo(this._modal);
            this._title = new _element.Element("h1").insertText(this._opt.title || "").insertTo(this._header);
            this._subtitle = new _element.Element("small").insertText(this._opt.subtitle || "").insertTo(this._header);
            this._middle = new _element.Element().insertTo(this._modal);
            if (this._opt.content) {
                this._middle.insert(this._opt.content);
            } else {
                this._content = new _element.Element().insertTo(this._middle);
                if (this._opt.element) {
                    this._content.insert(this._opt.element);
                } else if (this._opt.html) {
                    this._content.insert(this._opt.html);
                } else if (this._opt.text) {
                    this._content.insertText(this._opt.text);
                }
            }
            this._footer = new _element.Element("footer").insertTo(this._modal);
        }
    }, {
        key: "_createButtons",
        value: function _createButtons() {
            var _this3 = this;

            if (this._footer.hasChildNodes() === true) {
                this._footer.update();
            }
            this._buttons.forEach(function (button) {
                button._button = new _button.Button({
                    className: button.className,
                    label: button.label,
                    icon: button.icon,
                    color: button.color,
                    isFocused: button.isFocused || false,
                    isDisabled: button.isDisabled,
                    onSelect: function onSelect(e) {
                        if (button.onSelect) {
                            button.onSelect.call(e.targetButton, e, _this3);
                        } else if (button["onClick"]) {
                            console.warn("ModalButton#onClick is deprecated. Use ModalButton#onSelect instead.");
                            button["onClick"](e, _this3); // DEPRECATED
                        }
                    }
                });
                // DEPRECATED, This is for backward compatibility.
                button._button["button"] = button;
                button["button"] = button._button;
                button["disable"] = button._button.disable.bind(button._button);
                button["enable"] = button._button.enable.bind(button._button);
                button["setColor"] = button._button.setColor.bind(button._button);
                _this3._footer.insert(button._button);
            });
        }
    }, {
        key: "_positioning",
        value: function _positioning() {
            var _this4 = this;

            var baseWidth = -1;
            var baseHeight = -1;
            var modalWidth = -1;
            var modalHeight = -1;
            var update = function update() {
                if (baseWidth !== _this4._container.getWidth() || baseHeight !== _this4._container.getHeight() || modalWidth !== _this4._modal.getWidth() || modalHeight !== _this4._modal.getHeight()) {
                    baseWidth = _this4._container.getWidth();
                    baseHeight = _this4._container.getHeight();
                    modalWidth = _this4._modal.getWidth();
                    modalHeight = _this4._modal.getHeight();
                    if (_this4._opt.sizing === "flex") {
                        if (baseWidth - 20 <= modalWidth) {
                            _this4._modal.style.left = "0";
                            _this4._middle.style.width = baseWidth + "px";
                            _this4._middle.style.overflowX = "auto";
                        } else {
                            _this4._modal.style.left = Math.floor(baseWidth / 2 - modalWidth / 2) + "px";
                            _this4._middle.style.width = "";
                            _this4._middle.style.overflowX = "visible";
                        }
                        if (baseHeight - 20 <= modalHeight) {
                            _this4._obi.style.top = "10px";
                            _this4._obi.style.bottom = "10px";
                            _this4._obi.style.height = "";
                            _this4._middle.style.height = baseHeight - _this4._header.getHeight() - _this4._footer.getHeight() - 20 + "px";
                            _this4._middle.style.overflowY = "auto";
                        } else {
                            _this4._obi.style.top = baseHeight / 2 - modalHeight / 2 + "px";
                            _this4._obi.style.bottom = "";
                            _this4._obi.style.height = modalHeight + "px";
                            _this4._middle.style.height = "";
                            _this4._middle.style.overflowY = "visible";
                        }
                    }
                    if (_this4._opt.sizing === "full") {
                        _this4._modal.style.right = "10px";
                        _this4._modal.style.left = "10px";
                        _this4._middle.style.overflowX = "auto";
                        _this4._obi.style.top = "10px";
                        _this4._obi.style.bottom = "10px";
                        _this4._obi.style.height = "";
                        _this4._middle.style.height = baseHeight - _this4._header.getHeight() - _this4._footer.getHeight() - 20 + "px";
                        _this4._middle.style.overflowY = "auto";
                    }
                }
                ;
                _this4._positioningTimer = setTimeout(update, 30);
            };
            this._positioningTimer = setTimeout(update, 0);
        }
    }, {
        key: "_onKeydownHandler",
        value: function _onKeydownHandler(e) {
            var active = document.activeElement && document.activeElement.tagName;
            if (this.visible() === false) {
                return;
            }
            if (active !== "BODY" && active !== "DIV" && active !== "BUTTON") {
                return;
            }
            if (window.getSelection().toString() !== "") {
                return;
            }
            var activated = false;
            // TAB:9
            if (e.keyCode === 9 && active !== "BUTTON") {
                activated = true;
                if (this._closeButton) {
                    this._closeButton.focus();
                } else if (this._buttons[0]) {
                    this._buttons[0]._button.focus();
                }
            }
            // ENTER:13
            if (e.keyCode === 13 && this._buttons[0] && active !== "BUTTON") {
                activated = true;
                this._buttons[0]._button.click();
            }
            // ESC:27
            if (e.keyCode === 27 && this._opt.disableCloseByEsc === false) {
                activated = true;
                this.close();
            }
            if (activated === true) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }, {
        key: "buttons",
        get: function get() {
            return this.getButtons();
        }
    }, {
        key: "id",
        get: function get() {
            return this._container.id;
        },
        set: function set(id) {
            this._container.id = id;
        }
    }, {
        key: "className",
        get: function get() {
            return this._container.className;
        },
        set: function set(className) {
            this._container.className = className;
        }
    }, {
        key: "content",
        get: function get() {
            return this._content;
        },
        set: function set(div) {
            this.setContent(div);
        }
    }, {
        key: "sizing",
        get: function get() {
            return this._opt.sizing;
        },
        set: function set(sizing) {
            this.setSizing(sizing);
        }
    }, {
        key: "element",
        get: function get() {
            return this._opt.element;
        },
        set: function set(element) {
            this.setElement(element);
        }
    }, {
        key: "html",
        get: function get() {
            return this._opt.html;
        },
        set: function set(html) {
            this.setHTML(html);
        }
    }, {
        key: "text",
        get: function get() {
            return this._opt.text;
        },
        set: function set(text) {
            this.setText(text);
        }
    }, {
        key: "title",
        get: function get() {
            return this._opt.title;
        },
        set: function set(title) {
            this.setTitle(title);
        }
    }, {
        key: "subtitle",
        get: function get() {
            return this._opt.subtitle;
        },
        set: function set(subtitle) {
            this.setSubtitle(subtitle);
        }
    }]);

    return Modal;
}();

function createModal(option) {
    return new Modal(option);
}



},{"./button":9,"./element":15}],20:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Notify = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createNotify = createNotify;

var _element = require("./element");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createNotify(option)
    new flagrate.Notify(option)
    - option (Object) - configuration for the notifications.

    Initialize the notifications.

    #### option

    * `target`                (Element; default `document.body`):
    * `className`             (String):
    * `disableDesktopNotify`  (Boolean; default `false`):
    * `disableFocusDetection` (Boolean; default `false`):
    * `hAlign`                (String;  default `"right"`; `"right"` | `"left"`):
    * `vAlign`                (String;  default `"bottom"`; `"top"` | `"bottom"`):
    * `hMargin`               (Number;  default `10`):
    * `vMargin`               (Number;  default `10`):
    * `spacing`               (Number;  default `10`):
    * `timeout`               (Number;  default `5`):
    * `title`                 (String;  default `"Notify"`):
**/
var Notify = exports.Notify = function () {
    function Notify() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Notify);

        this.target = document.body;
        this.disableDesktopNotify = false;
        this.disableFocusDetection = false;
        this.hAlign = "right";
        this.vAlign = "bottom";
        this.hMargin = 10; //pixels
        this.vMargin = 10; //pixels
        this.spacing = 10; //pixels
        this.timeout = 5; //seconds
        this.title = "Notify";
        this._notifies = [];
        if (opt.target) {
            this.target = opt.target;
        }
        if (opt.className) {
            this.className = opt.className;
        }
        if (opt.disableDesktopNotify) {
            this.disableDesktopNotify = opt.disableDesktopNotify;
        }
        if (opt.disableFocusDetection) {
            this.disableFocusDetection = opt.disableFocusDetection;
        }
        if (opt.hAlign) {
            this.hAlign = opt.hAlign;
        }
        if (opt.vAlign) {
            this.vAlign = opt.vAlign;
        }
        if (opt.hMargin) {
            this.hMargin = opt.hMargin;
        }
        if (opt.vMargin) {
            this.vMargin = opt.vMargin;
        }
        if (opt.spacing) {
            this.spacing = opt.spacing;
        }
        if (opt.timeout) {
            this.timeout = opt.timeout;
        }
        if (opt.title) {
            this.title = opt.title;
        }
        if (opt.icon) {
            this.icon = opt.icon;
        }
        this._init();
    }

    _createClass(Notify, [{
        key: "create",
        value: function create() {
            var _this = this;

            var _opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var opt = void 0;
            // sugar
            if (typeof _opt === "string") {
                opt = {
                    text: _opt
                };
            } else {
                opt = _opt;
            }
            /*- Desktop notify -*/
            if (this.disableDesktopNotify === false) {
                var hasFocus = !!document.hasFocus ? document.hasFocus() : false;
                if (this.disableFocusDetection === false && hasFocus === false) {
                    if (this._createDesktopNotify(opt) === true) {
                        return this;
                    }
                }
            }
            /*- Setting up -*/
            var title = opt.title || this.title;
            var message = opt.message || opt.body || opt.content || opt.text || null;
            var onClick = opt.onClick;
            var onClose = opt.onClose;
            var timeout = opt.timeout !== void 0 ? opt.timeout : this.timeout;
            var icon = opt.icon || this.icon;
            var isAlive = true;
            var closeTimer = void 0;
            /*- Positions -*/
            var hPosition = this.hMargin;
            var vPosition = this.vMargin;
            /*- Create a new element for notify -*/
            //
            // <div class="flagrate-notify">
            //   <div class="title">Notification</div>
            //   <div class="text">yadda yadda yadda..</div>
            //   <div class="close">&#xd7;</div>
            // </div>
            //
            var notify = new _element.Element("div", { "class": this.className });
            notify.addClassName("flagrate flagrate-notify");
            new _element.Element("div", { "class": "title" }).insertText(title).insertTo(notify);
            new _element.Element("div", { "class": "text" }).insertText(message).insertTo(notify);
            var notifyClose = new _element.Element("div", { "class": "close" }).update("&#xd7;").insertTo(notify);
            if (icon) {
                notify.addClassName("flagrate-notify-icon");
                new _element.Element("div", { "class": "icon" }).setStyle({ "backgroundImage": "url(" + icon + ")" }).insertTo(notify);
            }
            /*- Remove a notify element -*/
            var closeNotify = function closeNotify() {
                if (isAlive === false) {
                    return;
                }
                isAlive = false;
                notify.style.opacity = "0";
                //onClose event
                if (onClose) {
                    onClose.call(_this);
                }
                setTimeout(function () {
                    _this.target.removeChild(notify);
                    _this._notifies.splice(_this._notifies.indexOf(notify), 1);
                    _this._positioner();
                }, 300);
            };
            notifyClose.addEventListener("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (isAlive) {
                    closeNotify();
                }
            }, false);
            notify.style.display = "none";
            notify.style.position = "fixed";
            notify.style[this.hAlign] = hPosition + "px";
            notify.style[this.vAlign] = vPosition + "px";
            /*- onClick event -*/
            if (!onClick) {
                notify.addEventListener("click", closeNotify);
            } else {
                notify.style.cursor = "pointer";
                notify.addEventListener("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    onClick.call(_this);
                    closeNotify();
                });
            }
            /*- Insert to the target -*/
            this.target.appendChild(notify);
            /*- Show notify -*/
            notify.style.display = "block";
            setTimeout(function () {
                notify.style.opacity = "1";
            }, 10);
            /*- Set timeout -*/
            if (timeout !== 0) {
                var onTimeout = function onTimeout() {
                    if (isAlive) {
                        closeNotify();
                    }
                };
                closeTimer = setTimeout(onTimeout, timeout * 1000);
                //Clear timeout
                notify.addEventListener("mouseover", function () {
                    clearTimeout(closeTimer);
                    closeTimer = setTimeout(onTimeout, timeout * 1000);
                });
            }
            this._notifies.push(notify);
            this._positioner();
            return this;
        }
    }, {
        key: "_init",
        value: function _init() {
            if (this.disableDesktopNotify === false) {
                /*- Check supported -*/
                if (!window["Notification"] || !window["Notification"].permission) {
                    this.disableDesktopNotify = true;
                } else {
                    /*- Check protocol -*/
                    if (location.protocol !== "file:") {
                        /*- Get Permissions -*/
                        if (window["Notification"].permission === "default") {
                            this.create({
                                text: "Click here to Activate the Desktop Notifications...",
                                onClick: function onClick() {
                                    window["Notification"].requestPermission();
                                }
                            });
                        }
                    }
                }
            }
        }
    }, {
        key: "_createDesktopNotify",
        value: function _createDesktopNotify(opt) {
            var _this2 = this;

            /*- Setting up -*/
            var title = opt.title || this.title;
            var message = opt.message || opt.body || opt.content || opt.text || null;
            var onClick = opt.onClick;
            var onClose = opt.onClose;
            var timeout = opt.timeout !== void 0 ? opt.timeout : this.timeout;
            var icon = opt.icon || this.icon;
            var isAlive = true;
            var notify = null;
            var closeTimer = void 0;
            /*- Create a desktop notification -*/
            /*- Get Permissions -*/
            if (window["Notification"].permission !== "granted") {
                return false;
            }
            notify = new window["Notification"](title, {
                icon: icon,
                body: message
            });
            /*- Set timeout -*/
            if (timeout !== 0) {
                closeTimer = setTimeout(function () {
                    if (isAlive) {
                        notify.close();
                    }
                }, timeout * 1000);
            }
            /*- onClick event -*/
            notify.addEventListener("click", function () {
                if (onClick) {
                    onClick.call(_this2);
                }
                notify.close();
            });
            /*- onClose event -*/
            notify.onclose = function () {
                isAlive = false;
                if (onClose) {
                    onClose.call(_this2);
                }
            };
            /*- Show notify -*/
            if (notify.show) {
                notify.show();
            }
            return true;
        }
    }, {
        key: "_positioner",
        value: function _positioner() {
            var tH = this.target === document.body ? window.innerHeight || document.body.clientHeight : this.target.offsetHeight;
            var pX = 0;
            var pY = 0;
            for (var i = 0, l = this._notifies.length; i < l; i++) {
                var notify = this._notifies[i];
                var x = this.vMargin + pX;
                var y = this.hMargin + pY;
                notify.style[this.hAlign] = x.toString(10) + "px";
                notify.style[this.vAlign] = y.toString(10) + "px";
                pY += this.spacing + notify.offsetHeight;
                if (pY + notify.offsetHeight + this.vMargin + this.spacing >= tH) {
                    pY = 0;
                    pX += this.spacing + notify.offsetWidth;
                }
            }
        }
    }]);

    return Notify;
}();

function createNotify(option) {
    return new Notify(option);
}



},{"./element":15}],21:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Popover = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createPopover = createPopover;

var _element = require("./element");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createPopover(option)
    new flagrate.Popover(option)
    - option (Object) - options.

    Popover.

    #### option

    * `target`    (Element):
    * `text`      (String):
    * `html`      (String):
    * `element`   (Element):
    * `className` (String):
**/
var Popover = exports.Popover = function () {
    function Popover() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Popover);

        this._isShowing = false;
        this._openHandler = this.open.bind(this);
        this._closeHandler = this.close.bind(this);
        if (opt.target) {
            if (!opt.target["isFlagrated"]) {
                opt.target = _element.Element.extend(opt.target);
            }
            this._target = opt.target;
        }
        if (opt.text) {
            this._text = opt.text;
        }
        if (opt.html) {
            this._html = opt.html;
        }
        if (opt.element) {
            this._element = opt.element;
        }
        if (opt.className) {
            this._className = opt.className;
        }
        if (this._target) {
            this._target.addEventListener("mouseover", this._openHandler);
        }
    }

    _createClass(Popover, [{
        key: "open",
        value: function open(forceTarget) {
            var _this = this;

            if (this._isShowing === true) {
                this.close();
            }
            var target = this._target || document.documentElement;
            if (forceTarget instanceof Event) {
                if (_element.Element.isElement(forceTarget.target) === true) {
                    target = forceTarget.target;
                }
                document.body.addEventListener("click", this._closeHandler);
                document.body.addEventListener("mouseout", this._closeHandler);
                document.body.addEventListener("mouseup", this._closeHandler);
                window.addEventListener("scroll", this._closeHandler);
            } else if (_element.Element.isElement(forceTarget) === true) {
                target = forceTarget;
            }
            var div = this._create();
            this._positioningTimer = setInterval(function () {
                if (_element.Element.exists(target) === true) {
                    _updatePosition(target, div);
                } else {
                    _this.close();
                }
            }, 10);
            this._div.on("click", function (e) {
                return e.stopPropagation();
            });
            this._div.on("mouseup", function (e) {
                return e.stopPropagation();
            });
            this._div.on("mousewheel", function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            _updatePosition(target, div);
            return this;
        }
    }, {
        key: "close",
        value: function close() {
            if (this._div === undefined) {
                return this;
            }
            clearInterval(this._positioningTimer);
            document.body.removeEventListener("click", this._closeHandler);
            document.body.removeEventListener("mouseup", this._closeHandler);
            document.body.removeEventListener("mouseout", this._closeHandler);
            window.removeEventListener("scroll", this._closeHandler);
            this._isShowing = false;
            var div = this._div;
            div.removeClassName("flagrate-popover-visible");
            setTimeout(function () {
                if (div && div.remove) {
                    div.remove();
                }
            }, 1000);
            delete this._div;
            return this;
        }
    }, {
        key: "visible",
        value: function visible() {
            return this._isShowing && !!this._div.hasClassName("flagrate-popover-visible");
        }
    }, {
        key: "remove",
        value: function remove() {
            if (this._div) {
                this.close();
            }
            if (this._target) {
                this._target.removeEventListener("mouseover", this._openHandler);
            }
        }
    }, {
        key: "setTarget",
        value: function setTarget(element) {
            if (this._target === element) {
                return this;
            }
            if (!element["isFlagrated"]) {
                element = _element.Element.extend(element);
            }
            this._target = element;
            if (this._isShowing === true) {
                this.open();
            }
            return this;
        }
    }, {
        key: "setText",
        value: function setText(text) {
            if (this._text === text) {
                return this;
            }
            this._text = text;
            if (this._isShowing === true) {
                this._div.updateText(text);
            }
            return this;
        }
    }, {
        key: "setHTML",
        value: function setHTML(html) {
            if (this._html === html) {
                return this;
            }
            this._html = html;
            if (this._isShowing === true) {
                this._div.update(html);
            }
            return this;
        }
    }, {
        key: "setElement",
        value: function setElement(element) {
            if (this._element === element) {
                return this;
            }
            this._element = element;
            if (this._isShowing === true) {
                this._div.update(element);
            }
            return this;
        }
    }, {
        key: "setClassName",
        value: function setClassName(className) {
            if (this._className === className) {
                return this;
            }
            if (this._isShowing === true) {
                this._div.removeClassName(this._className).addClassName(className);
            }
            this._className = className;
            return this;
        }
    }, {
        key: "_create",
        value: function _create() {
            this._isShowing = true;
            var div = this._div = new _element.Element("div", {
                "class": "flagrate flagrate-popover"
            });
            if (this._className) {
                div.addClassName(this._className);
            }
            if (this._text) {
                div.updateText(this._text);
            }
            if (this._html) {
                div.update(this._html);
            }
            if (this._element) {
                div.update(this._element);
            }
            div.insertTo(document.body);
            setTimeout(function () {
                return div.addClassName("flagrate-popover-visible");
            }, 0);
            return div;
        }
    }, {
        key: "target",
        get: function get() {
            return this._target;
        },
        set: function set(element) {
            this.setTarget(element);
        }
    }, {
        key: "text",
        get: function get() {
            return this._text;
        },
        set: function set(text) {
            this.setText(text);
        }
    }, {
        key: "html",
        get: function get() {
            return this._html;
        },
        set: function set(html) {
            this.setHTML(html);
        }
    }, {
        key: "element",
        get: function get() {
            return this._element;
        },
        set: function set(element) {
            this.setElement(element);
        }
    }, {
        key: "className",
        get: function get() {
            return this._className;
        },
        set: function set(className) {
            this.setClassName(className);
        }
    }, {
        key: "isShowing",
        get: function get() {
            return this._isShowing;
        },
        set: function set(boolean) {
            if (boolean === true) {
                this.open();
            } else {
                this.close();
            }
        }
    }]);

    return Popover;
}();

function createPopover(option) {
    return new Popover(option);
}
function _updatePosition(target, div) {
    var tOffset = _element.Element.cumulativeOffset(target);
    var tScroll = _element.Element.cumulativeScrollOffset(target);
    var tWidth = _element.Element.getWidth(target);
    var tHeight = _element.Element.getHeight(target);
    var width = div.getWidth();
    var height = div.getHeight();
    var x = tOffset.left - tScroll.left + Math.round(tWidth / 2 - width / 2);
    var y = tOffset.top - tScroll.top + tHeight;
    if (y + height > window.innerHeight) {
        y = window.innerHeight - y + tHeight;
        div.removeClassName("flagrate-popover-tail-top");
        div.addClassName("flagrate-popover-tail-bottom");
        div.style.top = "";
        div.style.bottom = y + "px";
    } else {
        div.removeClassName("flagrate-popover-tail-bottom");
        div.addClassName("flagrate-popover-tail-top");
        div.style.top = y + "px";
        div.style.bottom = "";
    }
    div.style.left = x + "px";
}



},{"./element":15}],22:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Progress = undefined;
exports.createProgress = createProgress;

var _util = require("./util");

var _element = require("./element");

/*?
    flagrate.createProgress(option)
    new flagrate.Progress(option)
    - option (Object) - options.
**/
function FProgress() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var attr = opt.attribute || {};
    attr["id"] = opt.id || null;
    attr["class"] = opt.className || null;
    //create
    var progress = new _element.Element("div", attr);
    (0, _util.extendObject)(progress, this);
    progress._value = opt.value || 0;
    progress._max = opt.max || 100;
    progress.addClassName("flagrate flagrate-progress");
    progress._bar = new _element.Element().insertTo(progress);
    progress._updateProgress();
    return progress;
}
var Progress = exports.Progress = FProgress;
function createProgress(option) {
    return new Progress(option);
}
Progress.prototype = {
    getValue: function getValue() {
        return this._value;
    },
    setValue: function setValue(number) {
        var progress = this;
        if (typeof number !== "number") {
            return progress;
        }
        progress._value = Math.max(0, Math.min(progress._max, number));
        progress.fire("change", { targetProgress: progress });
        progress._updateProgress();
        return progress;
    },
    getMax: function getMax() {
        return this._max;
    },
    setMax: function setMax(number) {
        var progress = this;
        if (typeof number !== "number") {
            return progress;
        }
        progress._max = number;
        progress.setValue(progress._value);
        progress._updateProgress();
        return progress;
    },
    _updateProgress: function _updateProgress() {
        var progress = this;
        var percentage = Math.max(0, Math.min(100, progress._value / progress._max * 100));
        progress._bar.setStyle({ width: percentage + "%" });
        return;
    }
};



},{"./element":15,"./util":36}],23:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pulldown = undefined;
exports.createPulldown = createPulldown;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var _menu = require("./menu");

/*?
    flagrate.createPulldown(option)
    new flagrate.Pulldown(option)
    - option (Object) - options.

    Pulldown.

    #### option

    * `id`                       (String): `id` attribute of `button` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array): of item (see: flagrate.Menu)
    * `isDisabled`               (Boolean; default `false`):
    * `onSelect`                 (Function):
    * `onOpen`                   (Function):
    * `onClose`                  (Function):
**/
function FPulldown() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    option.label = option.label || "";
    this.items = option.items || [];
    this.onOpen = option.onOpen || _util.emptyFunction;
    this.onClose = option.onClose || _util.emptyFunction;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    //create
    var pulldown = new _button.Button({
        attribute: attr,
        label: option.label,
        icon: option.icon,
        onSelect: option.onSelect
    });
    (0, _util.extendObject)(pulldown, this);
    pulldown.addEventListener("select", pulldown.open.bind(pulldown));
    pulldown.addClassName("flagrate-pulldown");
    if (option.className) {
        pulldown.addClassName(option.className);
    }
    new _element.Element("span", { "class": "flagrate-pulldown-triangle" }).insertTo(pulldown);
    if (option.style) {
        pulldown.setStyle(option.style);
    }
    if (option.color) {
        pulldown.setColor(option.color);
    }
    if (option.isDisabled) {
        pulldown.disable();
    }
    return pulldown;
}
var Pulldown = exports.Pulldown = FPulldown;
function createPulldown(option) {
    return new Pulldown(option);
}
Pulldown.prototype = {
    open: function open(e) {
        var pulldown = this;
        if (pulldown._open === true || !!pulldown._menu) {
            pulldown.close();
            return;
        }
        pulldown._open = true;
        pulldown._menu = new _element.Element("div", { "class": "flagrate-pulldown-menu" }).insert(new _menu.Menu({
            items: pulldown.items,
            onSelect: function onSelect(e) {
                if (pulldown.onSelect) {
                    pulldown.onSelect(e, pulldown);
                }
                pulldown.fire("select", { targetPulldown: pulldown });
            }
        }));
        pulldown._menu.style.top = pulldown.offsetTop + pulldown.getHeight() + "px";
        pulldown._menu.style.left = pulldown.offsetLeft + "px";
        pulldown.insert({ after: pulldown._menu });
        // To prevent overflow.
        var menuHeight = pulldown._menu.getHeight();
        var menuMargin = parseInt(pulldown._menu.getStyle("margin-top").replace("px", ""), 10);
        var cummOffsetTop = pulldown.cumulativeOffset().top;
        var upsideSpace = -window.pageYOffset + cummOffsetTop;
        var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - pulldown.getHeight();
        if (menuHeight + menuMargin > downsideSpace) {
            if (upsideSpace > downsideSpace) {
                if (upsideSpace < menuHeight + menuMargin) {
                    menuHeight = upsideSpace - menuMargin - menuMargin;
                    pulldown._menu.style.maxHeight = menuHeight + "px";
                }
                pulldown._menu.style.top = pulldown.offsetTop - menuHeight - menuMargin * 2 + "px";
            } else {
                menuHeight = downsideSpace - menuMargin - menuMargin;
                pulldown._menu.style.maxHeight = menuHeight + "px";
            }
        }
        var close = function close(e) {
            document.body.removeEventListener("click", close);
            if (pulldown.parentNode) {
                pulldown.parentNode.removeEventListener("click", close);
            }
            pulldown.removeEventListener("select", close);
            pulldown.close(e);
        };
        setTimeout(function () {
            document.body.addEventListener("click", close);
            if (pulldown.parentNode) {
                pulldown.parentNode.addEventListener("click", close);
            }
            pulldown.addEventListener("select", close);
        }, 0);
        pulldown.onOpen.call(pulldown, e, pulldown);
        pulldown.fire("open", { targetPulldown: pulldown });
        return this;
    },
    close: function close(e) {
        var pulldown = this;
        if (pulldown._open === false || !pulldown._menu) {
            return;
        }
        pulldown._open = false;
        pulldown._menu.style.opacity = "0";
        setTimeout(function () {
            if (!pulldown._menu) {
                return;
            }
            pulldown._menu.remove();
            delete pulldown._menu;
            pulldown.onClose(e, pulldown);
            pulldown.fire("close", { targetPulldown: pulldown });
        }, 250);
        return this;
    }
};



},{"./button":9,"./element":15,"./menu":18,"./util":36}],24:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Radio = undefined;
exports.createRadio = createRadio;

var _util = require("./util");

var _element = require("./element");

var idCounter = 0;
/*?
    flagrate.createRadio(option)
    new flagrate.Radio(option)
    - option (Object) - options.
**/
function FRadio() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var id = "flagrate-radio-" + (++idCounter).toString(10);
    var attr = opt.attribute || {};
    attr["id"] = opt.id || null;
    attr["class"] = opt.className || null;
    //create
    var radio = new _element.Element("label", attr);
    radio.writeAttribute("for", id);
    (0, _util.extendObject)(radio, this);
    if (opt.label) {
        radio.insertText(opt.label);
    } else if (opt.labelHTML) {
        radio.insert(opt.labelHTML);
    }
    radio.addClassName("flagrate flagrate-radio");
    if (opt.icon) {
        radio.addClassName("flagrate-icon");
        radio.setStyle({
            backgroundImage: "url(" + opt.icon + ")"
        });
    }
    radio.onChange = opt.onChange || null;
    radio.onCheck = opt.onCheck || null;
    radio.onUncheck = opt.onUncheck || null;
    radio._input = new _element.Element("input", { id: id, type: "radio", name: opt.name });
    radio.insert({ top: new _element.Element() });
    radio.insert({ top: radio._input });
    radio._input.addEventListener("change", function (e) {
        e.stopPropagation();
        var _e = e;
        _e.targetRadio = radio;
        if (radio.isChecked() === true) {
            if (radio.onCheck) {
                radio.onCheck(_e, radio);
            }
            radio.fire("check", { targetRadio: radio });
        } else {
            if (radio.onUncheck) {
                radio.onUncheck(_e, radio);
            }
            radio.fire("uncheck", { targetRadio: radio });
        }
        if (radio.onChange) {
            radio.onChange(_e, radio);
        }
        radio.fire("change", { targetRadio: radio });
    });
    if (opt.isChecked === true) {
        radio.check();
    }
    if (opt.isFocused === true) {
        radio.focus();
    }
    if (opt.isDisabled === true) {
        radio.disable();
    }
    return radio;
}
var Radio = exports.Radio = FRadio;
function createRadio(option) {
    return new Radio(option);
}
Radio.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", true);
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this._input.writeAttribute("disabled", false);
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    isChecked: function isChecked() {
        return !!this._input.checked;
    },
    check: function check() {
        this._input.checked = true;
        return this;
    },
    uncheck: function uncheck() {
        this._input.checked = false;
        return this;
    }
};



},{"./element":15,"./util":36}],25:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Radios = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createRadios = createRadios;

var _util = require("./util");

var _element = require("./element");

var _radio = require("./radio");

var idCounter = 0;
/*?
    flagrate.createRadios(option)
    new flagrate.Radios(option)
    - option (Object) - options.
**/
function FRadios() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var id = "flagrate-radios-" + (++idCounter).toString(10);
    var attr = opt.attribute || {};
    if (opt.id) {
        attr["id"] = opt.id;
    }
    //create
    var radios = new _element.Element("div", attr);
    (0, _util.extendObject)(radios, this);
    radios.addClassName("flagrate flagrate-radios");
    if (opt.className) {
        radios.addClassName(opt.className);
    }
    if (opt.style) {
        radios.setStyle(opt.style);
    }
    radios.onChange = opt.onChange;
    radios.selectedIndex = opt.selectedIndex || -1;
    radios._items = [];
    (opt.items || []).forEach(function (item, i) {
        var _item = {};
        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
            (0, _util.extendObject)(_item, item);
        } else {
            _item.label = typeof item === "string" ? item : item.toString();
            _item.value = item;
        }
        _item.name = id;
        _item._radio = new _radio.Radio(_item).insertTo(radios);
        _item._radio.addEventListener("change", function (e) {
            if (radios.onChange) {
                radios.onChange(e, radios);
            }
        });
        _item._radio.addEventListener("check", function (e) {
            radios.selectedIndex = i;
        });
        radios._items.push(_item);
    });
    if (opt.isDisabled) {
        radios.disable();
    }
    if (radios.selectedIndex > -1) {
        radios._items[radios.selectedIndex]._radio.check();
    }
    return radios;
}
var Radios = exports.Radios = FRadios;
function createRadios(option) {
    return new Radios(option);
}
Radios.prototype = {
    select: function select(index) {
        if (this._items[index] !== void 0) {
            this.selectedIndex = index;
            this._items[index]._radio.check();
        }
        return this;
    },
    getValue: function getValue() {
        if (this.selectedIndex === -1) {
            return void 0;
        } else {
            return this._items[this.selectedIndex].value;
        }
    },
    setValue: function setValue(value) {
        for (var i = 0, l = this._items.length; i < l; i++) {
            if (this._items[i].value === value) {
                this.select(i);
                break;
            }
        }
        return this;
    },
    enable: function enable() {
        for (var i = 0, l = this._items.length; i < l; i++) {
            this._items[i]._radio.enable();
        }
        this.removeClassName("flagrate-disabled");
        return this;
    },
    disable: function disable() {
        for (var i = 0, l = this._items.length; i < l; i++) {
            this._items[i]._radio.disable();
        }
        this.addClassName("flagrate-disabled");
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    }
};



},{"./element":15,"./radio":24,"./util":36}],26:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SearchBox = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createSearchBox = createSearchBox;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var _textInput = require("./text-input");

var _menu = require("./menu");

/*?
    flagrate.createSearchBox(option)
    new flagrate.SearchBox(option)
    - option (Object) - options.

    text input for search.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String): default value.
    * `placeholder`              (String):
    * `icon`                     (String):
    * `isDisabled`               (Boolean; default `false`):
    * `suggester`                (Function):
    * `onSearch`                 (Function): callback with input value.
**/
function FSearchBox() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.suggester = opt.suggester || null;
    this.onSearch = opt.onSearch || _util.emptyFunction;
    var attr = opt.attribute || {};
    attr["id"] = opt.id || null;
    attr["class"] = opt.className || null;
    //create
    var searchBox = new _element.Element("div", attr);
    (0, _util.extendObject)(searchBox, this);
    searchBox.addClassName("flagrate flagrate-search-box");
    searchBox._input = new _textInput.TextInput({
        className: "search-input",
        value: opt.value,
        placeholder: opt.placeholder,
        icon: opt.icon
    }).insertTo(searchBox);
    searchBox._button = new _button.Button({
        className: "search-button",
        onSelect: searchBox.search.bind(searchBox)
    }).insertTo(searchBox);
    searchBox._suggest = new _element.Element("div", {
        "class": "search-suggest"
    }).hide().insertTo(searchBox);
    searchBox._input.on("keydown", searchBox._onKeydownHandler.bind(searchBox));
    searchBox._input.on("keyup", searchBox._onKeyupHandler.bind(searchBox));
    searchBox._input.on("focus", searchBox._onFocusHandler.bind(searchBox));
    searchBox._input.on("blur", searchBox._onBlurHandler.bind(searchBox));
    // for Chrome
    searchBox._suggest.on("mousedown", function (e) {
        return e.preventDefault();
    });
    if (opt.style) {
        searchBox.setStyle(opt.style);
    }
    if (opt.isDisabled) {
        searchBox.disable();
    }
    return searchBox;
}
var SearchBox = exports.SearchBox = FSearchBox;
function createSearchBox(option) {
    return new SearchBox(option);
}
SearchBox.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this._input.disable();
        this._button.disable();
        this._suggest.hide();
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this._input.enable();
        this._button.enable();
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    getValue: function getValue() {
        return this._input.getValue();
    },
    setValue: function setValue(value) {
        this._input.setValue(value);
        return this;
    },
    search: function search() {
        var value = this.getValue();
        this.onSearch(value, this);
        this.fire("search", value);
        this._input.blur();
        return this;
    },
    suggest: function suggest() {
        if (!this.suggester) {
            return this;
        }
        this._suggest.hide();
        var value = this.getValue();
        var result = this.suggester(value, this._suggested.bind(this));
        if (result !== void 0) {
            this._suggested(result);
        }
        return this;
    },
    focus: function focus() {
        this._input.focus();
    },
    blur: function blur() {
        this._input.blur();
    },
    _suggested: function _suggested(suggestedItems) {
        var _this = this;

        if (!suggestedItems) {
            return;
        }
        if (suggestedItems.length === 0) {
            this._suggest.hide();
            return;
        }
        var items = [];
        suggestedItems.forEach(function (item) {
            if (typeof item === "string" && item.trim() !== "") {
                items.push({
                    label: item.trim(),
                    onSelect: _createCompletionHandler(_this, item.trim())
                });
            } else if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                items.push({
                    label: item.label,
                    icon: item.icon,
                    onSelect: _createSuggestionHandler(_this, item.onSelect)
                });
            }
        });
        if (items.length === 0) {
            this._suggest.hide();
            return;
        }
        var menu = this._menu = new _menu.Menu({
            items: items,
            onSelect: function onSelect() {
                _this._suggest.hide();
            }
        });
        _element.Element.addClassName(menu.firstChild, "flagrate-search-suggest-selected");
        this._suggest.update(menu).show();
        // To prevent overflow.
        var menuHeight = this._suggest.getHeight();
        var menuMargin = parseInt(this._suggest.getStyle("margin-top").replace("px", ""), 10);
        var cummOffsetTop = this.cumulativeOffset().top;
        var upsideSpace = -window.pageYOffset + cummOffsetTop;
        var downsideSpace = window.pageYOffset + window.innerHeight - cummOffsetTop - this.getHeight();
        if (menuHeight + menuMargin > downsideSpace) {
            if (upsideSpace > downsideSpace) {
                if (upsideSpace < menuHeight + menuMargin) {
                    menuHeight = upsideSpace - menuMargin - menuMargin;
                    this._suggest.style.maxHeight = menuHeight + "px";
                }
                this._suggest.addClassName("flagrate-search-suggest-upper");
            } else {
                menuHeight = downsideSpace - menuMargin - menuMargin;
                this._suggest.style.maxHeight = menuHeight + "px";
                this._suggest.removeClassName("flagrate-search-suggest-upper");
            }
        } else {
            this._suggest.removeClassName("flagrate-search-suggest-upper");
        }
        // reset scroll position
        this._suggest.scrollTop = 0;
    },
    _onKeydownHandler: function _onKeydownHandler(e) {
        // ESC: 27
        if (e.keyCode === 27) {
            this._input.select();
            this._suggest.hide();
        } else if (this._suggest.visible() === true) {
            // ENTER: 13
            if (e.keyCode === 13) {
                var target = this._menu.getElementsByClassName("flagrate-search-suggest-selected")[0];
                target.click();
                return;
            }
            // UP: 38, DOWN: 40
            if (e.keyCode !== 38 && e.keyCode !== 40) {
                return;
            }
            e.preventDefault();
            var elements = this._menu.getElementsByTagName("button");
            for (var i = 0, l = elements.length; i < l; i++) {
                if (elements[i].hasClassName("flagrate-search-suggest-selected") === true) {
                    if (e.keyCode === 38 && i !== 0 || e.keyCode === 40 && i + 1 !== l) {
                        elements[i].removeClassName("flagrate-search-suggest-selected");
                    }
                    var scrollTop = -1;
                    if (e.keyCode === 38 && i !== 0) {
                        elements[i - 1].addClassName("flagrate-search-suggest-selected");
                        scrollTop = elements[i - 1].offsetHeight + elements[i - 1].offsetTop;
                    } else if (e.keyCode === 40 && i + 1 !== l) {
                        elements[i + 1].addClassName("flagrate-search-suggest-selected");
                        scrollTop = elements[i + 1].offsetHeight + elements[i + 1].offsetTop;
                    }
                    if (scrollTop !== -1) {
                        this._suggest.scrollTop = scrollTop + 4 - this._suggest.getHeight();
                    }
                    break;
                }
            }
        } else if (e.keyCode === 13) {
            setTimeout(this.search.bind(this), 100);
        }
    },
    _onKeyupHandler: function _onKeyupHandler(e) {
        if (this._lastValue !== this.getValue()) {
            this._lastValue = this.getValue();
            this.suggest();
        }
    },
    _onFocusHandler: function _onFocusHandler(e) {
        setTimeout(this.suggest.bind(this), 100);
    },
    _onBlurHandler: function _onBlurHandler(e) {
        var _this2 = this;

        setTimeout(function () {
            if (document.activeElement !== _this2._suggest && _this2._suggest.visible() === true) {
                _this2._suggest.hide();
            }
        }, 100);
    }
};
function _createCompletionHandler(searchBox, value) {
    return function () {
        searchBox._input.setValue(value);
        searchBox._input.focus();
    };
}
function _createSuggestionHandler(searchBox, onSelect) {
    return function () {
        onSelect.call(searchBox);
        searchBox._input.blur();
    };
}



},{"./button":9,"./element":15,"./menu":18,"./text-input":32,"./util":36}],27:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Select = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createSelect = createSelect;

var _util = require("./util");

var _element = require("./element");

var _pulldown = require("./pulldown");

var _grid = require("./grid");

/*?
    flagrate.createSelect(option)
    new flagrate.Select(option)
    - option (Object) - options.

    Select.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array):
    * `listView`                 (Boolean; default `false`):
    * `multiple`                 (Boolean; default `false`):
    * `max`                      (Number; default `-1`):
    * `selectedIndex`            (Number):
    * `selectedIndexes`          (Array): array of Number.
    * `isDisabled`               (Boolean; default `false`):
**/
function FSelect() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.items = option.items || [];
    this.listView = option.listView || false;
    this.multiple = option.multiple || false;
    this.max = option.max || -1;
    if (this.multiple) {
        this.selectedIndexes = option.selectedIndexes || [];
    } else {
        this.selectedIndex = typeof option.selectedIndex === "undefined" ? -1 : option.selectedIndex;
    }
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    this.isPulldown = !this.listView && !this.multiple;
    // create
    var container = new _element.Element("div", attr);
    function createOnSelectHandler(i) {
        return function () {
            return container.select(i);
        };
    }
    function createOnDeselectHandler(i) {
        return function () {
            return container.deselect(i);
        };
    }
    // normalize items
    for (var i = 0, l = this.items.length; i < l; i++) {
        if (_typeof(this.items[i]) !== "object") {
            this.items[i] = {
                label: typeof this.items[i] === "string" ? this.items[i] : this.items[i].toString(10),
                value: this.items[i]
            };
        }
    }
    if (this.isPulldown) {
        container._pulldown = new _pulldown.Pulldown({
            label: "-",
            items: [{
                label: "-",
                onSelect: createOnSelectHandler(-1)
            }].concat(this.items.map(function (item, i) {
                return {
                    label: item.label,
                    labelHTML: item.labelHTML,
                    icon: item.icon,
                    onSelect: createOnSelectHandler(i)
                };
            }))
        }).insertTo(container);
    } else {
        container._grid = new _grid.Grid({
            headless: true,
            multiSelect: this.multiple,
            cols: [{
                key: "label"
            }],
            rows: this.items.map(function (item, i) {
                return {
                    cell: {
                        label: {
                            text: item.label,
                            html: item.labelHTML,
                            icon: item.icon
                        }
                    },
                    onSelect: createOnSelectHandler(i),
                    onDeselect: createOnDeselectHandler(i)
                };
            })
        }).insertTo(container);
    }
    (0, _util.extendObject)(container, this);
    container.addClassName("flagrate flagrate-select");
    if (!container.isPulldown) {
        container.addClassName("flagrate-select-list-view");
    }
    if (option.className) {
        container.addClassName(option.className);
    }
    if (option.style) {
        container.setStyle(option.style);
    }
    if (option.isDisabled) {
        container.disable();
    }
    if (container.multiple) {
        container.selectedIndexes.forEach(function (index) {
            container.select(index);
        });
    } else {
        if (container.selectedIndex > -1) {
            container.select(container.selectedIndex);
        }
    }
    return container;
}
var Select = exports.Select = FSelect;
function createSelect(option) {
    return new Select(option);
}
Select.prototype = {
    select: function select(index) {
        if (this.items.length <= index) {
            return this;
        }
        if (this.multiple) {
            if (this.max > -1 && this.selectedIndexes.length >= this.max) {
                if (this._grid.rows[index].isSelected === true) {
                    this._grid.deselect(index);
                }
                return this;
            }
            if (this.selectedIndexes.indexOf(index) === -1) {
                this.selectedIndexes.push(index);
            }
        } else {
            this.selectedIndex = index;
        }
        if (this.isPulldown) {
            if (index === -1) {
                this._pulldown.setLabel("-");
                this._pulldown.setIcon(null);
            } else {
                if (this.items[index].label !== undefined) {
                    this._pulldown.setLabel(this.items[index].label);
                } else if (this.items[index].labelHTML !== undefined) {
                    this._pulldown.setLabelHTML(this.items[index].labelHTML);
                }
                this._pulldown.setIcon(this.items[index].icon);
            }
            this.fire("change");
        } else {
            if (!this._grid.rows[index].isSelected) {
                this._grid.select(index);
            }
        }
        return this;
    },
    deselect: function deselect(index) {
        if (this.items.length <= index) {
            return this;
        }
        if (this.multiple) {
            var selectedIndex = this.selectedIndexes.indexOf(index);
            if (selectedIndex !== -1) {
                this.selectedIndexes.splice(this.selectedIndexes.indexOf(index), 1);
            }
        } else {
            this.selectedIndex = -1;
        }
        if (this.isPulldown) {
            this._pulldown.setLabel("-");
            this._pulldown.setIcon(null);
            this.fire("change");
        } else {
            if (this.multiple) {
                if (this._grid.rows[index].isSelected === true) {
                    this._grid.deselect(index);
                }
            } else {
                for (var i = 0, l = this.items.length; i < l; i++) {
                    if (this._grid.rows[i].isSelected === true) {
                        this._grid.deselect(i);
                    }
                }
            }
        }
        return this;
    },
    selectAll: function selectAll() {
        if (this.multiple) {
            this._grid.selectAll();
            this.selectedIndexes = [];
            for (var i = 0, l = this.items.length; i < l; i++) {
                this.selectedIndexes.push(i);
            }
        }
        return this;
    },
    deselectAll: function deselectAll() {
        if (this.multiple) {
            this._grid.deselectAll();
            this.selectedIndexes = [];
        } else {
            this.deselect();
        }
        return this;
    },
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        if (this.isPulldown) {
            this._pulldown.disable();
        } else {
            this._grid.disable();
        }
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        if (this.isPulldown) {
            this._pulldown.enable();
        } else {
            this._grid.enable();
        }
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    getValue: function getValue() {
        if (this.selectedIndex > -1) {
            return this.items[this.selectedIndex].value;
        } else {
            return void 0;
        }
    },
    getValues: function getValues() {
        var result = [];
        for (var i = 0, l = this.selectedIndexes.length; i < l; i++) {
            result.push(this.items[this.selectedIndexes[i]].value);
        }
        return result;
    }
};



},{"./element":15,"./grid":17,"./pulldown":23,"./util":36}],28:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Slider = undefined;
exports.createSlider = createSlider;

var _util = require("./util");

var _progress = require("./progress");

var progress = _interopRequireWildcard(_progress);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*?
    flagrate.createSlider(option)
    new flagrate.Slider(option)
    - option (Object) - options.
**/
function FSlider() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    //create
    var slider = new progress.Progress(opt);
    (0, _util.extendObject)(slider, this);
    slider.addClassName("flagrate-slider");
    if (slider.tabIndex === -1) {
        slider.tabIndex = 0;
    }
    if (window.ontouchstart !== undefined) {
        slider.addEventListener("touchstart", slider._onTouchStartHandler.bind(slider));
    }
    if (navigator.pointerEnabled) {
        slider.addEventListener("pointerdown", slider._onPointerDownHandler.bind(slider));
    } else if (navigator.msPointerEnabled) {
        // deprecated on IE11
        slider.addEventListener("MSPointerDown", slider._onPointerDownHandler.bind(slider));
    } else {
        slider.addEventListener("mousedown", slider._onPointerDownHandler.bind(slider));
    }
    if (opt.isDisabled) {
        slider.disable();
    }
    return slider;
}
var Slider = exports.Slider = FSlider;
function createSlider(option) {
    return new Slider(option);
}
Slider.prototype = {
    disable: function disable() {
        var slider = this;
        slider.dataset["flagrateTabIndex"] = slider.tabIndex.toString(10);
        slider.removeAttribute("tabindex");
        return slider.addClassName("flagrate-disabled");
    },
    enable: function enable() {
        var slider = this;
        var tabIndex = parseInt(slider.dataset["flagrateTabIndex"]);
        if (tabIndex !== -1) {
            slider.tabIndex = tabIndex;
        }
        return slider.removeClassName("flagrate-disabled");
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    _onTouchStartHandler: function _onTouchStartHandler(e) {
        if (!this.isEnabled()) {
            return;
        }
        e.preventDefault();
        this._slide(e.touches[0].pageX - this.cumulativeOffset().left, e.touches[0].clientX, "touch");
    },
    _onPointerDownHandler: function _onPointerDownHandler(e) {
        if (!this.isEnabled()) {
            return;
        }
        e.preventDefault();
        this._slide(e.offsetX || e.layerX, e.clientX, "pointer");
    },
    _slide: function _slide(x, pos, type) {
        var slider = this;
        var unitWidth = slider.getWidth() / slider.getMax();
        var onMove = function onMove(e) {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
                x = x + e.touches[0].clientX - pos;
                pos = e.touches[0].clientX;
            } else {
                x = x + e.clientX - pos;
                pos = e.clientX;
            }
            slider.setValue(Math.round(x / unitWidth));
            slider.fire("slide", { targetSlider: slider });
        };
        var onUp = function onUp(e) {
            e.preventDefault();
            if (type === "pointer") {
                if (navigator.pointerEnabled) {
                    document.removeEventListener("pointermove", onMove);
                    document.removeEventListener("pointerup", onUp);
                } else if (navigator.msPointerEnabled) {
                    document.removeEventListener("MSPointerUp", onUp);
                    document.removeEventListener("MSPointerMove", onMove);
                } else {
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                }
            } else if (type === "touch") {
                document.removeEventListener("touchmove", onMove);
                document.removeEventListener("touchend", onUp);
                document.removeEventListener("touchcancel", onUp);
            }
            if (e.clientX) {
                x = x + e.clientX - pos;
                slider.setValue(Math.round(x / unitWidth));
                slider.fire("slide", { targetSlider: slider });
            } else if (e.touches && e.touches[0]) {
                x = x + e.touches[0].clientX - pos;
                slider.setValue(Math.round(x / unitWidth));
                slider.fire("slide", { targetSlider: slider });
            }
        };
        if (type === "pointer") {
            if (navigator.pointerEnabled) {
                document.addEventListener("pointermove", onMove);
                document.addEventListener("pointerup", onUp);
            } else if (navigator.msPointerEnabled) {
                document.addEventListener("MSPointerMove", onMove);
                document.addEventListener("MSPointerUp", onUp);
            } else {
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
            }
        } else if (type === "touch") {
            document.addEventListener("touchmove", onMove);
            document.addEventListener("touchend", onUp);
            document.addEventListener("touchcancel", onUp);
        }
        slider.setValue(Math.round(x / unitWidth));
        slider.fire("slide", { targetSlider: slider });
    }
};



},{"./progress":22,"./util":36}],29:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Switch = undefined;
exports.createSwitch = createSwitch;

var _util = require("./util");

var _button = require("./button");

/*?
    flagrate.createSwitch(option)
    new flagrate.Switch(option)
    - option (Object) - options.
**/
function FSwitch() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    //create
    var sw = new _button.Button({
        id: opt.id,
        className: opt.className,
        attribute: opt.attribute,
        style: opt.style,
        isFocused: opt.isFocused,
        isDisabled: opt.isDisabled
    });
    (0, _util.extendObject)(sw, this);
    sw.addEventListener("select", sw.toggleSwitch.bind(sw));
    sw.addClassName("flagrate-switch");
    if (sw.dataset) {
        sw.dataset["flagrateSwitchStatus"] = opt.isOn ? "on" : "off";
    } else {
        sw.writeAttribute("data-flagrate-switch-status", opt.isOn ? "on" : "off");
    }
    return sw;
}
var Switch = exports.Switch = FSwitch;
function createSwitch(option) {
    return new Switch(option);
}
Switch.prototype = {
    isOn: function isOn() {
        if (this.dataset) {
            return this.dataset.flagrateSwitchStatus === "on";
        } else {
            return this.readAttribute("data-flagrate-switch-status") === "on";
        }
    },
    switchOn: function switchOn() {
        if (this.dataset) {
            this.dataset.flagrateSwitchStatus = "on";
        } else {
            this.writeAttribute("data-flagrate-switch-status", "on");
        }
        return this.fire("on", { targetSwitch: this }).fire("change", { targetSwitch: this });
    },
    switchOff: function switchOff() {
        if (this.dataset) {
            this.dataset.flagrateSwitchStatus = "off";
        } else {
            this.writeAttribute("data-flagrate-switch-status", "off");
        }
        return this.fire("off", { targetSwitch: this }).fire("change", { targetSwitch: this });
    },
    toggleSwitch: function toggleSwitch() {
        return this.isOn() ? this.switchOff() : this.switchOn();
    }
};



},{"./button":9,"./util":36}],30:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tab = undefined;
exports.createTab = createTab;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

/*?
    flagrate.createTab(option)
    new flagrate.Tab(option)
    - option (Object) - option.

    Create and initialize the tab.

    #### option

    * `id`            (String): `id` attribute of container.
    * `className`     (String):
    * `attribute`     (Object):
    * `style`         (Object): (using flagrate.Element.setStyle)
    * `tabs`          (Array): Array of **tab** object.
    * `selectedIndex` (Number):
    * `fill`          (Boolean; default `false`):
    * `bodyless`      (Boolean; default `false`):
    * `onSelect`      (Function): Triggered whenever select the tab.

    #### tab

    * `key`           (String):
    * `label`         (String):
    * `icon`          (String):
    * `text`          (String):
    * `html`          (String):
    * `element`       (Element):
    * `onSelect`      (Function):
**/
function FTab() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var attr = opt.attribute || {};
    attr["id"] = opt.id;
    attr["class"] = "flagrate flagrate-tab";
    if (opt.fill) {
        attr["class"] += " flagrate-tab-fill";
    }
    // create
    var tab = new _element.Element("div", attr);
    (0, _util.extendObject)(tab, this);
    if (opt.className) {
        tab.addClassName(opt.className);
    }
    if (opt.style) {
        tab.setStyle(opt.style);
    }
    tab._tabs = opt.tabs || [];
    tab._bodyless = opt.bodyless || false;
    tab._selectedIndex = opt.selectedIndex || 0;
    tab.onSelect = opt.onSelect || null;
    Object.defineProperties(tab, {
        tabs: {
            enumerable: true,
            get: function get() {
                return tab._tabs;
            },
            set: function set(tabs) {
                tab._tabs = tabs;
                tab._render();
            }
        },
        bodyless: {
            enumerable: true,
            get: function get() {
                return tab._bodyless;
            },
            set: function set(bodyless) {
                tab._bodyless = bodyless;
                tab.update()._create()._render();
            }
        },
        selectedIndex: {
            enumerable: true,
            get: function get() {
                return tab._selectedIndex;
            },
            set: function set(index) {
                tab.select(index);
            }
        }
    });
    tab._create()._render();
    if (tab.tabs.length > 0) {
        tab.select(tab.selectedIndex);
    }
    return tab;
}
var Tab = exports.Tab = FTab;
function createTab(option) {
    return new Tab(option);
}
Tab.prototype = {
    select: function select(a) {
        var tab = this;
        var index = typeof a === "number" ? a : tab.indexOf(a);
        if (index < 0 || index >= tab._tabs.length) {
            return tab;
        }
        if (0 <= tab._selectedIndex && tab._selectedIndex < tab._tabs.length && tab._tabs[tab._selectedIndex]._button) {
            tab._tabs[tab._selectedIndex]._button.removeClassName("flagrate-tab-selected");
        }
        tab._selectedIndex = index;
        var tabItem = tab._tabs[index];
        if (!tabItem || !tabItem._button) {
            return tab;
        }
        tabItem._button.addClassName("flagrate-tab-selected");
        if (tabItem.text) {
            tab._body.updateText(tabItem.text);
        }
        if (tabItem.html) {
            tab._body.update(tabItem.html);
        }
        if (tabItem.element) {
            tab._body.update(tabItem.element);
        }
        var tabEvent = window.event || {};
        tabEvent.targetTab = tab;
        tabEvent.targetTabItem = tabItem;
        if (tabItem.onSelect) {
            tabItem.onSelect.call(tab, tabEvent, tabItem);
        }
        if (tab.onSelect) {
            tab.onSelect(tabEvent, tabItem);
        }
        return tab;
    },
    unshift: function unshift(r) {
        var tab = this;
        if (r instanceof Array) {
            for (var i = 0, l = r.length; i < l; i++) {
                tab._tabs.unshift(r);
            }
        } else {
            tab._tabs.unshift(r);
        }
        tab._render();
        return tab._tabs.length;
    },
    push: function push(r) {
        var tab = this;
        if (r instanceof Array) {
            for (var i = 0, l = r.length; i < l; i++) {
                tab._tabs.push(r);
            }
        } else {
            tab._tabs.push(r);
        }
        tab._render();
        return tab._tabs.length;
    },
    shift: function shift(c) {
        var tab = this;
        var count = c || 1;
        var removes = [];
        for (var i = 0, l = tab._tabs.length; i < l && i < count; i++) {
            removes.push(tab._tabs.shift());
        }
        tab._render();
        return !c ? removes[0] : removes;
    },
    pop: function pop(c) {
        var tab = this;
        var count = c || 1;
        var removes = [];
        for (var i = 0, l = tab._tabs.length; i < l && i < count; i++) {
            removes.push(tab._tabs.pop());
        }
        tab._render();
        return !c ? removes[0] : removes;
    },
    splice: function splice(index, c, t) {
        var tab = this;
        c = typeof c === "undefined" ? this._tabs.length - index : c;
        var removes = tab._tabs.splice(index, c);
        if (t) {
            if (t instanceof Array === false) {
                t = [t];
            }
            for (var i = 0, l = t.length; i < l; i++) {
                tab._tabs.splice(index + i, 0, t[i]);
            }
        }
        tab._render();
        return removes;
    },
    removeTab: function removeTab(a) {
        var tab = this;
        var removes = [];
        var bulk = true;
        if (a instanceof Array === false) {
            bulk = false;
            a = [a];
        }
        for (var i = 0, l = a.length; i < l; i++) {
            var index = typeof a[i] === "number" ? a[i] : tab.indexOf(a[i]);
            if (index !== -1) {
                removes.push(tab.splice(index, 1));
            }
        }
        return bulk ? removes : removes[0];
    },
    indexOf: function indexOf(a) {
        var tab = this;
        if (typeof a === "string") {
            var index = -1;
            for (var i = 0, l = tab._tabs.length; i < l; i++) {
                if (tab._tabs[i].key === a) {
                    index = i;
                    break;
                }
            }
            return index;
        } else {
            return tab._tabs.indexOf(a);
        }
    },
    _create: function _create() {
        var tab = this;
        tab._head = new _element.Element("div", { "class": "flagrate-tab-head" }).insertTo(tab);
        if (tab._bodyless === true) {
            tab._body = new _element.Element();
        } else {
            tab._body = new _element.Element("div", { "class": "flagrate-tab-body" }).insertTo(tab);
        }
        return tab;
    },
    _render: function _render() {
        var tab = this;
        tab._head.update();
        tab._tabs.forEach(function (tabItem) {
            if (!tabItem._button) {
                tabItem._button = new _button.Button({
                    icon: tabItem.icon,
                    label: tabItem.label,
                    onSelect: tab._createOnSelectHandler(tabItem)
                });
            }
            tabItem._button.insertTo(tab._head);
        });
        return tab;
    },
    _createOnSelectHandler: function _createOnSelectHandler(tabItem) {
        var tab = this;
        return function (e) {
            if (/firefox/i.test(navigator.userAgent) === true) {
                window.event = e;
            }
            tab.select(tabItem);
        };
    }
};



},{"./button":9,"./element":15,"./util":36}],31:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextArea = undefined;
exports.createTextArea = createTextArea;

var _util = require("./util");

var _element = require("./element");

/*?
    flagrate.createTextArea(option)
    new flagrate.TextArea(option)
    - option (Object) - options.

    TextArea.

    #### option

    * `id`                       (String): `id` attribute of `textarea` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTextArea() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.regexp = option.regexp || null;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    if (option.placeholder) {
        attr["placeholder"] = option.placeholder;
    }
    //create
    var textArea = new _element.Element("textarea", attr);
    (0, _util.extendObject)(textArea, this);
    textArea.addClassName("flagrate flagrate-textarea");
    if (option.className) {
        textArea.addClassName(option.className);
    }
    if (option.style) {
        textArea.setStyle(option.style);
    }
    if (option.icon) {
        textArea.setIcon(option.icon);
    }
    if (option.value) {
        textArea.setValue(option.value);
    }
    if (option.isDisabled) {
        textArea.disable();
    }
    return textArea;
}
var TextArea = exports.TextArea = FTextArea;
function createTextArea(option) {
    return new TextArea(option);
}
TextArea.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this.writeAttribute("disabled", true);
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this.writeAttribute("disabled", false);
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    setValue: function setValue(value) {
        this.value = value;
        return this;
    },
    getValue: function getValue() {
        return this.value;
    },
    setIcon: function setIcon(identifier) {
        this._iconIdentifier = identifier;
        if (identifier) {
            return this.addClassName("flagrate-icon").setStyle({
                backgroundImage: "url(" + identifier + ")"
            });
        } else {
            return this.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
    },
    getIcon: function getIcon() {
        return this._iconIdentifier || "";
    },

    isValid: function isValid() {
        return this.regexp.test(this.getValue());
    }
};



},{"./element":15,"./util":36}],32:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextInput = undefined;
exports.createTextInput = createTextInput;

var _util = require("./util");

var _element = require("./element");

/*?
    flagrate.createTextInput(option)
    new flagrate.TextInput(option)
    - option (Object) - options.

    TextInput.

    #### option

    * `id`                       (String): `id` attribute of `input` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTextInput() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.regexp = option.regexp || null;
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    if (option.value) {
        attr["value"] = option.value;
    }
    if (option.placeholder) {
        attr["placeholder"] = option.placeholder;
    }
    //create
    var input = new _element.Element("input", attr);
    (0, _util.extendObject)(input, this);
    input.addClassName("flagrate flagrate-textinput");
    if (option.className) {
        input.addClassName(option.className);
    }
    if (option.style) {
        input.setStyle(option.style);
    }
    if (option.icon) {
        input.setIcon(option.icon);
    }
    if (option.isDisabled) {
        input.disable();
    }
    return input;
}
var TextInput = exports.TextInput = FTextInput;
function createTextInput(option) {
    return new TextInput(option);
}
TextInput.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this.writeAttribute("disabled", true);
        return this;
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this.writeAttribute("disabled", false);
        return this;
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    setValue: function setValue(value) {
        this.value = value;
        return this;
    },
    getValue: function getValue() {
        return this.value;
    },
    setIcon: function setIcon(identifier) {
        this._iconIdentifier = identifier;
        if (identifier) {
            return this.addClassName("flagrate-icon").setStyle({
                backgroundImage: "url(" + identifier + ")"
            });
        } else {
            return this.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
    },
    getIcon: function getIcon() {
        return this._iconIdentifier || "";
    },

    isValid: function isValid() {
        return this.regexp.test(this.getValue());
    }
};



},{"./element":15,"./util":36}],33:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tokenizer = undefined;
exports.createTokenizer = createTokenizer;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var _menu = require("./menu");

var _textInput = require("./text-input");

/*?
    flagrate.createTextInput(option)
    new flagrate.TextInput(option)
    - option (Object) - options.

    TextInput.

    #### option

    * `id`                       (String): `id` attribute of `input` element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `value`                    (String):
    * `placeholder`              (String):
    * `icon`                     (String):
    * `regexp`                   (RegExp):
    * `isDisabled`               (Boolean; default `false`):
**/
function FTokenizer() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.values = option.values || [];
    this.max = option.max || -1;
    this.tokenize = option.tokenize || option.tokenizeSync || _util.identity;
    if (option.onChange) {
        this.onChange = option.onChange;
    }
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    //create
    var tokenizer = new _element.Element("div", attr);
    (0, _util.extendObject)(tokenizer, this);
    tokenizer.addClassName("flagrate flagrate-tokenizer");
    if (option.className) {
        tokenizer.addClassName(option.className);
    }
    tokenizer._tokens = new _element.Element("span").insertTo(tokenizer);
    tokenizer._input = new _textInput.TextInput({ placeholder: option.placeholder }).insertTo(tokenizer);
    if (tokenizer.values.length !== 0) {
        tokenizer._updateTokens();
    }
    tokenizer.addEventListener("click", tokenizer._onClickHandler.bind(tokenizer));
    tokenizer._input.addEventListener("keydown", tokenizer._onKeydownHandler.bind(tokenizer));
    tokenizer._input.addEventListener("focus", tokenizer._onFocusHandler.bind(tokenizer));
    tokenizer._input.addEventListener("blur", tokenizer._onBlurHandler.bind(tokenizer));
    if (option.style) {
        tokenizer.setStyle(option.style);
    }
    if (option.icon) {
        tokenizer.setIcon(option.icon);
    }
    if (option.isDisabled) {
        tokenizer.disable();
    }
    return tokenizer;
}
var Tokenizer = exports.Tokenizer = FTokenizer;
function createTokenizer(option) {
    return new Tokenizer(option);
}
Tokenizer.prototype = {
    disable: function disable() {
        this.addClassName("flagrate-disabled");
        this._input.disable();
        return this._updateTokens();
    },
    enable: function enable() {
        this.removeClassName("flagrate-disabled");
        this._input.enable();
        return this._updateTokens();
    },
    isEnabled: function isEnabled() {
        return !this.hasClassName("flagrate-disabled");
    },
    setValues: function setValues(values) {
        this.values = values;
        return this._updateTokens();
    },
    getValues: function getValues() {
        return this.values;
    },
    removeValues: function removeValues() {
        this.values = [];
        return this._updateTokens();
    },
    removeValue: function removeValue(value) {
        this.values.splice(this.values.indexOf(value), 1);
        return this._updateTokens();
    },
    setIcon: function setIcon(identifier) {
        this._iconIdentifier = identifier;
        if (identifier) {
            this.addClassName("flagrate-icon").setStyle({
                backgroundImage: "url(" + identifier + ")"
            });
        } else {
            this.removeClassName("flagrate-icon").setStyle({
                backgroundImage: "none"
            });
        }
        return this._updateTokens();
    },
    getIcon: function getIcon() {
        return this._iconIdentifier || "";
    },
    focus: function focus() {
        this._input.focus();
    },
    _updateTokens: function _updateTokens() {
        var tokenizer = this;
        tokenizer._tokens.update();
        tokenizer.values.forEach(function (value) {
            var label = void 0;
            if (typeof value === "string") {
                label = value;
            } else {
                label = value.label;
            }
            new _button.Button({
                isDisabled: tokenizer.isEnabled() === false,
                isRemovableByUser: tokenizer.isEnabled(),
                onRemove: function onRemove() {
                    return tokenizer.removeValue(value);
                },
                label: label
            }).insertTo(tokenizer._tokens);
        });
        var vw = tokenizer.getWidth();
        var bw = tokenizer.getStyle("border-width") === null ? 2 : parseInt(tokenizer.getStyle("border-width").replace("px", ""), 10);
        var pl = tokenizer.getStyle("padding-left") === null ? 4 : parseInt(tokenizer.getStyle("padding-left").replace("px", ""), 10);
        var pr = tokenizer.getStyle("padding-right") === null ? 4 : parseInt(tokenizer.getStyle("padding-right").replace("px", ""), 10);
        var tw = tokenizer._tokens.getWidth();
        var tm = tokenizer._tokens.getStyle("margin-left") === null ? 2 : parseInt(tokenizer._tokens.getStyle("margin-left").replace("px", ""), 10);
        var im = tokenizer._input.getStyle("margin-left") === null ? 2 : parseInt(tokenizer._input.getStyle("margin-left").replace("px", ""), 10);
        var ip = tokenizer._input.getStyle("padding-left") === null ? 2 : parseInt(tokenizer._input.getStyle("padding-left").replace("px", ""), 10);
        var aw = vw - pl - pr - tw - tm - im - ip - bw * 2 - 2;
        if (aw > 30) {
            tokenizer._input.style.width = aw + "px";
        } else if (aw < -5) {
            tokenizer._input.style.width = "";
        } else {
            tokenizer._input.style.width = "100%";
        }
        tokenizer.fire("change");
        return this;
    },
    _tokenize: function _tokenize() {
        this._candidates = [];
        var str = this._input.value;
        var result = this.tokenize(str, this._tokenized.bind(this));
        if (result !== void 0) {
            this._tokenized(result);
        }
        this._lastTokenizedValue = this._input.value;
        return this;
    },
    _tokenized: function _tokenized(candidates) {
        if (candidates instanceof Array === false) {
            candidates = [candidates];
        }
        this._candidates = [];
        var menu = new _menu.Menu({
            onSelect: function onSelect() {
                return menu.remove();
            }
        });
        menu.style.left = this._input.offsetLeft + "px";
        for (var i = 0, l = candidates.length, candidate, menuItem; i < l; i++) {
            candidate = candidates[i];
            if (typeof candidate === "string") {
                if (candidate === "") {
                    continue;
                }
                menuItem = { label: candidate };
            } else {
                menuItem = candidate;
            }
            if (menuItem.onSelect) {
                menuItem._onSelect = menuItem.onSelect;
            }
            menuItem.onSelect = _createMenuOnSelectHandler(this, candidate);
            this._candidates.push(candidate);
            menu.push(menuItem);
        }
        if (this._menu) {
            this._menu.remove();
        }
        if (this._candidates.length !== 0) {
            this.insert({ top: menu });
            this._menu = menu;
        }
        return this;
    },
    _onClickHandler: function _onClickHandler() {
        this.focus();
    },
    _onKeydownHandler: function _onKeydownHandler(e) {
        var _this = this;

        // ENTER:13
        if (e.keyCode === 13 && this._lastTokenizedValue !== this._input.value) {
            e.stopPropagation();
            e.preventDefault();
            this._lastTokenizedValue = this._input.value;
            this._tokenize();
            return;
        }
        if (this._candidates && this._candidates.length !== 0) {
            if (
            // ENTER:13
            e.keyCode === 13 ||
            // right:39
            e.keyCode === 39) {
                e.stopPropagation();
                e.preventDefault();
                this._input.value = "";
                if (this.max < 0 || this.max > this.values.length) {
                    this.values.push(this._candidates[0]);
                }
                this._updateTokens();
                if (this.onChange) {
                    this.onChange();
                }
                if (this._menu) {
                    this._menu.remove();
                }
            }
        }
        if (this._input.value === "" && this.values.length !== 0) {
            if (
            // BS:8
            e.keyCode === 8) {
                e.stopPropagation();
                e.preventDefault();
                var value = this.values.pop();
                this._input.value = typeof value === "string" ? value : typeof value.value === "string" ? value.value : "";
                this._updateTokens();
                if (this.onChange) {
                    this.onChange();
                }
                if (this._menu) {
                    this._menu.remove();
                }
            }
        }
        setTimeout(function () {
            if (_this.max > -1 && _this.max <= _this.values.length && _this._input.value !== "") {
                e.stopPropagation();
                _this._input.value = "";
                return;
            }
            _this._tokenize();
        }, 0);
    },
    _onFocusHandler: function _onFocusHandler() {
        this._updateTokens();
        this._tokenize();
        this.addClassName("flagrate-tokenizer-focus");
    },
    _onBlurHandler: function _onBlurHandler() {
        var _this2 = this;

        this._input.value = "";
        if (this._menu) {
            this._menu.style.opacity = "0";
            setTimeout(function () {
                return _this2._menu.remove();
            }, 500);
        }
        this.removeClassName("flagrate-tokenizer-focus");
    }
};
function _createMenuOnSelectHandler(tokenizer, candidate) {
    return function (e) {
        if (tokenizer.max < 0 || tokenizer.max > tokenizer.values.length) {
            tokenizer.values.push(candidate);
        }
        tokenizer._updateTokens();
        if (tokenizer.onChange) {
            tokenizer.onChange(e, this);
        }
    };
}



},{"./button":9,"./element":15,"./menu":18,"./text-input":32,"./util":36}],34:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Toolbar = undefined;
exports.createToolbar = createToolbar;

var _util = require("./util");

var _element = require("./element");

/*?
    flagrate.createToolbar(option)
    new flagrate.Toolbar(option)
    - option (Object) - options.

    Toolbar.

    #### option

    * `id`                       (String): `id` attribute of container element.
    * `className`                (String):
    * `attribute`                (Object):
    * `style`                    (Object): (using flagrate.Element.setStyle)
    * `items`                    (Array): of item or String to create border, Element to insert any element.

    #### item

    * `key`                      (String):
    * `element`                  (Element):
**/
function FToolbar() {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var items = option.items || [];
    var attr = option.attribute || {};
    if (option.id) {
        attr["id"] = option.id;
    }
    //create
    var container = new _element.Element("div", attr);
    (0, _util.extendObject)(container, this);
    container.addClassName("flagrate flagrate-toolbar");
    if (option.className) {
        container.addClassName(option.className);
    }
    if (option.style) {
        container.setStyle(option.style);
    }
    for (var i = 0, l = items.length; i < l; i++) {
        container.push(items[i]);
    }
    return container;
}
var Toolbar = exports.Toolbar = FToolbar;
function createToolbar(option) {
    return new Toolbar(option);
}
Toolbar.prototype = {
    push: function push(option) {
        if (typeof option === "string") {
            new _element.Element("hr").insertTo(this);
        } else if (option instanceof HTMLElement) {
            this.insert(option);
        } else {
            var element = void 0;
            if (option.isBorder) {
                element = new _element.Element("hr").insertTo(this);
            } else {
                if (!option.element.isFlagrated) {
                    option.element = _element.Element.extend(option.element);
                }
                element = _element.Element.insertTo(option.element, this);
            }
            if (option.key) {
                element.dataset["_key"] = option.key;
            }
        }
        return this;
    },
    getElementByKey: function getElementByKey(key) {
        var elements = this.childNodes;
        for (var i = 0, l = elements.length; i < l; i++) {
            if (elements[i].dataset["_key"] === key) {
                return elements[i];
            }
        }
        return null;
    },
    getElements: function getElements() {
        return this.childNodes || [];
    }
};



},{"./element":15,"./util":36}],35:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tutorial = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createTutorial = createTutorial;

var _util = require("./util");

var _element = require("./element");

var _button = require("./button");

var _popover = require("./popover");

var _modal = require("./modal");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*?
    flagrate.createTutorial(option)
    new flagrate.Tutorial(option)
    - option (Object) - options.

    Creates new tutorial.

    #### option

    * `steps`              (Array; required): Array of **step** object.
    * `count`              (Number; default `0`): current count of step.
    * `onFinish`           (Function): callback when finish.
    * `onAbort`            (Function): callback when abort.
    * `onClose`            (Function): callback when close.

    #### step

    * `target`             (Element|String): Element to target. If target is undefined or not found, will creates flagrate.Modal.
    * `title`              (String): Title for this step.
    * `text`               (String): Descriptive text for this step.
    * `html`               (String): Descriptive html for this step.
    * `onStep`             (Function): Triggered whenever a step is started.
    * `onBeforeStep`       (Function): Triggered at before starting of this step.
    * `onAfterStep`        (Function): Triggered at after of this step.

    ##### onBeforeStep / onAfterStep

        // async callback
        function (done) {// if expects callback, will waits for it.
            setTimeout(done, 1000);
        }

        // sync
        function () {
            // ...
        }
**/
var Tutorial = exports.Tutorial = function () {
    function Tutorial() {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Tutorial);

        this.onFinish = _util.emptyFunction;
        this.onAbort = _util.emptyFunction;
        this.onClose = _util.emptyFunction;
        this._steps = [];
        this._index = 0;
        if (opt.steps) {
            this._steps = opt.steps;
        }
        if (opt.index) {
            this._index = opt.index;
        }
        if (opt.onFinish) {
            this.onFinish = opt.onFinish;
        }
        if (opt.onAbort) {
            this.onAbort = opt.onAbort;
        }
        if (opt.onClose) {
            this.onClose = opt.onClose;
        }
    }

    _createClass(Tutorial, [{
        key: "visible",
        value: function visible() {
            return !!this._popover || !!this._modal || !!this._inStep;
        }
    }, {
        key: "open",
        value: function open() {
            if (this.visible() === false) {
                this._main();
            }
            return this;
        }
    }, {
        key: "close",
        value: function close() {
            if (this.visible() === true) {
                this._afterStep(this.onClose.bind(this));
            }
            return this;
        }
    }, {
        key: "abort",
        value: function abort() {
            if (this.visible() === true) {
                this._afterStep(this.onAbort.bind(this));
            }
            return this;
        }
    }, {
        key: "finish",
        value: function finish() {
            this._afterStep(this.onFinish.bind(this));
            this._index = 0;
            return this;
        }
    }, {
        key: "prev",
        value: function prev() {
            var _this = this;

            this._afterStep(function () {
                if (_this._index > 0) {
                    --_this._index;
                }
                _this._main();
            });
            return this;
        }
    }, {
        key: "next",
        value: function next() {
            var _this2 = this;

            this._afterStep(function () {
                if (_this2._index + 1 < _this2._steps.length) {
                    ++_this2._index;
                }
                _this2._main();
            });
            return this;
        }
    }, {
        key: "_main",
        value: function _main() {
            this._inStep = true;
            var step = this._steps[this._index];
            if (step.onBeforeStep) {
                if (step.onBeforeStep.length) {
                    step.onBeforeStep.call(this, this._step.bind(this));
                    return this;
                } else {
                    step.onBeforeStep.call(this);
                }
            }
            this._step();
            return this;
        }
    }, {
        key: "_step",
        value: function _step() {
            var _this3 = this;

            var step = this._steps[this._index];
            var buttons = [];
            if (this._index + 1 >= this._steps.length) {
                buttons.push({
                    className: "flagrate-tutorial-button-finish",
                    onSelect: function onSelect() {
                        _this3._afterStep(_this3.finish.bind(_this3));
                    }
                });
            } else {
                buttons.push({
                    className: "flagrate-tutorial-button-next",
                    onSelect: function onSelect() {
                        _this3._afterStep(_this3.next.bind(_this3));
                    }
                });
            }
            if (this._index > 0) {
                buttons.push({
                    className: "flagrate-tutorial-button-prev",
                    onSelect: function onSelect() {
                        _this3._afterStep(_this3.prev.bind(_this3));
                    }
                });
            }
            if (this._index + 1 < this._steps.length) {
                buttons.push({
                    className: "flagrate-tutorial-button-abort",
                    onSelect: function onSelect() {
                        _this3._afterStep(_this3.abort.bind(_this3));
                    }
                });
            }
            buttons[0].color = "@primary";
            var target = void 0;
            if (typeof step.target === "string") {
                target = document.querySelector(step.target);
            } else if (_element.Element.isElement(step.target) === true) {
                target = step.target;
            }
            if (target) {
                var container = new _element.Element();
                var body = new _element.Element();
                if (step.html) {
                    body.insert(step.html).insertTo(container);
                }
                if (step.text) {
                    body.insertText(step.text).insertTo(container);
                }
                var buttonContainer = new _element.Element("footer").insertTo(container);
                buttons.forEach(function (button) {
                    new _button.Button(button).insertTo(buttonContainer);
                });
                this._popover = new _popover.Popover({
                    className: "flagrate-tutorial",
                    element: container
                });
                this._popover.open(target);
            } else {
                this._modal = new _modal.Modal({
                    disableCloseByMask: true,
                    disableCloseButton: true,
                    disableCloseByEsc: true,
                    className: "flagrate-tutorial",
                    title: step.title,
                    text: step.text,
                    html: step.html,
                    buttons: buttons
                });
                this._modal.open();
            }
            if (step.onStep) {
                step.onStep.call(this);
            }
            return this;
        }
    }, {
        key: "_afterStep",
        value: function _afterStep(done) {
            this._inStep = false;
            var pp = false;
            if (this._popover) {
                pp = true;
                this._popover.remove();
                delete this._popover;
            }
            if (this._modal) {
                pp = true;
                this._modal.close();
                delete this._modal;
            }
            if (pp === true) {
                var step = this._steps[this._index];
                if (step.onAfterStep) {
                    if (step.onAfterStep.length) {
                        step.onAfterStep.call(this, done);
                        return this;
                    } else {
                        step.onAfterStep.call(this);
                    }
                }
            }
            done();
            return this;
        }
    }]);

    return Tutorial;
}();

function createTutorial(option) {
    return new Tutorial(option);
}



},{"./button":9,"./element":15,"./modal":19,"./popover":21,"./util":36}],36:[function(require,module,exports){
/*
   Copyright 2016 Webnium

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";
/**
 * Identity.
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.identity = identity;
exports.extendObject = extendObject;
exports.emptyFunction = emptyFunction;
function identity(a) {
    return a;
}
/**
 * Extend Object.
 */
function extendObject(dest, source) {
    var k = void 0;
    for (k in source) {
        dest[k] = source[k];
    }
    return dest;
}
function emptyFunction() {}
/*?
    Flagrate#jsonPointer

    ref: node-jsonpointer https://github.com/janl/node-jsonpointer
    ref: http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-08
**/
/**
 * JSON Pointer Implementation.
 */
var jsonPointer = exports.jsonPointer = undefined;
(function (jsonPointer) {
    function get(object, pointer) {
        var pts = validate_input(object, pointer);
        if (pts.length === 0) {
            return object;
        }
        return traverse(object, pts);
    }
    jsonPointer.get = get;
    function set(object, pointer, value) {
        if (pointer === "" && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
            extendObject(object, value);
            return value;
        } else {
            var pts = validate_input(object, pointer);
            if (pts.length === 0) {
                throw new Error("Invalid JSON pointer for set.");
            }
            return traverse(object, pts, value, true);
        }
    }
    jsonPointer.set = set;
    function untilde(str) {
        return str.replace(/~[01]/g, function (m) {
            switch (m) {
                case "~0":
                    return "~";
                case "~1":
                    return "/";
            }
            throw new Error("Invalid tilde escape: " + m);
        });
    }
    function traverse(object, pts, value, isSet) {
        var part = untilde(pts.shift());
        if (/^\d+$/.test(part)) {
            part = parseInt(part, 10);
        }
        if (pts.length !== 0) {
            if (isSet && _typeof(object[part]) !== "object") {
                if (value === void 0) {
                    return value;
                }
                if (/^\d+$/.test(pts[0])) {
                    object[part] = [];
                } else {
                    object[part] = {};
                }
            }
            return traverse(object[part], pts, value, isSet);
        }
        // we're done
        if (!isSet) {
            // just reading
            return object[part];
        }
        // set new value, and return
        if (value === void 0) {
            delete object[part];
        } else {
            object[part] = value;
        }
        return value;
    }
    function validate_input(object, pointer) {
        if ((typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") {
            throw new Error("Invalid input object.");
        }
        if (pointer === "") {
            return [];
        }
        if (!pointer) {
            throw new Error("Invalid JSON pointer.");
        }
        var pts = pointer.split("/");
        if (pts.shift() !== "") {
            throw new Error("Invalid JSON pointer.");
        }
        return pts;
    }
})(jsonPointer || (exports.jsonPointer = jsonPointer = {}));



},{}]},{},[5])
//# sourceMappingURL=kuromaty.js.map
