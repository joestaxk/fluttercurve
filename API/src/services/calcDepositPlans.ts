
interface calculateCompoundingPlanInterface {
    compoundingData: (initialAmt: number, nominalInterestRate: number, compoundingPeriods: number) => { data: { FIV: number; interestVal: number; EIR: number; }[]; calculation: { FIV: number; interestVal: number; EIR: number; }; };
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
  

calculateCompoundingPlan.compoundingData = function(initialAmt:number, nominalInterestRate:number, compoundingPeriods:number) {
    const getDecimalInterest = (nominalInterestRate/100); // percentage

    let data = [];

    data = []; //clear former data
    for(let i = 0; i < compoundingPeriods; ++i) {
        const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, (i+1));
        const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, (i+1))
        data.push({
            period: (i+1),
            FIV: getFutureVal,
            interestVal: (getFutureVal-initialAmt),
            EIR:  (getFutureVal-initialAmt)/100
        })
    }

    const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, compoundingPeriods);
    const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, compoundingPeriods)

    const calculation = {
        FIV: getFutureVal,
        interestVal: (getFutureVal-initialAmt),
        EIR:  (getFutureVal-initialAmt)/100
    }
    return {data, calculation};
}


export default calculateCompoundingPlan