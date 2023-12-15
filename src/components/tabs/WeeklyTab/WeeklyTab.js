import React, { useState, useEffect } from 'react'; import '../../../App.css';
import { validateTime } from '../../../validators/timeFormValidator';
import { validateDayOfWeek } from '../../../validators/dayOfWeekFormValidator';
import { formatSelectedValues } from '../../common/formatSelectedValues';
import { updateUI } from '../../../utils/updateWeeklyTabState';


const dayOfWeekNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
};

function WeeklyTab({ onSave, cronWeeklyExpression }) {

    const [times, setTimes] = useState([{ index: 0, value: '' }]);
    const [selectedDays, setSelectedDays] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
    });
    

    const [timeErrors, setTimeErrors] = useState();
    const [dayOfWeekErrors, setDayOfWeekErrors] = useState();
    useEffect(() => {
        setTimeErrors(validateTime(times));
    }, [times]);
    useEffect(() => {
        setDayOfWeekErrors(validateDayOfWeek(selectedDays));
    }, [selectedDays]);
    


    useEffect(() => {
        if (cronWeeklyExpression.minutes[0] !== 0) {
            updateUI(cronWeeklyExpression,
                setTimes, 
                setSelectedDays, 
                selectedDays);
        }
    }, [cronWeeklyExpression]);
    

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        setTimes([{ index: 0, value: getCurrentTime() }]);
    }, []);


    // Добавление поля time
    const handleAddTimeInput = () => {
        setTimes((prevTimes) => [
            ...prevTimes,
            { index: prevTimes[prevTimes.length - 1].index + 1, value: '' }
        ])
    };

    // Удаление поля time
    const handleRemoveTimeInput = (index) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.index !== index));
    };

    // Изменение time
    const handleTimeChange = (index, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) =>
                time.index === index ? { ...time, value } : time
            )
        );
    };

    // Поведение кнопки Будни
    const handleToggleWeekdays = () => {
        setSelectedDays((prevSelectedDays) => {
            const weekdaysSelected = Object.keys(prevSelectedDays)
                .filter(dayOfWeek => dayOfWeek !== 'sat' && dayOfWeek !== 'sun')
                .every(dayOfWeek => prevSelectedDays[dayOfWeek]);
            // Если все будние дни выделены и выходные не выделены, снимаем выделение со всех дней, иначе выделяем будние дни
            return weekdaysSelected
                ? {
                    ...prevSelectedDays,
                    mon: false,
                    tue: false,
                    wed: false,
                    thu: false,
                    fri: false,
                }
                : {
                    ...prevSelectedDays,
                    mon: true,
                    tue: true,
                    wed: true,
                    thu: true,
                    fri: true
                };
        });
    };
    // Поведение кнопки выходные
    const handleToggleWeekends = () => {
        setSelectedDays((prevSelectedDays) => {
            const areWeekendsSelected = prevSelectedDays.sat && prevSelectedDays.sun;
            // Если все выходные дни выделены и будние не выделены, снимаем выделение со всех дней, иначе выделяем выходные дни
            return areWeekendsSelected
                ? {
                    ...prevSelectedDays,
                    sat: false,
                    sun: false
                }
                : {
                    ...prevSelectedDays,
                    sat: true,
                    sun: true
                };        
        });
    };
    // Чекбоксы дней недели
    const handleDayToggle = (dayOfWeek) => {
        
        setSelectedDays((prevSelectedDays) => ({
            ...prevSelectedDays,
            [dayOfWeek]: !prevSelectedDays[dayOfWeek]
        }));
    };


    const handleSave = (event) => {
        event.preventDefault();

        console.log(timeErrors);
        console.log(dayOfWeekErrors);

        const validationTimeErrors = validateTime(times);
        const validationDayOfWeekErrors = validateDayOfWeek(selectedDays);

        setTimeErrors(validationTimeErrors || []);
        setDayOfWeekErrors(validationDayOfWeekErrors || []);

        if (Object.keys(validationTimeErrors).length === 0 && Object.keys(validationDayOfWeekErrors).length === 0) {

            const selectedDaysOfWeekCron = formatSelectedValues(selectedDays, 'daysOfWeek');
            const newCronExpression = {
                minutes: Array.from(new Set(times.map((time) => time.value.split(':')[1]))),
                hours: Array.from(new Set(times.map((time) => time.value.split(':')[0]))),
                days: ['?'],
                months: ['*'],
                daysOfWeek: selectedDaysOfWeekCron
            }
            onSave(newCronExpression);

        }
    }

    const renderTimeErrors = (field) => {
        const errorsForTime = timeErrors.filter(error => error.index === field.index);
        return errorsForTime.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };


    const renderDayOfWeekErrors = (fieldIndex) => {
        const errorsForDayOfWeek = dayOfWeekErrors.filter(error => error.index === fieldIndex);
        return errorsForDayOfWeek.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));  
    };










    return (
        <div>
            <form onSubmit={handleSave}>
                {times.map((time, index) => (
                    <div key={index}>
                        <label>Time {index + 1}:</label>
                        <input
                            type="time"
                            value={time.value}
                            onChange={({ target: { value } }) => handleTimeChange(index, value)}
                        />

                        {times.length > 1 && (
                            <button
                                className=''
                                onClick={() => handleRemoveTimeInput(time.index)}
                            >
                                Remove Time
                            </button>
                        )}
                        {timeErrors && timeErrors.length > 0 ? renderTimeErrors(time) : ''}


                    </div>
                ))}

                {timeErrors && timeErrors.length > 0 ? renderTimeErrors({ index: -1 }) : ''}







                <button type="button" onClick={handleAddTimeInput}>
                    Add Time
                </button>



                <label>Days of Week:</label>

                <div>
                    {Object.entries(dayOfWeekNames).map(([key, name]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={selectedDays[key] || false}
                                onChange={() => handleDayToggle(key)}
                            />
                            {name}
                        </label>
                    ))}
                </div>

                {dayOfWeekErrors && dayOfWeekErrors.length > 0 ? renderDayOfWeekErrors(-1) : ''}




                <div>
                    <button type="button" onClick={handleToggleWeekdays} className=''>Weekdays</button>
                    <button type="button" onClick={handleToggleWeekends} className=''>Weekends</button>
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default WeeklyTab;
