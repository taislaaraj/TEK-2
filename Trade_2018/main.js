// __main__

class Settings {
    constructor(player_names, your_bot, candle_format) {
        this.timebank = 0;
        this.time_per_move = 0;
        this.player_names = player_names;
        this.your_bot = your_bot;
        this.candle_interval = 0;
        this.candles_total = 0;
        this.candles_given = 0;
        this.initial_stack = 0;
        this.transaction_fee_percent = 0.0;
        this.candle_format = candle_format;
    }
}

class Action {
    constructor() {
        this.order = 0;
    }
}

class Currencie {
    constructor() {
        this.pair = "";
        this.date = 0;
        this.high = 0; 
        this.low = 0;
        this.open = 0;
        this.close = 0;
        this.volume = 0;
    }
}

class Currencies {
    constructor() {
        this.btc_eth = [];
        this.usdt_btc = [];
        this.usdt_eth = [];
    }
}

class Stack {
    constructor() {
        this.btc = 0;
        this.eth = 0;
        this.usdt = 0;
    }

}

class Indicator {

    constructor() {
        this.mme_h = -1;
        this.mme_b = -1;
        this.mm = -1;
        this.rsi = "no_moves";
        this.oldRSI = -1;
        this.macd = "no_moves";
        this.oldRapide = -1;
        this.oldSignal = -1;
        this.increase_average = "no_moves";
        this.relative_evolution = "no_moves";
        this.increase_average_v = [];
        this.relative_evolution_v = [];
    }
}

class Indicators {
    constructor() {
        this.btc_eth = new Indicator();
        this.usdt_btc = new Indicator();
        this.usdt_eth = new Indicator();
    }
}



function IncreaseAverage(history, days) {
    g = 0;
    tmp = 0;

    if (history.length <= days)
        return 0;
    for (i = 0; i < days; i++) {
        tmp = history[i].close - history[i + 1].close;
        if (tmp > 0)
            g += tmp;
    }
    return g / days;
}


function RelativeEvolution(history, days) {
    res = history[0].close - history[days - 1].close;
    res = res / history[days - 1].close * 100
    return res;
}


function moyennemobileexponentielle(history, days) {
    mme = 0;
    i = 0;
    
    if (history.length < days) {
        return -1;
    }

    for (day = days; day > 0; day--) {
        mme += history[i].close * days;
        i++;
    }
    return (mme / (days * 2));
}

function    computeMACDRapide(history) {
    mme26 = moyennemobileexponentielle(history, 9);
    mme12 = moyennemobileexponentielle(history, 5);
    
    return (mme26 - mme12);
}

function computeMACDSignal(history) {
    return moyennemobileexponentielle(history, 4);
}

function computeMACDValues(history, indicators) {
    rapide = computeMACDRapide(history);
    signal = computeMACDSignal(history);
    str = ""

    if (indicators.oldRapide < indicators.oldSignal
        && rapide > signal)
        str = "acheter";
    else if (indicators.oldRapide > indicators.oldSignal
        && rapide < signal)
        str = "vendre";
    else
        str = "no_moves";
    
    indicators.oldRapide = rapide;
    indicators.oldSignal = signal;
    return str;
}

function    getLowValues(values) {
    arr = [];
    n = 14;

    val = new Currencie();
    for (i = 0; i < 14; i++) {
        if (values[i].open > values[i].close) {
            val = values[i];
            arr.push(val);
        }
    }
    return arr;
}

function    getHighValues(values) {
    arr = [];
    n = 14;

    for (i = 0; i < 14; i++) {
        val = new Currencie()
        if (values[i].open < values[i].close) {
            val = values[i];
            arr.push(val);
        }
    }
    return arr;
}

function MoyenneMobileExponentielle(oldMME, values) {
    res = 0;
    n = 14;
    a = 2 / (1 + n);

    res = values[0].close * a + oldMME * (1 - a);
    return res;
}

function MoyenneMobile(values) {
    res = 0

    for (i = 0; i < values.length; i++) {
        res += parseFloat(values[i].close);
    }
    return res / values.length;
}

