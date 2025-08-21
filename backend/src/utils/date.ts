const oneYearFromNow = () => 
    new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    )

const thirtyDaysFromNow = () => 
    new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    )

const fifteenMinutesFromNow = () => 
    new Date(
        Date.now() + 15 * 60 * 1000
    )

module.exports = { oneYearFromNow, thirtyDaysFromNow, fifteenMinutesFromNow };