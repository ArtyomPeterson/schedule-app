export function updateUI(cronExpression, setTimes, setDayOfMonth, setSelectedMonths, selectedMonths) {

    // время
    const newTimesSet = new Set();
    const uniqueHours = parseRange(cronExpression.hours);
    const uniqueMinutes = parseRange(cronExpression.minutes);
    for (const hour of uniqueHours) {
        for (const minute of uniqueMinutes) {
            const paddedHour = String(hour).padStart(2, '0');
            const paddedMinute = String(minute).padStart(2, '0');
            const combination = { index: newTimesSet.size, value: `${paddedHour}:${paddedMinute}` };
            newTimesSet.add(combination);
        }
    };
    const newTimes = Array.from(newTimesSet); // Преобразуем обратно в массив объектов
    console.log('new times set ' + newTimesSet.values);
    console.log('new times ' + newTimes.values);
    setTimes(newTimes);


    // день месяца
    setDayOfMonth(cronExpression.days)


    // месяцы
    const newMonths = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
    };

    const hasAsterisk = cronExpression.months.includes('*');

    if (hasAsterisk) {
        Object.keys(newMonths).forEach(monthKey => {
            newMonths[monthKey] = true;
        });
    } else {
        const uniqueMonths = parseRange(cronExpression.months);
        uniqueMonths.forEach((monthNumber) => {
            const monthKey = Object.keys(newMonths)[Number(monthNumber)]; // Преобразуем номер дня в ключ объекта 
            if (monthKey) {
                newMonths[monthKey] = true; // Устанавливаем свойство в true
            }
        });
    }
    setSelectedMonths(newMonths);
}



function parseRange(rangeArray) {
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






