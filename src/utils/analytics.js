import { event } from 'vue-gtag';

export const trackCalculatorSubmit = (calculatorType) => {
    event('submit_calculator', {
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

export const trackThemeChange = (theme) => {
    event('set_theme', {
        theme,
    });
};
