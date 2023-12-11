export const validateForm = (formData) => {
    const errors = {};

    const dayOfWeekNames = {
        0: "mon",
        1: "tue",
        2: "wed",
        3: "thu",
        4: "fri",
        5: "sat",
        6: "sun"
    };


    //наполнение объекта errors
    const validateFieldAndSetErrors = (fieldValue, fieldName) => {
        const errorMessage = validateField(fieldValue, fieldName);
        if (errorMessage) {
            errors[fieldName] = errorMessage;
        }
    };

    //проверяет поле. если есть ошибка возвращает строку с ошибкой. если нет, то null
    const validateField = (fieldValue, fieldName) => {

        const parts = fieldValue.split(',');

        for (const part of parts) {

            if (part === '') { // если введено пустое значение
                return `${fieldName} - Invalid value. The value should not be empty.`;
            } else if (part === '*') { // если введен *
                continue;
            } else if (part.startsWith('*/')) { // если введен шаг
                const number = part.substring(2);
                if (!isNaN(number)) { // если после */ число (isNaN() преобразует "" в 0 )
                    const parsedNumber = parseInt(number, 10);

                    if (fieldName === 'minutes') {
                        if (parsedNumber < 1 || parsedNumber > 60) {
                            return `${fieldName} - Invalid step value. The step should be from 1 to 60`;
                        }
                        continue;
                    }
                    if (fieldName === 'hours') {
                        if (parsedNumber < 1 || parsedNumber > 24) {
                            return `${fieldName} - Invalid step value. The step should be from 1 to 24`;
                        }
                        continue;
                    }
                    if (fieldName === 'days') {
                        if (parsedNumber < 1 || parsedNumber > 31) {
                            return `${fieldName} - Invalid step value. The step should be from 1 to 31`;
                        }
                        continue;
                    }
                    if (fieldName === 'months') {
                        if (parsedNumber < 1 || parsedNumber > 12) {
                            return `${fieldName} - Invalid step value. The step should be from 1 to 12`;
                        }
                        continue;
                    }
                    if (fieldName === 'daysOfWeek') {
                        if (parsedNumber < 1 || parsedNumber > 7) {
                            return `${fieldName} - Invalid step value. The step should be from 1 to 7`;
                        }
                        continue;
                    }
                } else { return 'Invalid step value. Enter a number.' }


            } else if (part.includes('-')) { // если введен диапазон        
                const [start, end] = part.split('-');

                //isNaN преобразует пустую строку в 0. надо написать проверку.
                // if (start.trim() === "" || end.trim() === "") {
                //     вывести ошибку
                // }


                if (!isNaN(start) && !isNaN(end)) { // если оба значения — числа
                    const parsedStart = parseInt(start, 10);
                    const parsedEnd = parseInt(end, 10);

                    if (fieldName === 'minutes') {
                        if (parsedStart < 0 || parsedStart > 58 || parsedEnd < 1 || parsedEnd > 59 || parsedStart >= parsedEnd) {
                            return `${fieldName} - Invalid range values. The range should be between 0 and 59`;
                        }
                        continue;
                    }
                    if (fieldName === 'hours') {
                        if (parsedStart < 0 || parsedStart > 22 || parsedEnd < 1 || parsedEnd > 23 || parsedStart >= parsedEnd) {
                            return `${fieldName} - Invalid range values. The range should be between 0 and 23`;
                        }
                        continue;
                    }
                    if (fieldName === 'days') {
                        if (parsedStart < 1 || parsedStart > 30 || parsedEnd < 2 || parsedEnd > 31 || parsedStart >= parsedEnd) {
                            return `${fieldName} - Invalid range values. The range should be between 1 and 31`;
                        }
                        continue;
                    }
                    if (fieldName === 'months') {
                        if (parsedStart < 1 || parsedStart > 11 || parsedEnd < 2 || parsedEnd > 12 || parsedStart >= parsedEnd) {
                            return `${fieldName} - Invalid range values. The range should be between 1 and 12`;
                        }
                        continue;
                    }
                    if (fieldName === 'daysOfWeek') {
                        if (parsedStart < 0 || parsedStart > 5 || parsedEnd < 1 || parsedEnd > 6 || parsedStart >= parsedEnd) {
                            return `${fieldName} - Invalid range values. The range should be between 0 and 6`;
                        }
                        continue;
                    }


                } else if (isNaN(start) && isNaN(end)) { // если оба значения — строки
                    console.log(start + " " + end);
                    if (Object.values(dayOfWeekNames).includes(start) && Object.values(dayOfWeekNames).includes(end)) {
                        if (dayOfWeekNames[start] < dayOfWeekNames[end]) {
                            continue
                        } else {
                            return `${fieldName} - Invalid range value. The first day in the range should be earlier than the last.`;
                        }
                    } else {
                        return `${fieldName} - Invalid range value. Incorrect input format.`
                    }


                } else { // если одно значение строка а другое число
                    return `${fieldName} — Invalid range value.`
                }


            } else if (!isNaN(part)) { // если введено число
                const parsedNumber = parseInt(part, 10);

                if (fieldName === 'minutes') {
                    if (parsedNumber < 0 || parsedNumber > 59) {
                        return `${fieldName} - Invalid value. The number must be from 0 to 59`;
                    }
                    continue;
                }
                if (fieldName === 'hours') {
                    if (parsedNumber < 0 || parsedNumber > 23) {
                        return `${fieldName} - Invalid value. The number must be from 0 to 23`;
                    }
                    continue;
                }
                if (fieldName === 'days') {
                    if (parsedNumber < 1 || parsedNumber > 31) {
                        return `${fieldName} - Invalid value. The number must be from 1 to 31`;
                    }
                    continue;
                }
                if (fieldName === 'months') {
                    if (parsedNumber < 1 || parsedNumber > 12) {
                        return `${fieldName} - Invalid value. The number must be from 1 to 12`;
                    }
                    continue;
                }
                if (fieldName === 'daysOfWeek') {
                    if (parsedNumber < 0 || parsedNumber > 6) {
                        return `${fieldName} - Invalid value. The number must be from 0 to 6`;
                    }
                    continue;
                }


            } else { // если введен текст
                if (fieldName === 'daysOfWeek' && Object.values(dayOfWeekNames).includes(part)) {
                    continue;
                } else {
                    return `${fieldName} - Invalid value.`;
                }
            }

            return "";
        };

    }

    // проверка каждого поля по очереди
    validateFieldAndSetErrors(formData.minutes, 'minutes');
    validateFieldAndSetErrors(formData.hours, 'hours');
    validateFieldAndSetErrors(formData.days, 'days');
    validateFieldAndSetErrors(formData.months, 'months');
    validateFieldAndSetErrors(formData.daysOfWeek, 'daysOfWeek');


    return errors;
};