function RSI(values, indicators) {
    if (history.length < 14)
        return -1;
    if (indicators.mme_b == -1 && indicators.mme_h == -1) {
        indicators.mme_b = MoyenneMobile(getLowValues(values));
        indicators.mme_h = MoyenneMobile(getHighValues(values));
    } else {
        indicators.mme_b = MoyenneMobileExponentielle(indicators.mme_b, getLowValues(values));
        indicators.mme_h = MoyenneMobileExponentielle(indicators.mme_h, getHighValues(values));
    }
    rsi = (indicators.mme_h / (indicators.mme_h + indicators.mme_b)) * 100;
    return rsi;
}

function computeRSIValues(history, indicators) {
    rsi = RSI(history, indicators);
    str = ""

    if (indicators.oldRSI < 70 && rsi >= 70)
        str = "acheter";
    else if (indicators.oldRSI > 30 && rsi <= 30)
        str = "vendre";
    else
        str = "no_moves";

    indicators.oldRSI = rsi;
    return str;
}

function computeRSI(history, indicators) {
    if (history.btc_eth.length > 14) {
        indicators.btc_eth.rsi = computeRSIValues(history.btc_eth, indicators.btc_eth);
    }
    if (history.usdt_btc.length > 14)
        indicators.usdt_btc.rsi = computeRSIValues(history.usdt_btc, indicators.usdt_btc);
    if (history.usdt_eth.length > 14)
        indicators.usdt_eth.rsi = computeRSIValues(history.usdt_eth, indicators.usdt_eth);
}

function computeMACD(history, indicators) {
    if (history.btc_eth.length > 9) {
        indicators.btc_eth.macd = computeMACDValues(history.btc_eth, indicators.btc_eth);
    }
    if (history.usdt_btc.length > 9) {
        indicators.usdt_btc.macd = computeMACDValues(history.usdt_btc, indicators.usdt_btc);
    }
    if (history.usdt_eth.length > 9) {
        indicators.usdt_eth.macd = computeMACDValues(history.usdt_eth, indicators.usdt_eth);
    }
}

function computeIncreaseAverageValues(history, indicators) {
    d = 14
    if (history.length > d) {
        indicators.increase_average_v.unshift(IncreaseAverage(history, d));
        if (indicators.increase_average_v.length > 10)
            indicators.increase_average_v.pop();
        
        if (indicators.increase_average_v[0] > indicators.increase_average_v[1]
            && indicators.increase_average_v[1] > indicators.increase_average_v[2])
            return "acheter";
        else if (indicators.increase_average_v[0] > indicators.increase_average_v[1]
            && indicators.increase_average_v[1] > indicators.increase_average_v[2])
            return "vendre";
        else
            return "no_moves";
    }
    return "no_moves";
}

function computeRelativeEvolutionValues(history, indicators) {
    d = 14
    if (history.length > d) {
        indicators.relative_evolution_v.unshift(RelativeEvolution(history, d));
        if (indicators.relative_evolution_v.length > 10)
            indicators.relative_evolution_v.pop();
        
        if (indicators.relative_evolution_v[0] > indicators.relative_evolution_v[1]
            && indicators.relative_evolution_v[1] > indicators.relative_evolution_v[2])
            return "acheter";
        else if (indicators.relative_evolution_v[0] > indicators.relative_evolution_v[1]
            && indicators.relative_evolution_v[1] > indicators.relative_evolution_v[2])
            return "vendre";
        else
            return "no_moves";
    }
    return "no_moves";
}

function computeIncreaseAverage(history, indicators) {
    indicators.btc_eth.increase_average = computeIncreaseAverageValues(history.btc_eth, indicators.btc_eth);
    indicators.usdt_eth.increase_average = computeIncreaseAverageValues(history.usdt_eth, indicators.usdt_eth);
    indicators.usdt_btc.increase_average = computeIncreaseAverageValues(history.usdt_btc, indicators.usdt_btc);
}



