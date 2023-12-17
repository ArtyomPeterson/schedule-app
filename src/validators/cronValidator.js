export const validateForm = (cronExpression) => {
    const errors = [];
    // let selectedMonths = {
    //     1: false,
    //     2: false,
    //     3: false,
    //     4: false,
    //     5: false,
    //     6: false,
    //     7: false,
    //     8: false,
    //     9: false,
    //     10: false,
    //     11: false,
    //     12: false
    // };


    for (const fieldName in cronExpression) {
        if (Object.hasOwnProperty.call(cronExpression, fieldName)) {
            const fieldValues = cronExpression[fieldName];
            const message = validateField(fieldValues, fieldName);

            if (message) {
                errors.push({ fieldName, message });
            }
        }
    }


    const daysOfWeekHasQuestionMark = Array.isArray(cronExpression.daysOfWeek) && cronExpression.daysOfWeek.some(str => str === "?");
    const daysOfWeekHasAsterisk = Array.isArray(cronExpression.daysOfWeek) && cronExpression.daysOfWeek.some(str => str === "*");
    const allDaysOfWeekAreSelected = parseNumberRange(cronExpression.daysOfWeek).length === 7;
    
    
    const daysHasQuestionMark = Array.isArray(cronExpression.days) && cronExpression.days.some(str => str === "?");
    const daysHasAsterisk = Array.isArray(cronExpression.days) && cronExpression.days.some(str => str === "*");
    const allDaysAreSelected = parseNumberRange(cronExpression.days).length === 31;


    if ((daysHasAsterisk || allDaysAreSelected) && daysOfWeekHasQuestionMark) {
        errors.push({
            fieldName: "daysOfWeek",
            message: 'All days of Month are selected. Use * or another value.'
        });
    }
    if (daysHasQuestionMark && (daysOfWeekHasAsterisk || allDaysOfWeekAreSelected)) {
        errors.push({
            fieldName: "days",
            message: 'All days of Week are selected. Use * or another value.'
        });
    }
    if (daysHasQuestionMark && daysOfWeekHasQuestionMark) {
        errors.push({
            fieldName: "days",
            message: 'Use * or another value.'
        });
        errors.push({
            fieldName: "daysOfWeek",
            message: 'Use * or another value.'
        });
    }
    if (daysHasQuestionMark && (daysHasAsterisk || allDaysAreSelected)) {
        errors.push({
            fieldName: "days",
            message: 'days - You can\'t have \'*\' and \'?\' along.'
        });
    }
    if (daysOfWeekHasQuestionMark && (daysOfWeekHasAsterisk || allDaysOfWeekAreSelected)) {
        errors.push({
            fieldName: "daysOfWeek",
            message: 'daysOfWeek - You can\'t have \'*\' and \'?\' along.'
        });
    }


    return errors;
}



//проверяет поле. если есть ошибка возвращает строку с ошибкой. если нет, то null
const validateField = (fieldValues, fieldName) => {

    const dayOfWeekNames = {
        0: "mon",
        1: "tue",
        2: "wed",
        3: "thu",
        4: "fri",
        5: "sat",
        6: "sun"
    };
    const maxValuesStep = {
        minutes: 60,
        hours: 24,
        days: 31,
        months: 12,
        daysOfWeek: 7
    };
    const minValues = {
        minutes: 0,
        hours: 0,
        days: 1,
        months: 1,
        daysOfWeek: 0
    };
    const maxValues = {
        minutes: 59,
        hours: 23,
        days: 31,
        months: 12,
        daysOfWeek: 6
    };



    for (const fieldValue of fieldValues) {
        // если введено пустое значение
        if (fieldValue === '') {
            return `Invalid value. The value should not be empty.`;
        }
        // если введен *
        if (fieldValue === '*') {
            continue;
        }

        // если введен шаг
        if (fieldValue.startsWith('*/')) {
            const step = fieldValue.substring(2);
            if (step === "") {
                return `Invalid value. The value should not be empty.`;
            }
            if (!isNaN(step)) {
                console.log(step);
                const parsedNumber = parseInt(step, 10);
                console.log(parsedNumber);
                if (parsedNumber < 1 || parsedNumber > maxValuesStep[fieldName]) {
                    return `Invalid  value. The step should be from 1 to ${maxValues[fieldName]}`;
                }
                continue;
            } else {
                return `Invalid value. Enter a number.`
            }
        }
        // если введен диапазон
        if (fieldValue.includes('-')) {
            const [start, end] = fieldValue.split('-');
            if (start === "" || end === "") {
                console.log("start "+ start);
                console.log("end "+ end);

                return `Invalid value. The value should not be empty.`;
            }
            // если оба значения — строки (только daysOfWeek)
            if (isNaN(start) && isNaN(end)) {

                if (Object.values(dayOfWeekNames).includes(start) && Object.values(dayOfWeekNames).includes(end)) {
                    if (Object.values(dayOfWeekNames).indexOf(start) < Object.values(dayOfWeekNames).indexOf(end)) {
                        continue;
                    } else {
                        return `Invalid value. The first day in the range should be earlier than the last.`;
                    }
                } else {
                    return `Invalid value. Incorrect input format.`;
                }
            }
            // если оба значения — числа
            if (!isNaN(start) && !isNaN(end)) {
                const parsedStart = parseInt(start, 10);
                const parsedEnd = parseInt(end, 10);
                if (parsedStart < minValues[fieldName] || parsedEnd > maxValues[fieldName] || parsedStart >= parsedEnd) {
                    return `Invalid values. The range should be between ${minValues[fieldName]} and ${maxValues[fieldName]}`;
                }
                continue;
            }
            // если одно значение строка а другое число
            return `Invalid value.`;
        }
        if (!isNaN(fieldValue)) { // если введено число
            const parsedNumber = parseInt(fieldValue, 10);
            if (parsedNumber < minValues[fieldName] || parsedNumber > maxValues[fieldName]) {
                return `Invalid values. The number must be from ${minValues[fieldName]} to ${maxValues[fieldName]}`;
            }
            continue;
        } else { // если введен текст (только daysOfWeek)
            if (fieldName === 'daysOfWeek' && Object.values(dayOfWeekNames).includes(fieldValue)) {
                // if (fieldName === 'daysOfWeek' && dayOfWeekNames.hasOwnProperty(part)) {
                continue;
            } else if ((fieldName === 'days' || fieldName === 'daysOfWeek') && fieldValue === "?") {
                continue;
            } else return `Invalid value.`;
        }


    };
    return;
}


function parseNumberRange(rangeArray) {
    const result = new Set();
    rangeArray.forEach(item => {
        if (item.includes('-')) {
            const [start, end] = item.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                result.add(i);
            }
        } else {
            result.add(Number(item));
        }
    });
    console.log('parseRange ' + Array.from(result));

    return Array.from(result);
}