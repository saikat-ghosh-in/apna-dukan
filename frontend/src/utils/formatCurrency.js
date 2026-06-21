
export const formatCurrency = (value, currency = "INR") => {
    if (value === null || value === undefined || isNaN(value)) {
        return "";
    }

    const supportedCurrencies = {
        INR: "en-IN",
        USD: "en-US",
        EUR: "de-DE",
        CNY: "zh-CN",
    };

    const locale = supportedCurrencies[currency];

    if (!locale) {
        throw new Error(`Unsupported currency: ${currency}`);
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value));
};