import express, { Request, Response } from "express";
import path from "path";
import morgan from "morgan";
import bp from "body-parser";

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

type ErrorMultiplicity = {
    multiplicity: string;
    errors: HammingError[];
    detectedCount: number;
    fixedCount: number;
};

type HammingRes = {
    word: string;
    codedWord: string;
    errors: ErrorMultiplicity[];
};

const app = express();
app.use(bp.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));

app.get("/", (_, res) => res.sendFile(path.join(__dirname, "static", "index.html")));

app.post("/hamming", (req: Request<{}, {}, HammingReq>, res: Response<HammingRes>) => {
    const word = req.body?.word ?? 687;

    const codedWord = hammingCode(word);

    const errors = Object.entries(generateErrors(codedWord)).reduce<ErrorMultiplicity[]>(
        (accum, [multiplicity, errors]) => {
            let detectedCount = 0;
            let fixedCount = 0;
            const multiplicityErrors = errors.map<HammingError>((error) => {
                const codedWithError = codedWord ^ error;
                const [decoded, detected] = hammingDecode(codedWithError);
                detectedCount += +detected;
                fixedCount += +(decoded === word);
                return {
                    error: formatCode(error, codedWord),
                    errorWord: formatCode(codedWithError, codedWord),
                    decodedWord: formatCode(decoded, word),
                };
            });
            accum[+multiplicity] = {
                multiplicity,
                errors: multiplicityErrors,
                detectedCount,
                fixedCount,
            };
            return accum;
        },
        []
    );

    return res.send({ word: word.toString(2), codedWord: codedWord.toString(2), errors });
});
app.listen(port, () => console.log(`server is running in http://localhost:${port}`));
