"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calculateCompoundingPlan = {};
function calculateEffectiveInterestRate(nominalInterestRate, compoundingPeriods) {
    return Math.pow((1 + (nominalInterestRate / compoundingPeriods)), compoundingPeriods) - 1;
}
function calculateFutureValue(initialAmt, EIR, compoundingPeriods) {
    return (initialAmt * Math.pow((1 + EIR), compoundingPeriods));
}
calculateCompoundingPlan.compoundingData = function (initialAmt, nominalInterestRate, compoundingPeriods) {
    const getDecimalInterest = (nominalInterestRate / 100); // percentage
    let data = [];
    data = []; //clear former data
    for (let i = 0; i < compoundingPeriods; ++i) {
        const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, (i + 1));
        const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, (i + 1));
        data.push({
            period: (i + 1),
            FIV: getFutureVal,
            interestVal: (getFutureVal - initialAmt),
            EIR: (getFutureVal - initialAmt) / 100
        });
    }
    const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, compoundingPeriods);
    const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, compoundingPeriods);
    const calculation = {
        FIV: getFutureVal,
        interestVal: (getFutureVal - initialAmt),
        EIR: (getFutureVal - initialAmt) / 100
    };
    return { data, calculation };
};
exports.default = calculateCompoundingPlan;
