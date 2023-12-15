export function updateUI(cronExpression, setTimes, setSelectedDays, selectedDays) {

    const newTimesSet = new Set();
    const uniqueHours = parseNumberRange(cronExpression.hours);
    const uniqueMinutes = parseNumberRange(cronExpression.minutes);
    for (const hour of uniqueHours) {
        for (const minute of uniqueMinutes) {

            const paddedHour = String(hour).padStart(2, '0');
            const paddedMinute = String(minute).padStart(2, '0');

            const combination = { index: newTimesSet.size, value: `${paddedHour}:${paddedMinute}` };
            newTimesSet.add(combination);
        }
    };
    const newTimes = Array.from(newTimesSet); // Преобразуем обратно в массив объектов;
    setTimes(newTimes);

    const newDays = {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    };

    console.log('selectedDays:', selectedDays);

    const hasAsterisk = cronExpression.daysOfWeek.includes('*');

    if (hasAsterisk) {
        Object.keys(newDays).forEach(day => {
            newDays[day] = true;
        });
    } else {
        const hasLetters = (str) => /[a-zA-Z]/.test(str);
        const daysWithLetters = cronExpression.daysOfWeek.filter((item) => hasLetters(item));
        const daysWithoutLetters = cronExpression.daysOfWeek.filter((item) => !hasLetters(item));
        const numericDaysArray = [...daysWithoutLetters, ...replaceDayNamesWithNumbers(daysWithLetters)];
        const uniqueDays = parseNumberRange(numericDaysArray);

        uniqueDays.forEach((dayNumber) => {
            const dayKey = Object.keys(newDays)[Number(dayNumber)]; // Преобразуем номер дня в ключ объекта
            if (dayKey) {
                newDays[dayKey] = true; // Устанавливаем свойство в true
            }
        });
    }


    console.log('newDays:', newDays);
    setSelectedDays(newDays);
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



function replaceDayNamesWithNumbers(daysArray) {
    const dayNamePattern = /(mon|tue|wed|thu|fri|sat|sun)/gi;

    return daysArray.map(day => {
        return day.replace(dayNamePattern, match => {
            switch (match.toLowerCase()) {
                case 'mon':
                    return '0';
                case 'tue':
                    return '1';
                case 'wed':
                    return '2';
                case 'thu':
                    return '3';
                case 'fri':
                    return '4';
                case 'sat':
                    return '5';
                case 'sun':
                    return '6';
                default:
                    return match;
            }
        });
    });
}
