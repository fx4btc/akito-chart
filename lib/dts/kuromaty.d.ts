declare module "Order" {
    import { Decimal } from "decimal.js-light";
    export type Side = "L" | "S" | "L/S";
    export interface OrderLike {
        time: number;
        price: number | string;
        origSize: number | string;
        size: number | string;
        side: Side;
        type: string;
    }
    export class Order {
        readonly time: number;
        readonly price: Decimal;
        readonly origSize: Decimal;
        readonly size: Decimal;
        readonly side: Side;
        readonly type: string;
        constructor(order: OrderLike);
        merge(order: Order): void;
    }
}
declare module "OrderSet" {
    import { Order, OrderLike } from "Order";
    export class OrderSet {
        private orders;
        private _length;
        constructor(orders?: OrderLike[]);
        add(position: Order): void;
        forEach(callbackFn: any): void;
        isEmpty(): boolean;
    }
}
declare module "Position" {
    import { Decimal } from "decimal.js-light";
    export type Side = "L" | "S";
    export interface PositionLike {
        time: number;
        price: number | string;
        size: number | string;
        side: Side;
    }
    export class Position {
        readonly time: number;
        readonly price: Decimal;
        readonly size: Decimal;
        readonly side: Side;
        private _sideSign;
        constructor(position: PositionLike);
        marginAgainst(price: number): number;
        merge(position: Position): void;
    }
}
declare module "PositionSet" {
    import { Position, PositionLike } from "Position";
    export class PositionSet {
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
}
declare module "util" {
    export function zeroPadding(number: number, length: number): string;
    export function generatePriceGrouping(decimal: any, groupSize: number): (price: number) => number;
    export function toStringWithSign(number: number): string;
    export function copyTextToClipboard(text: string): void;
    export function deepCopy<T>(obj: T): T;
}
declare module "kuromaty" {
    import { PositionLike } from "Position";
    import { OrderLike } from "Order";
    /** time, open, high, low, close, volume, askDepth, bidDepth, sellVolume, buyVolume */
    export type Bar = [number, number, number, number, number, number, number, number, number, number];
    /** time, ltp, volume, askDepth, bidDepth, sellVolume, buyVolume */
    export type Tick = [number, number, number, number, number, number, number];
    export interface Options {
        chartCount?: number;
        chartTitles?: string[];
        chartOverlay?: boolean;
        barWidth?: number;
        barMargin?: number;
        decimalPower?: number;
        boardGroupSize?: number;
        pricePopEffect?: boolean;
        quickOrder?: boolean;
        quickOrderHandler?: (order: QuickOrder) => void;
    }
    export interface QuickOrder {
        price: number;
        type: "limit" | "stop-limit";
    }
    export interface ColorOption {
        bg?: string;
        text?: string;
        textStrong?: string;
        textWeak?: string;
        short?: string;
        long?: string;
        askOrder?: string;
        bidOrder?: string;
        volume?: string;
        askDepth?: string;
        bidDepth?: string;
        askDepthLast?: string;
        bidDepthLast?: string;
        grid?: string;
        border?: string;
        borderText?: string;
        borderLTP?: string;
        borderLTPText?: string;
        lineMA1?: string;
        lineMA2?: string;
        lineMA3?: string;
    }
    export interface Board {
        asks: BoardItem[];
        bids: BoardItem[];
    }
    export interface BoardItem {
        price: number;
        size: number;
    }
    export interface Chart {
        title: string;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        bars: Bar[];
        hBars: Bar[];
        _bars: Bar[];
        ticks: Tick[];
        board: Board;
        boardMaxSize: number;
        range: number;
        highest: number;
        highestPrice: number;
        highestPricePrinted: boolean;
        lowest: number;
        lowestPrice: number;
        lowestPricePrinted: boolean;
        askPrice: number;
        bidPrice: number;
        maxVolume: number;
        volumeRatio: number;
        maxDepth: number;
        minDepth: number;
        depthRatio: number;
        latest: number;
        ratio: number;
        tickDelta: number;
        selected: boolean;
    }
    export interface InLayer {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }
    export type Position = PositionLike;
    export class Kuromaty {
        options: Options;
        timePeriod: number;
        barIndex: number;
        cursorPrice: number;
        cursorVolume: number;
        cursorBoard: number;
        cursorBoardPrice: number;
        pinnedPrices: number[];
        maxBarCount: number;
        hasDepleted: boolean;
        color: ColorOption;
        cursorX: number;
        cursorY: number;
        canvasW: number;
        canvasH: number;
        charts: Chart[];
        overlay: InLayer;
        grid: InLayer;
        canvases: HTMLCanvasElement[];
        contexts: CanvasRenderingContext2D[];
        private _dpr;
        private _rootContainer;
        private _chartContainer;
        private _hasUpdated;
        private _hasRemoved;
        private _afr;
        private _afs;
        private _pricePops;
        private _lastPointerdown;
        private _lastPointerButtons;
        private _dragStartX;
        private _dragStartI;
        private _decimal;
        private _positions;
        private _orders;
        private _contextMenu;
        private __keydownHandler;
        constructor(container?: Element, options?: Options);
        insertTo(container: Element): void;
        remove(): void;
        resize(): void;
        zoom(delta: number): void;
        update(index: number, bars: Bar[]): void;
        updateHBars(index: number, hBars: Bar[]): void;
        tick(index: number, tick: Tick): void;
        updateBoard(index: number, board: Board): void;
        setColor(option: ColorOption): void;
        setPositions(positions: PositionLike[]): void;
        setOrders(orders: OrderLike[]): void;
        private _create();
        private _addListeners();
        private _removeListeners();
        private _redraw();
        private _draw();
        private _drawPricePopEffect(chart, decimal, chartW, ltpp);
        private _getBars(index, start, barCount);
        private _keydownHandler(ev);
        private _contextmenuHandler(ev);
        private _pointerdownHandler(ev);
        private _pointerupHandler(ev);
        private _pointermoveHandler(ev);
        private _pointeroutHandler(ev);
        private _wheelHandler(ev);
        private _drawBorder(ctx, x, y, w, color, lineDash);
        private _drawVerticalRange(ctx, x, y, h, color, lineDash);
        private _drawPriceTag(ctx, x, y, w, price, color, textColor, lineDash, tagColor?, alpha?);
        private _drawPriceTag2(ctx, x, y, w, price, color, lineDash);
        private _drawDepthIndicator(ctx, x, y, value, color);
        private _drawPositionMarker(ctx, x, y, w, position, ltp);
        private _drawOrderMarker(ctx, x, y, w, order, ltp);
        private _drawSMA(ctx, x, chart, count, value, color);
    }
    global  {
        interface Window {
            Kuromaty: typeof Kuromaty;
        }
    }
    export default Kuromaty;
}