function computeRelativeEvolution(history, indicators) {
    indicators.btc_eth.relative_evolution = computeRelativeEvolutionValues(history.btc_eth, indicators.btc_eth);
    indicators.usdt_eth.relative_evolution = computeRelativeEvolutionValues(history.usdt_eth, indicators.usdt_eth);
    indicators.usdt_btc.relative_evolution = computeRelativeEvolutionValues(history.usdt_btc, indicators.usdt_btc);    
}

function computeIndicators(history, indicators) {
    computeRSI(history, indicators);
    computeMACD(history, indicators);
    computeIncreaseAverage(history, indicators);
    computeRelativeEvolution(history, indicators);
}

function how_many_buy(history, stack) {
    percentage = stack / 10;

    return percentage / history[0].close;
}

function action_based_on_RSI(indicators, stack, history) {
    bool = false;

    if (stack.usdt > 0) {
        if (indicators.usdt_btc.rsi === "acheter") {
            console.log("buy USDT_BTC " + how_many_buy(history.usdt_btc, stack.usdt));
            bool = true;
        } else if (indicators.usdt_btc.rsi === "vendre") {
            console.log("sell USDT_BTC " + stack.btc);
            bool = true;
        } if (indicators.usdt_eth.rsi === "acheter") {
            console.log("buy USDT_ETH " + how_many_buy(history.usdt_eth, stack.usdt));
            bool = true;
        } else if (indicators.usdt_eth.rsi === "vendre") {
            console.log("sell USDT_ETH " + stack.eth);
            bool = true;
        }
    }
    return bool;
}

function action_based_on_MACD(indicators, stack) {
    bool = false;

    if (stack.usdt > 0) {
        if (indicators.usdt_btc.macd === "acheter") {
            console.log("buy USDT_BTC " + how_many_buy(history.usdt_btc, stack.usdt));
            bool = true;
        } else if (indicators.usdt_btc.macd === "vendre") {
            console.log("sell USDT_BTC " + stack.btc);
            bool = true;
        } if (indicators.usdt_eth.macd === "acheter") {
            console.log("buy USDT_ETH " + how_many_buy(history.usdt_eth, stack.usdt));
            bool = true;
        } else if (indicators.usdt_eth.macd === "vendre") {
            console.log("sell USDT_ETH " + stack.eth);
            bool = true;
        }
    }
    return bool;
}

function action_based_on_IncreaseAverage(indicators, stack) {
    bool = false;

    if (stack.usdt > 0) {
        if (indicators.usdt_btc.increase_average === "acheter") {
            console.log("buy USDT_BTC " + how_many_buy(history.usdt_btc, stack.usdt));
            bool = true;
        } else if (indicators.usdt_btc.increase_average === "vendre") {
            console.log("sell USDT_BTC " + stack.btc);
            bool = true;
        } if (indicators.usdt_eth.increase_average === "acheter") {
            console.log("buy USDT_ETH " + how_many_buy(history.usdt_eth, stack.usdt));
            bool = true;
        } else if (indicators.usdt_eth.increase_average === "vendre") {
            console.log("sell USDT_ETH " + stack.eth);
            bool = true;
        }
    }
    return bool;
}

function action_based_on_RelativeEvolution(indicators, stack, history) {
    bool = false;

    if (stack.usdt > 0) {
        if (indicators.usdt_btc.relative_evolution === "acheter") {
            console.log("buy USDT_BTC " + how_many_buy(history.usdt_btc, stack.usdt));
            bool = true;
        } else if (indicators.usdt_btc.relative_evolution === "vendre") {
            console.log("sell USDT_BTC " + stack.btc);
            bool = true;
        } if (indicators.usdt_eth.relative_evolution === "acheter") {
            console.log("buy USDT_ETH " + how_many_buy(history.usdt_eth, stack.usdt));
            bool = true;
        } else if (indicators.usdt_eth.relative_evolution === "vendre") {
            console.log("sell USDT_ETH " + stack.eth);
            bool = true;
        }
    }
    return bool;
}

