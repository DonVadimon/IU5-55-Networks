import express, { Request, Response } from "express";
import path from "path";
import morgan from "morgan";

import { hammingCode, hammingDecode, generateErrors, formatCode } from "./lib";

const port = process.env.PORT || 5000;

type HammingReq = {
    word: number;
};

type HammingError = {
    error: string;
    errorWord: string;
    decodedWord: string;
};

type HammingRes = {
    word: string;
    codedWord: string;
    errors: HammingError[][];
};

const app = express();
app.use(express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));

app.get("/", (_, res) => res.sendFile(path.join(__dirname, "static", "index.html")));

app.get("/hamming", (req: Request<{}, {}, HammingReq>, res: Response<HammingRes>) => {
    const word = req.body?.word ?? 5;

    const codedWord = hammingCode(word);

    const errors = Object.entries(generateErrors(codedWord)).reduce<HammingError[][]>(
        (accum, [multiplicity, errors]) => {
            accum[+multiplicity] = errors.map<HammingError>((error) => ({
                error: formatCode(error, codedWord),
                errorWord: formatCode(codedWord ^ error, codedWord),
                decodedWord: formatCode(hammingDecode(codedWord ^ error), word),
            }));
            return accum;
        },
        []
    );

    return res.send({ word: word.toString(2), codedWord: codedWord.toString(2), errors });
});
app.listen(port, () => console.log(`server is running in http://localhost:${port}`));
