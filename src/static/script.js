/**
 *
 * @param {string[]} array
 * @returns
 */
const createTableRow = (...array) => `<tr><td><pre>${array.join("</pre></td><td><pre>")}</pre></td></tr>`;

/**
 *
 * @param {{ error: string, errorWord: string, decodedWord: string}[]} errors
 * @param {number} multiplicity
 * @returns
 */
const createErrorTable = (errors, multiplicity) => `
<h3>Кратность ошибки - ${multiplicity}</h3>
<table>
    <tr>
        <th>Ошибка</th>
        <th>Закодированное слово</th>
        <th>Раскодированное слово</th>
    </tr>
    ${errors.map(({ error, errorWord, decodedWord }) => createTableRow(error, errorWord, decodedWord)).join("")}
</table>`;

/**
 *
 * @param {string} word
 * @param {string} codedWord
 * @returns
 */
const createHammingInfo = (word, codedWord) => `
<table class="info">
    <tr>
        <th>Слово</th>
        <th>Закодированное слово</th>
    </tr>
    <tr>
        <td><pre>${word}</pre></td>
        <td><pre>${codedWord}</pre></td>
    </tr>
</table>`;

/**
 *
 * @param {number} word
 * @returns {Promise<{ word: string, codedWord: string, errors: { error: string, errorWord: string, decodedWord: string}[][]}>}
 */
const sendReq = async (word) =>
    await (
        await fetch("/hamming", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word }),
        })
    ).json();

/**
 *
 * @param {{ word: string, codedWord: string, errors: { error: string, errorWord: string, decodedWord: string}[][]}} result
 * @returns
 */
const renderResult = ({ codedWord, word, errors }) => {
    document.getElementById("loader").classList.remove("visible");
    document.getElementById("result").innerHTML =
        createHammingInfo(word, codedWord) + errors.map(createErrorTable).join("");
};

const main = async () => {
    const result = await sendReq(5);
    renderResult(result);
    const input = document.getElementById("word");
    document.getElementById("send").addEventListener("click", () => {
        document.getElementById("loader").classList.add("visible");
        sendReq(+input.value).then(renderResult);
    });
};

window.onload = main;
