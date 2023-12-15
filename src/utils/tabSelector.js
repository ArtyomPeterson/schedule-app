//Какую вкладку открыть в зависимости от Cron выражения из Output

export function selectTab(cronExpression) {
    const { minutes, hours, days, months, daysOfWeek } = cronExpression;

    const areAllValuesEqual = (arr) => arr.every((value, index, array) => value === array[0]);
    const isNoStep = (arr) => arr.every(str => !str.includes("*/"));
    const isNoRange = (arr) => arr.every(str => !str.includes("-"));
    const isNoAsterisk = (arr) => arr.every(str => !str.includes("*"));
    const isOneSymbol = (arr, symbol) => arr.length === 1 && arr[0] === symbol;



    // const dayOfWeekNames = {
    //     0: "mon",
    //     1: "tue",
    //     2: "wed",
    //     3: "thu",
    //     4: "fri",
    //     5: "sat",
    //     6: "sun"
    // };

    if (
        minutes.length === 1 &&
        minutes[0].startsWith("*/") &&
        !minutes[0].includes("-") &&
        isOneSymbol(hours, '*') &&
        isOneSymbol(days, '*') &&
        isOneSymbol(months, '*') &&
        isOneSymbol(daysOfWeek, '*')
    ) return 'daily'; 

    const areAllMinutesEqual = areAllValuesEqual(minutes);
    const isAllHoursEqual = areAllValuesEqual(hours);
    if (
        isNoAsterisk(minutes) &&
        isNoAsterisk(hours) &&
        (areAllMinutesEqual || isAllHoursEqual) &&
        isOneSymbol(days, '*') &&
        isOneSymbol(months, '*') &&
        isOneSymbol(daysOfWeek, '*')
    ) return 'daily';



    if (
        isNoAsterisk(minutes) &&
        isNoAsterisk(hours) &&
        (areAllMinutesEqual || isAllHoursEqual) &&
        (
            isOneSymbol(days, '*') ||
            isOneSymbol(days, '?')
        ) &&
        isOneSymbol(months, '*') &&
        isNoStep(daysOfWeek)
    ) return 'weekly';



    if (
        isNoAsterisk(minutes) &&
        isNoAsterisk(hours) &&
        (areAllMinutesEqual || isAllHoursEqual) &&
        days.length === 1 &&
        isNoAsterisk(days) &&
        isNoRange(days)&&
        isNoStep(months)&&
        (
            isOneSymbol(daysOfWeek, '*') ||
            isOneSymbol(daysOfWeek, '?')
        )
    ) return 'monthly';

    return 'custom';

}