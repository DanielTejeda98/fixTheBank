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

export { currencyFormat, formatDateInput }