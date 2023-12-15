export function  formatSelectedValues(selectedValues, type) {
  
  const allSelected = Object.values(selectedValues).every((value) => value);

  if (allSelected) {
    return ["*"]; // Если все выделены, возвращаем "*"
  }
  
  let selectedIndices;
  
  if (type === 'daysOfWeek') {
    selectedIndices = Object.keys(selectedValues)
    .filter(key => selectedValues[key])
    .map(key => ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(key))
    .filter(index => index !== -1);
  } else if (type === 'months') {
    selectedIndices = Object.keys(selectedValues)
    .filter(key => selectedValues[key])
    .map(key => parseInt(key, 10));
  }


  // Объединение последовательных дней в диапазоны
  const ranges = selectedIndices.reduce((acc, selectedValue) => {
    const lastRange = acc[acc.length - 1];
    if (lastRange && selectedValue === lastRange.end + 1) {
      lastRange.end = selectedValue;
    } else {
      acc.push({ start: selectedValue, end: selectedValue });
    }
    return acc;
  }, []);




  // Форматирование результатов
  return ranges.map(({ start, end }) => (start === end ? `${start}` : `${start}-${end}`));


};



/*
const selectedMonthsArray = Object.entries(selectedMonths)
  .filter(([_, isSelected]) => isSelected)
  .map(([month]) => parseInt(month, 10));

let months;

if (selectedMonthsArray.length === 12) {
  months = "*";
} else if (areNumbersConsecutive(selectedMonthsArray)) {
  months = `${selectedMonthsArray[0]}-${selectedMonthsArray[selectedMonthsArray.length - 1]}`;
} else {
  months = `${selectedMonthsArray.join(',')}`;
} 
*/
