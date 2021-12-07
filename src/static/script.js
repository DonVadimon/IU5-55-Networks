const main = async () => {
    const data = await (await fetch("/hamming")).json();
    console.log(data);
};

window.onload = () => {
    main();
};
