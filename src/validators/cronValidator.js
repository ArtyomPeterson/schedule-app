export const validateForm = (cronExpression) => {
    const errors = [];

    let formData;

    const substrings = cronExpression.split(' ');
    if (substrings.length === 5) {
        formData = {
            minutes: substrings[0],
            hours: substrings[1],
            days: substrings[2],
            months: substrings[3],
            daysOfWeek: substrings[4]
        };
    } else {
        return { form: 'Invalid Сron format. enter 5 values' };
    }


    //наполнение массива errors
    const validateFieldAndSetErrors = (fieldValue, fieldName) => {
        const errorMessage = validateField(fieldValue, fieldName);
        if (errorMessage) {
            errors.push({
                fieldName: fieldName,
                message: errorMessage
            });
        }
    };

    // проверка содержимого полей
    validateFieldAndSetErrors(formData.daysOfWeek, 'daysOfWeek');
    validateFieldAndSetErrors(formData.months, 'months');
    validateFieldAndSetErrors(formData.days, 'days');
    validateFieldAndSetErrors(formData.hours, 'hours');
    validateFieldAndSetErrors(formData.minutes, 'minutes');
    // проверка взаимосвязи полей ("?")
    
    const daysOfWeekHasQuestionMark = formData.daysOfWeek.split(',').some(str => str === "?");
    const daysOfWeekAsterisk = formData.daysOfWeek.split(',').some(str => str === "*");
    const daysHasQuestionMark = formData.days.split(',').some(str => str === "?");
    const daysHasAsterisk = formData.days.split(',').some(str => str === "*");

    if (daysHasAsterisk && daysOfWeekHasQuestionMark) {
        errors.push({
            fieldName: "daysOfWeek",
            message: 'All days of Month are selected. Use * or another value.'
        });
    }
    if (daysHasQuestionMark && daysOfWeekAsterisk) {
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
    if (daysHasQuestionMark && daysHasAsterisk) {
        errors.push({
            fieldName: "days",
            message: 'You can\'t have \'*\' and \'?\' along.'
        });
    }
    if (daysOfWeekHasQuestionMark && daysOfWeekAsterisk) {
        errors.push({
            fieldName: "daysOfWeek",
            message: 'You can\'t have \'*\' and \'?\' along.'
        });
    }
    

    return errors;
}



//проверяет поле. если есть ошибка возвращает строку с ошибкой. если нет, то null
const validateField = (fieldValue, fieldName) => {
    const parts = fieldValue.split(',');

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



    for (const part of parts) {
        // если введено пустое значение
        if (part === '') {
            return `Invalid value. The value should not be empty.`;
        }
        // если введен *
        if (part === '*') {
            continue;
        }

        // если введен шаг
        if (part.startsWith('*/')) {
            const step = part.substring(2);
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
        if (part.includes('-')) {
            const [start, end] = part.split('-');
            if (start === "" || end === "") {
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
        if (!isNaN(part)) { // если введено число
            const parsedNumber = parseInt(part, 10);
            if (parsedNumber < minValues[fieldName] || parsedNumber > maxValues[fieldName]) {
                return `Invalid values. The number must be from ${minValues[fieldName]} to ${maxValues[fieldName]}`;
            }
            continue;
        } else { // если введен текст (только daysOfWeek)
            if (fieldName === 'daysOfWeek' && Object.values(dayOfWeekNames).includes(part)) {
                // if (fieldName === 'daysOfWeek' && dayOfWeekNames.hasOwnProperty(part)) {
                continue;
            } else if ((fieldName === 'days' || fieldName === 'daysOfWeek') && part === "?") {
                continue;
            } else return `Invalid value.`;
        }


    };
    return "";
}