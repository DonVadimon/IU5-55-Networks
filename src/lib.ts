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

export const getCountOfControlBits = (binLength: number) => {
    let k = bitsCount(binLength);
    while (k !== Math.ceil(Math.log2(binLength + +(binLength !== 2) + k))) {
        k++;
    }
    return k;
};

export const isEqualArrays = <T extends unknown>(a: T[], b: T[]) =>
    a.length === b.length && a.every((_, i) => a[i] === b[i]);

export const generateErrors = (codedWord: boolean[]) =>
    Array.from({ length: 2 ** codedWord.length }, (_, index) => index).reduce<Record<number, number[]>>(
        (accum, num) => {
            const arr = (accum[bitOnesCount(num)] ??= []);
            arr.push(num);
            return accum;
        },
        {}
    );

export const applyError = (_word: boolean[], error: number) => {
    const word = [..._word];
    for (let i = word.length - 1; error !== 0; i--) {
        if (error % 2 !== 0) {
            word[i] = !word[i];
        }
        error = div(error, 2);
    }
    return word;
};

export const multiplyRows = (message: boolean[], rowNumber: number): boolean => {
    const step = 2 ** rowNumber;

    let controlBit = false;

    for (let i = 0, j = div(1, step); i < message.length; i++, j = div(i + 1, step)) {
        if (j % 2 !== 0) {
            controlBit = controlBit !== message[i];
        }
    }

    return controlBit;
};

export const hammingCode = (_message: boolean[]) => {
    const message = [..._message];
    const countOfControlBits = getCountOfControlBits(message.length);

    for (let i = 0; i < countOfControlBits; i++) {
        message.splice(2 ** i - 1, 0, false);
    }

    for (let i = 0; i < countOfControlBits; i++) {
        message[2 ** i - 1] = multiplyRows(message, i);
    }

    return message;
};

export const hammingDecode = (_message: boolean[]): [decoded: boolean[], error: boolean, syndrom: boolean[]] => {
    const message = [..._message];
    const countOfControlBits = Math.ceil(Math.log2(message.length));

    const syndrom = [];
    let errorIndex = -1;
    for (let indexOfControlBit = 0; indexOfControlBit < countOfControlBits; indexOfControlBit++) {
        const isErrorBit = multiplyRows(message, indexOfControlBit);
        if (isErrorBit) {
            errorIndex += 2 ** indexOfControlBit;
        }
        syndrom.unshift(isErrorBit);
    }

    if (errorIndex !== -1) {
        message[errorIndex] = !message[errorIndex];
    }

    for (let i = countOfControlBits - 1; i >= 0; i--) {
        message.splice(2 ** i - 1, 1);
    }
    return [message, errorIndex !== -1, syndrom];
};

export const createBooleanMesssage = (msg: string) => msg.split("").map((char) => char === "1");

export const parseBooleanMesssage = (msg: boolean[]) => msg.map((cur) => (cur ? "1" : "0")).join("");

export const formatCode = (num: number, length: number) => num.toString(2).padStart(length, "0");
