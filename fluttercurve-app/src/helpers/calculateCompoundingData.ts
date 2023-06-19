
// THIS WILL CALCULATE FOR MONTH AND YEAR.
interface calculateCompoundingPlanInterface {
    compoundingData: (initialAmt: number, nominalInterestRate: number, compoundingPeriods: number) => void;
}

var calculateCompoundingPlan = {} as calculateCompoundingPlanInterface;

function calculateEffectiveInterestRate(nominalInterestRate:number, compoundingPeriods:number) {
    return (1 + (nominalInterestRate / compoundingPeriods)) ** compoundingPeriods - 1;
}

function calculateFutureValue(initialAmt:number, EIR:number, compoundingPeriods:number) {
    return (
        initialAmt * (1 + EIR)**compoundingPeriods
    )
}
  

function TotalLogic(initialAmt:any, getDecimalInterest:any, compoundingPeriods:any){
    const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, compoundingPeriods);
    const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, compoundingPeriods)

    const calculation = {
        FIV: getFutureVal,
        TIE: (getFutureVal-initialAmt),
        EIR:  (getFutureVal-initialAmt)/100,
        IB: initialAmt,
    }

    return calculation
}

function monthlyLogic(initialAmt:any, getDecimalInterest:any, compoundingPeriods:any, data: any[]) {
    for(let i = 0; i < compoundingPeriods; ++i) {
        const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, (i+1));
        const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, (i+1))

        data.push({
            period: "mo. " + (i+1),
            FIV: getFutureVal,
            TIE: (getFutureVal-initialAmt),
            IB: initialAmt,
        })
    }
}

calculateCompoundingPlan.compoundingData = function(initialAmt:number, nominalInterestRate:number, compoundingPeriods:number) {
    const getDecimalInterest = (nominalInterestRate/100); // percentage

    let data:any = [];
    const notMonthly = (compoundingPeriods / 12) < 1 ? false : true;
    if(notMonthly) {
        let period = Math.floor(compoundingPeriods/12);
        let countYear = 0;
        let yearly = 12;

        while(period) {
            ++countYear;
            data.push({
                period: "yr. " + countYear,
                ...TotalLogic(initialAmt, getDecimalInterest, period*yearly)
            })
            --period;
        }

        let remainderMth = compoundingPeriods % yearly
        if(remainderMth) {
            monthlyLogic(initialAmt,getDecimalInterest,remainderMth,data)
        }

        const calculation = TotalLogic(initialAmt, getDecimalInterest, compoundingPeriods)
        return  {_data:data, calculation};
    }
    // for monthly calculation
    monthlyLogic(initialAmt,getDecimalInterest,compoundingPeriods,data)
    const calculation = TotalLogic(initialAmt, getDecimalInterest, compoundingPeriods)
    
    return {_data:data, calculation}
}


export default calculateCompoundingPlan