"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hammingDecode = exports.hammingCode = exports.multipyRows = exports.div = exports.getCountOfControlBits = void 0;
const getCountOfControlBits = (n) => {
    let k = Math.ceil(Math.log2(n + 1));
    while (k !== Math.ceil(Math.log2(n + +(n !== 2) + k))) {
        k++;
    }
    return k;
};
exports.getCountOfControlBits = getCountOfControlBits;
const div = (a, b) => (a - (a % b)) / b;
exports.div = div;
const multipyRows = (firstRow, secondRowIndex) => {
    const step = 2 ** secondRowIndex;
    let r = false;
    for (let j = step - 1, countOfLastOnes = step; j < 32; j++) {
        r = r !== (((2 ** j) & firstRow) !== 0);
        countOfLastOnes--;
        if (countOfLastOnes === 0) {
            j += step;
            countOfLastOnes = step;
        }
    }
    return r;
};
exports.multipyRows = multipyRows;
const hammingCode = (message) => {
    const countOfControlBits = (0, exports.getCountOfControlBits)(Math.ceil(Math.log2(message + 1)));
    for (let i = 0; i < countOfControlBits; i++) {
        const indexOfControlBit = 2 ** (2 ** i - 1);
        message = (0, exports.div)(message, indexOfControlBit) * indexOfControlBit * 2 + (message % indexOfControlBit);
    }
    for (let indexOfControlBit = 0; indexOfControlBit < countOfControlBits; indexOfControlBit++) {
        if ((0, exports.multipyRows)(message, indexOfControlBit)) {
            message += 2 ** (2 ** indexOfControlBit - 1);
        }
    }
    return message;
};
exports.hammingCode = hammingCode;
const hammingDecode = (code) => {
    const countOfControlBits = Math.ceil(Math.log2(code + 1));
    let errorIndex = -1;
    for (let indexOfControlBit = 0; indexOfControlBit < countOfControlBits; indexOfControlBit++) {
        if ((0, exports.multipyRows)(code, indexOfControlBit)) {
            errorIndex += 2 ** indexOfControlBit;
        }
    }
    if (errorIndex !== -1) {
        code ^= 2 ** errorIndex;
    }
    for (let i = countOfControlBits - 1; i >= 0; i--) {
        const ki = 2 ** (2 ** i - 1);
        code = (0, exports.div)(code, ki * 2) * ki + (code % ki);
    }
    return code;
};
exports.hammingDecode = hammingDecode;
// const a = 52;
// console.log(hammingDecode(hammingCode(a) ^ (2 ** 2)));
