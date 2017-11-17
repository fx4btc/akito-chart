/*!
    Copyright 2017 Kuromatch
*/
import flagrate from "flagrate/lib/es6/flagrate";
export function zeroPadding(number, length) {
    return (Array(length).join("0") + number).slice(-length);
}
export function generatePriceGrouping(decimal, groupSize) {
    if (decimal === 1) {
        return (price) => Math.round(price / groupSize) * groupSize;
    }
    return (price) => Math.round(price * (decimal / groupSize)) / (decimal / groupSize);
}
export function toStringWithSign(number) {
    return (number > 0 ? "+" : "") + number.toString(10);
}
export function copyTextToClipboard(text) {
    const span = flagrate.createElement("span")
        .insertText(text)
        .insertTo(document.body);
    const range = document.createRange();
    range.selectNode(span);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    span.remove();
}
export function deepCopy(obj) {
    let newObj;
    if (Array.isArray(obj)) {
        newObj = obj.length > 0 ? obj.slice(0) : [];
        newObj.forEach((e, i) => {
            if ((typeof e === "object" && e !== {}) ||
                (Array.isArray(e) && e.length > 0)) {
                newObj[i] = deepCopy(e);
            }
        });
    }
    else if (typeof obj === "object") {
        newObj = Object.assign({}, obj);
        Object.keys(newObj).forEach((key) => {
            if ((typeof newObj[key] === "object" && newObj[key] !== {}) ||
                (Array.isArray(newObj[key]) && newObj[key].length > 0)) {
                newObj[key] = deepCopy(newObj[key]);
            }
        });
    }
    else {
        newObj = obj;
    }
    return newObj;
}

//# sourceMappingURL=util.js.map
