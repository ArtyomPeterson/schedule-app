import React, { useState, useEffect } from 'react';
import '../../App.css';


const dayOfWeekNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
};

const dayOfWeekNumbers = {
    0: 'mon',
    1: 'tue',
    2: 'wed',
    3: 'thu',
    4: 'fri',
    5: 'sat',
    6: 'sun'
};


function areNumbersConsecutive(numbers) {
    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] !== numbers[i + 1] - 1) {
            return false;
        }
    }
    return true;
}


function WeeklyTab({ onSave }) {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);
    const [selectedDays, setSelectedDays] = useState(
        Object.keys(dayOfWeekNames).reduce((acc, day) => {
            acc[day] = false;
            return acc;
        }, {})
    );
    const [errors, setErrors] = useState({});



    // Функция ставит текущее время в инпут Time
    useEffect(() => {
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0'); // Добавляет 0 в начале если часы < 10
            const minutes = now.getMinutes().toString().padStart(2, '0'); // Добавляет 0 в начале если минуты < 10
            return `${hours}:${minutes}`;
        };
        setTimes([{ id: 1, value: getCurrentTime() }]);
    }, []); // Пустой массив чтобы эффект запустился только один раз

    // Добавление поля time
    const handleAddTimeField = () => {
        setTimes((prevTimes) => [
            ...prevTimes,
            { id: prevTimes[prevTimes.length - 1].id + 1, value: '' }
        ])
    };
    // Удаление поля time
    const handleRemoveTimeField = (id) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.id !== id));
    };
    // Изменение поля time
    const handleTimeChange = (id, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) => (time.id === id ? { ...time, value } : time))
        );
    };
    // Кнопка будни
    const handleToggleWeekdays = () => {
        setSelectedDays({
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: false,
            sun: false
        });
    };
    // Кнопка выходные
    const handleToggleWeekends = () => {
        setSelectedDays({
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: true,
            sun: true
        });
    };
    // Изменение списка дней
    const handleToggleDay = (day) => {
        setSelectedDays((prev) => ({
            ...prev,
            [day]: !prev[day]
        }));
    };






    const handleSave = () => {

        setErrors(() => {
            console.log(errors);



            // Проверка на отсутствие пустых полей time
            if (!(times.every((time) => time.value !== ''))) {
                return {
                    timeError: 'The Time value should not be empty.'
                };
            }
            // Проверка на отсутствие дубликатов
            const uniqueValues = Array.from(new Set(times.map((time) => time.value)));
            if (uniqueValues.length !== times.length) {
                return {
                    timeError: 'The Times values should not be repeated.'
                };
            }
            // Проверка на наличие одинаковых часов или минут
            const areHoursEqual = times.every(
                (time) => time.value.split(':')[0] === times[0].value.split(':')[0]
            );
            const areMinutesEqual = times.every(
                (time) => time.value.split(':')[1] === times[0].value.split(':')[1]
            );
            if (!(areHoursEqual || areMinutesEqual)) {
                return {
                    timeError: 'The hours or minutes should be the same. For detailed settings, use the Custom tab.'
                };
            }

            // Проверка на выделение хотя бы одного дня недели
            if (!Object.values(selectedDays).some((value) => value)) {
                return {
                    daysOfWeekError: 'Choose at least one day of the week.'
                };
            }


            //создаем массив выбранных дней
            const selectedDaysArray = Object.keys(selectedDays)
                .filter((day) => selectedDays[day]);
            console.log("selectedDays " + selectedDays);
            console.log("selectedDaysArray " + selectedDaysArray);

            const selectedDaysNumbersArray = selectedDaysArray.map((day) => Object.keys(dayOfWeekNumbers).findIndex((num) => dayOfWeekNumbers[num] === day));

            console.log(selectedDaysNumbersArray);

            let selectedDaysCron;
            if (selectedDaysArray.length === 7) {
                selectedDaysCron = "*";
            } else if (areNumbersConsecutive(selectedDaysNumbersArray)) {
                selectedDaysCron = `${selectedDaysArray[0]}-${selectedDaysArray[selectedDaysArray.length - 1]}`;
            } else {
                selectedDaysCron = `${selectedDaysArray.join(',')}`;
            }



            // Создание выражения CRON 



            let cronExpression;

            if (areMinutesEqual) {
                cronExpression = `${times[0].value.split(':')[1]} ${times.map((time) => time.value.split(':')[0]).join(',')} * * ${selectedDaysCron}`;
            } else if (areHoursEqual) {
                cronExpression = `${times.map((time) => time.value.split(':')[1]).join(',')} ${times[0].value.split(':')[0]} * * ${selectedDaysCron}`;
            } else {
                alert('Something went wrong.');
                return;
            }

            onSave(cronExpression);
            // если нет ошибок возвращает errors в изначальное состояние
            return {};
            // TODO: ввести сокращение дней недели. mon,tue,wed,thu,fri должны стать mon-fri.
        });

    };

    return (
        <div className='tab-container'>

            <label className='tab-label'>
                At Time:
            </label>

            {times.map((time) => (
                <div key={time.id} className='mb-2'>
                    <input
                        type="time"
                        value={time.value}
                        onChange={(e) => handleTimeChange(time.id, e.target.value)}
                    />

                    {times.length > 1 && (
                        <button
                            className='tab-button tab-secondary-button'
                            onClick={() => handleRemoveTimeField(time.id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            {errors.timeError && <span>{errors.timeError}</span>}


            <button className='my-2 tab-button' onClick={handleAddTimeField}>
                Add Time
            </button>
            <br />
            <label className='tab-label'>
                Days:
            </label>

            {Object.keys(dayOfWeekNames).map((day) => (
                <label key={day} className='tab-label'>
                    <input
                        type="checkbox"
                        checked={selectedDays[day]}
                        onChange={() => handleToggleDay(day)}
                    />
                    {dayOfWeekNames[day]}
                </label>
            ))}
            {errors.daysOfWeekError && <span>{errors.daysOfWeekError}</span>}


            <div className='button-container'>
                <button onClick={handleToggleWeekdays} className='m-2 tab-button'>Weekdays</button>
                <button onClick={handleToggleWeekends} className='mb-2 tab-button'>Weekends</button>

            </div>

            <button className="mt-2 tab-button" onClick={handleSave}>Save</button>
        </div>
    );
}

export default WeeklyTab;
