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

function my_strncmp(str1, str2, n) {
    str1 = str1.substring(0, n);
    str2 = str2.substring(0, n);
    return ( ( str1 == str2 ) ? 0 :
                                (( str1 > str2 ) ? 1 : -1 ));
  }

function update(tab, history) {    
    if (tab[1] === "game" && tab[2] === "stacks") {
        var tab2 = new Array(this.pair, this.date, this.high, this.low, this.open, this.close, this.volume);        
        console.log("%s", this.pair);
    }
    if (tab[1] === "game" && tab[2] === "next_candles") {
        array = tab[3].split(';');
        currencie = new Currencie();
        for (i = 0; i < array.length; i++) {
            currencie = new Currencie
            if (my_strncmp(array[i], "BTC_ETH", 7) === 0) {
                values = array[i].split(',');
                format = this.candle_format.split(',')
                //Distribute values taking acccount candle_format
                for (y = 0; y < format.length; y++) {
                    if (format[y] === "pair")
                        currencie.pair = "BTC_ETH";
                    if (format[y] === "date")
                        currencie.date = values[1];
                    if (format[y] === "high")
                        currencie.high = values[2];
                    if (format[y] === "low")
                        currencie.low = values[3];
                    if (format[y] === "open")
                        currencie.open = values[4];
                    if (format[y] === "close")
                        currencie.close = values[5];
                    if (format[y] === "volume")
                        currencie.volume = values[6];

                }
                history.btc_eth.push(currencie);
            }
            if (my_strncmp(array[i], "USDT_BTC", 8) === 0) {
                values = array[i].split(',');
                format = this.candle_format.split(',') 
                for (y = 0; y < format.length; y++) {
                    if (format[y] === "pair")
                        currencie.pair = "USDT_BTC";
                    if (format[y] === "date")
                        currencie.date = values[1];
                    if (format[y] === "high")
                        currencie.high = values[2];
                    if (format[y] === "low")
                        currencie.low = values[3];
                    if (format[y] === "open")
                        currencie.open = values[4];
                    if (format[y] === "close")
                        currencie.close = values[5];
                    if (format[y] === "volume")
                        currencie.volume = values[6];

                }
                history.usdt_btc.push(currencie);
            }
            if (my_strncmp(array[i], "USDT_ETH", 8) === 0) {
                values = array[i].split(',');
                format = this.candle_format.split(',') 
                for (y = 0; y < format.length; y++) {
                    if (format[y] === "pair")
                        currencie.pair = "USDT_ETH";
                    if (format[y] === "date")
                        currencie.date = values[1];
                    if (format[y] === "high")
                        currencie.high = values[2];
                    if (format[y] === "low")
                        currencie.low = values[3];
                    if (format[y] === "open")
                        currencie.open = values[4];
                    if (format[y] === "close")
                        currencie.close = values[5];
                    if (format[y] === "volume")
                        currencie.volume = values[6];

                }
                history.usdt_eth.push(currencie);
            }
        }
    }
}