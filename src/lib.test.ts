import { parseBooleanMesssage, hammingCode, hammingDecode, createBooleanMesssage, applyError } from "./lib";

console.log(
    "0101",
    parseBooleanMesssage(hammingCode(createBooleanMesssage("0101"))),
    parseBooleanMesssage(hammingDecode(hammingCode(createBooleanMesssage("0101")))[0])
);

const m = "10010101111";

console.log(
    m,
    m.length,
    parseBooleanMesssage(hammingCode(createBooleanMesssage(m))),
    parseBooleanMesssage(hammingCode(createBooleanMesssage(m))).length,
    parseBooleanMesssage(hammingDecode(hammingCode(createBooleanMesssage(m)))[0]),
    parseBooleanMesssage(hammingDecode(hammingCode(createBooleanMesssage(m)))[0]).length
);

console.log(
    parseBooleanMesssage(hammingDecode(applyError(hammingCode(createBooleanMesssage(m)), 1))[0]),
    parseBooleanMesssage(hammingDecode(applyError(hammingCode(createBooleanMesssage(m)), 1))[0]).length
);