function action(tab, Action, indicators, stack, history) {

    if (tab[1] === "order") {
        Action.order = tab[2];
        
        bool1 = action_based_on_RSI(indicators, stack);
        bool2 = action_based_on_MACD(indicators, stack);
        bool3 = action_based_on_IncreaseAverage(indicators, stack);
        bool4 = action_based_on_RelativeEvolution(indicators, stack);

        if (!bool1 && !bool2 && !bool3 && !bool4)   
            console.log("no_moves");
    }

}

function my_strncmp(str1, str2, n) {
    str1 = str1.substring(0, n);
    str2 = str2.substring(0, n);
    return ( ( str1 == str2 ) ? 0 :
                                (( str1 > str2 ) ? 1 : -1 ));
  }

function update(tab, history, stack, indicators) {    
    //console.log(update);
    
    if (tab[1] === "game" && tab[2] === "next_candles") {
        array = tab[3].split(';');
        for (i = 0; i < array.length; i++) {
            currencie = new Currencie()
            
                values = array[i].split(',');
                format = this.candle_format.split(',')
                for (y = 0; y < format.length; y++) {
                    if (format[y] === "pair")
                        currencie.pair = values[y];
                    if (format[y] === "date")
                        currencie.date = values[y];
                    if (format[y] === "high")
                        currencie.high = values[y];
                    if (format[y] === "low")
                        currencie.low = values[y];
                    if (format[y] === "open")
                        currencie.open = values[y];
                    if (format[y] === "close")
                        currencie.close = values[y];
                    if (format[y] === "volume")
                        currencie.volume = values[y];

                }
                if (currencie.pair === "BTC_ETH")
                    history.btc_eth.unshift(currencie);
                else if (currencie.pair === "USDT_BTC")
                    history.usdt_btc.unshift(currencie);
                else if (currencie.pair === "USDT_ETH")
                    history.usdt_eth.unshift(currencie);
            
        }
        computeIndicators(history, indicators)
    } else if (tab[1] === "game" && tab[2] === "stacks") {
        tab2 = tab[3].split(",");

        for (i = 0; i < tab2.length; i++) {
            tab3 = tab2[i].split(":");
            if (tab3[0] === "BTC")
                stack.btc = tab3[1];
            else if (tab3[0] === "ETH")
                stack.eth = tab3[1];
            else if (tab3[0] === "USDT")
                stack.usdt = tab3[1];
        }
        
    }
}

function settings(tab, Settings) {
    //console.log(settings);
    if (tab[1] === "timebank")
        this.timebank = tab[2];
    if (tab[1] === "time_per_move")
        this.time_per_move = tab[2];
    if (tab[1] === "player_names")
        this.player_names = tab[2];
    if (tab[1] === "your_bot")
        this.your_bot = tab[2];
    if (tab[1] === "candle_interval")
        this.candle_interval = tab[2];
    if (tab[1] === "candles_total")
        this.candles_total = tab[2];
    if (tab[1] === "candles_given")
        this.candles_given = tab[2];
    if (tab[1] === "initial_stack")
        this.initial_stack = tab[2];
    if (tab[1] === "candle_format")
        this.candle_format = tab[2];
}

function api_find() {
    history = new Currencies();
    indicators = new Indicators();
    stack = new Stack();

    var readline = require('readline');
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    
    rl.on('line', function(line){
        var tab = line.split(' ');
        if (tab[0] === "settings")
            settings(tab, Settings);
        if (tab[0] === "update")
            update(tab, history, stack, indicators);
        if (tab[0] === "action")
            action(tab, Action, indicators, stack, history);
        if (tab[0] === "print_history")
            console.log(history)
        if (tab[0] === "print_stack")
            console.log(stack);
        if (tab[0] === "print_length")
            console.log("length = " + history.usdt_btc.length);
        if (tab[0] === "how_many") {
            console.log(how_many_buy(history.usdt_btc, stack.usdt));
        }
    })
}

function test_error() {
    if (process.argv.length > 2)
        console.log('there is %d argument', process.argv.length);
    api_find();
}

function main() {
    test_error();
}

main();