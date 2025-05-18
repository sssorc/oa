import { event } from 'vue-gtag';

export const trackCalculatorSubmit = (calculatorType) => {
    event('calculator_submit', {
        calculator: calculatorType,
    });
};

export const trackUrlCopy = (calculatorType) => {
    event('copy_url', {
        calculator: calculatorType,
    });
};

export const trackDiscordCopy = (calculatorType) => {
    event('copy_for_discord');
};

export const trackBookmark = (calculatorType) => {
    event('bookmark_devig');
};
