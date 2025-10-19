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

export { currencyFormat, formatDateInput, formatDateDisplay }