export const getCountOfControlBits = (n: number) => {
    let k = Math.ceil(Math.log2(n + 1));
    while (k !== Math.ceil(Math.log2(n + +(n !== 2) + k))) {
        k++;
    }
    return k;
};

export const div = (a: number, b: number) => (a - (a % b)) / b;

export const multipyRows = (firstRow: number, secondRowIndex: number) => {
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

export const hammingCode = (message: number) => {
    const countOfControlBits = getCountOfControlBits(Math.ceil(Math.log2(message + 1)));
    for (let i = 0; i < countOfControlBits; i++) {
        const indexOfControlBit = 2 ** (2 ** i - 1);
        message = div(message, indexOfControlBit) * indexOfControlBit * 2 + (message % indexOfControlBit);
    }

    for (let indexOfControlBit = 0; indexOfControlBit < countOfControlBits; indexOfControlBit++) {
        if (multipyRows(message, indexOfControlBit)) {
            message += 2 ** (2 ** indexOfControlBit - 1);
        }
    }

    return message;
};

export const hammingDecode = (code: number) => {
    const countOfControlBits = Math.ceil(Math.log2(code + 1));
    let errorIndex = -1;
    for (let indexOfControlBit = 0; indexOfControlBit < countOfControlBits; indexOfControlBit++) {
        if (multipyRows(code, indexOfControlBit)) {
            errorIndex += 2 ** indexOfControlBit;
        }
    }

    if (errorIndex !== -1) {
        code ^= 2 ** errorIndex;
    }

    for (let i = countOfControlBits - 1; i >= 0; i--) {
        const ki = 2 ** (2 ** i - 1);
        code = div(code, ki * 2) * ki + (code % ki);
    }
    return code;
};

// const a = 52;
// console.log(hammingDecode(hammingCode(a) ^ (2 ** 2)));
