function    getLowValues(values) {
    arr = [];
    n = 14;

    for (i = values.length - n; i < values.length; i++) {
        if (values[i].open > values[i].close)
            arr.push(values[i]);
    }
    return arr;
}

function    getHighValues(values) {
    arr = [];
    n = 14;

    for (i = values.length - n; i < values.length; i++) {
        if (values[i].open < values[i].close)
            arr.push(values[i]);
    }
    return arr;
}

function MoyenneMobileExponentielle(oldMME, values) {
    res = 0;
    n = 14;
    a = 2 / (1 + n);

    res = values[values.length - 1].close * a + oldMME * a;
    return res;
}

function MoyenneMobile(values) {
    res = 0

    for (i = 0; i < 14; i++) {
        res += parseFloat(values[i].close);
    }
    return res / 14;
}

function RSI(history, indicators) {
    if (history.length < 14)
        return -1;
    if (indicators.mme_b == -1 && indicators.mme_h == -1) {
        indicators.mme_b = MoyenneMobile(getLowValues(history));
        indicators.mme_h = MoyenneMobile(getHighValues(history));
    } else {
        indicators.mme_b = MoyenneMobileExponentielle(indicators.mme_b, getLowValues(history));
        indicators.mme_h = MoyenneMobileExponentielle(indicators.mme_h, getHighValues(history));
    }
    rsi = (H / (H + B)) * 100;
    return rsi;
}