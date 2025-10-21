const currencyFormat = (value: number): string => {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    return USDollar.format(value);
}

const formatDateInput = (date: Date): string => {
    const month = date.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`
    const formattedDay = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
    return `${date.getFullYear()}-${formattedMonth}-${formattedDay}`
}

const formatDateDisplay = (date: string | Date): string => {
    const toLocaleDateStringSettings = {month: "long", year: "numeric", timeZone: "UTC"} as const;
    if (date instanceof Date) {
        return date.toLocaleDateString("en-US", toLocaleDateStringSettings)
    }

    return new Date(date).toLocaleDateString("en-US", toLocaleDateStringSettings)
}

const INPUT_SANITATION_REGEX = /^\d+(\.\d{1,2})?$/;
const formatCurrencyInput = (value: string): string => {
    const passesRegex = INPUT_SANITATION_REGEX.test(value);
    if (!passesRegex && value !== "") {
        // Update state with sanitized value only
        if (value.includes(".")) {
            const decimalIndex = value.indexOf(".");
            const sanitizedValue = value.substring(0, decimalIndex + 3);
            return sanitizedValue;
        }
    }
    return value;
}

export { currencyFormat, formatDateInput, formatDateDisplay, formatCurrencyInput }