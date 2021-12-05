import express from "express";
import { hammingCode, hammingDecode } from "./lib";

const port = process.env.PORT || 5000;

const app = express();
app.get("/", (req, res) =>
    res.send(`${(52).toString(2)} -> ${hammingCode(52).toString(2)} -> ${hammingDecode(hammingCode(52)).toString(2)}`)
);
app.listen(port, () => console.log(`server is running in http://localhost:${port}`));
