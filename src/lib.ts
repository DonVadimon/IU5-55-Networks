export const bitsCount = (a: number) => Math.ceil(Math.log2(a + 1));

export const div = (a: number, b: number) => (a - (a % b)) / b;

const bitOnesCount = (a: number) => {
    let onesCount = 0;
    while (a !== 0) {
        onesCount += a % 2;
        a = div(a, 2);
    }
    return onesCount;
};

export const getCountOfControlBits = (n: number) => {
    let k = bitsCount(n);
    while (k !== Math.ceil(Math.log2(n + +(n !== 2) + k))) {
        k++;
    }
    return k;
};

export const generateErrors = (codedWord: number) =>
    Array.from({ length: 2 ** bitsCount(codedWord) }, (_, index) => index).reduce<Record<number, number[]>>(
        (accum, num) => {
            const arr = (accum[bitOnesCount(num)] ??= []);
            if (arr.length < 101) {
                arr.push(num);
            }
            return accum;
        },
        {}
    );

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
    const countOfControlBits = getCountOfControlBits(bitsCount(message));
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
    const countOfControlBits = getCountOfControlBits(bitsCount(code));
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

export const formatCode = (num: number, baseNum: number) => num.toString(2).padStart(bitsCount(baseNum), "0");
