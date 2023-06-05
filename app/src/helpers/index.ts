interface helpersInterface {
    currencyFormatLong: (num: number, currency: string) => string | undefined;
    currencyFormat: (num: number, currency: string) => string | undefined;
}
var helpers = {} as helpersInterface;

helpers.currencyFormat = function(num:number, currency:string) {
    if(currency) {
        return (new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            style: "currency",
            currency: currency ? currency : "USD",
        }).format(num));
    }
}
helpers.currencyFormatLong = function(num:number, currency:string) {
    if(currency) {
        return (new Intl.NumberFormat("en-US", {
            notation: "standard",
            compactDisplay: "long",
            style: "currency",
            currency: currency ? currency : "USD",
        }).format(num));
    }
}


// helpers.calculateIntrestRates = function({minAmt, dailyInterestRate}>){
//   var formular = (minAmt * dailyInterestRate) / 100;
    
// // }
export default helpers;