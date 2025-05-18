export const formatUSD = (number) => {
    let dollarUS = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return dollarUS.format(number).replace('.00', '');
};

export const getPayout = (odds, stake) => {
    var payout = 0;
    odds = Number(odds);
    stake = Number(stake);

    payout = odds > 0 ? stake * (odds / 100) + stake : stake / ((odds * -1) / 100) + stake;

    return Number(Number(payout).toFixed(2));
};

export const getStake = (oddsB, payoutA) => {
    const odds = Number(oddsB);
    const payout = Number(payoutA);

    if (odds < 0) {
        const o = (odds * -1) / 100;
        return Number((payout / (1 + 1 / o)).toFixed(2));
    }
};
