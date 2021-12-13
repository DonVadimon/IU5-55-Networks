/**
 *
 * @param {string[]} array
 * @returns
 */
const createTableRow = (...array) => `<tr><td><pre>${array.join("</pre></td><td><pre>")}</pre></td></tr>`;

/**
 *
 * @param {{ error: string, syndrom: string, errorWord: string, decodedWord: string}[]} errors
 * @param {string} multiplicity
 * @returns
 */
const createErrorTable = (errors, multiplicity) => `
<h3>Кратность ошибки - ${multiplicity}</h3>
<table>
    <tr>
        <th>Ошибка</th>
        <th>Синдром</th>
        <th>Закодированное слово</th>
        <th>Раскодированное слово</th>
    </tr>
    ${errors
        .slice(0, 100)
        .map(({ error, errorWord, decodedWord, syndrom }) => createTableRow(error, syndrom, errorWord, decodedWord))
        .join("")}
</table>`;

/**
 *
 * @param {{ errors: { multiplicity: string, detectedCount: number, fixedCount: number, errors: { error: string, syndrom: string, errorWord: string, decodedWord: string}[]}[]}} result
 * @returns
 */
const createAbilitiesTable = ({ errors }) =>
    `
<table class="columns">
    <tr>
        <td>Кратность ошибки</td>
        <td>Обнаруживающая способность, %</td>
        <td>Корректирующая способность, %</td>
        <td>Обнаруженные ошибки</td>
        <td>Скорректированные ошибки</td>
        <td>Скорректированные к обнаруженным</td>
        <td>Общее число ошибок</td>
    </tr>
    ${errors
        .map(
            ({ multiplicity, detectedCount, fixedCount, errors }) => `
    <tr>
        <td>${multiplicity}</td>
        <td>${((detectedCount * 100) / errors.length).toFixed(2).replace(/(\.0)?0$/, "")}%</td>
        <td>${((fixedCount * 100) / errors.length).toFixed(2).replace(/(\.0)?0$/, "")}%</td>
        <td>${detectedCount}</td>
        <td>${fixedCount}</td>
        <td>${fixedCount / detectedCount}</td>
        <td>${errors.length}</td>
    </tr>
`
        )
        .join("")}
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
 * @param {string} word
 * @returns {Promise<{ word: string, codedWord: string, errors: { multiplicity: string, detectedCount: number, fixedCount: number, errors: { error: string, syndrom: string, errorWord: string, decodedWord: string}[]}[]}>}
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
 * @param {{ word: string, codedWord: string, errors: { multiplicity: string, detectedCount: number, fixedCount: number, errors: { error: string, syndrom: string, errorWord: string, decodedWord: string}[]}[]}} result
 * @returns
 */
const renderResult = ({ codedWord, word, errors }) => {
    document.getElementById("loader").classList.remove("visible");
    document.getElementById("result").innerHTML =
        createHammingInfo(word, codedWord) +
        errors.map(({ errors, multiplicity }) => createErrorTable(errors, multiplicity)).join("");
    document.getElementById("abilities").innerHTML = createAbilitiesTable({ errors });
};

/**
 *
 * @param {string} value
 */
const attachResult = (value) => {
    document.getElementById("loader").classList.add("visible");
    sendReq(value).then(renderResult);
};

const main = async () => {
    const result = await sendReq();
    renderResult(result);
    const input = document.getElementById("word");
    document.getElementById("send").addEventListener("click", () => attachResult(input.value));
    input.addEventListener("input", (e) => (e.target.value = e.target.value.replace(/[^01]/g, "")));
    input.addEventListener("keydown", (e) => (e.key.toLowerCase() === "enter" ? attachResult(input.value) : true));
};

window.onload = main;
