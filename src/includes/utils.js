function round(num) {
    return (Math.round(Number((Math.abs(num) * 100).toPrecision(15))) / 100) * Math.sign(num);
}

function toString(value) {
    if (typeof value !== 'string')
        value = String(value);

    return value.trim();
}

export {
    round,
    toString
};