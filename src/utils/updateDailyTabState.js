export function updateUI(cronExpression, setDataType, setStep, setTimes )  {
    
    if (cronExpression.minutes && cronExpression.minutes[0] && cronExpression.minutes[0].startsWith('*/')) {
        
        setDataType('step');
        setStep(cronExpression.minutes[0].substring(2));
    } else {
        
        setDataType('time');

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
        console.log('new times set '+ newTimesSet.values);
        console.log('new times '+ newTimes.values);
        setTimes(newTimes);
    }

}; 


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
    console.log('parseRange '+ Array.from(result));

    return Array.from(result);
  }