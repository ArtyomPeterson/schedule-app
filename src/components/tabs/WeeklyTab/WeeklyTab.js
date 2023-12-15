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
            let days;

            let allDaysAreSelected = Object.values(selectedDays).every(selectedDay => selectedDay === true);
            if (allDaysAreSelected) {
                days = '*';
            } else {
                days = '?'
            }

            const newCronExpression = {
                minutes: Array.from(new Set(times.map((time) => time.value.split(':')[1]))),
                hours: Array.from(new Set(times.map((time) => time.value.split(':')[0]))),
                days: [days],
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
        <div className='tab-container'>
            <form onSubmit={handleSave}>
                <div className='time-wrapper'>

                    <div className="time-container">
                        {times.map((time, index) => (

                            <div key={index} className="time-item">
                                <div className='time-content'>
                                    <label className='time-label'>Time {index + 1}:</label>

                                    <input
                                        className="time-input"
                                        type="time"
                                        value={time.value}
                                        onChange={({ target: { value } }) => handleTimeChange(index, value)}
                                    />

                                    {times.length > 1 && (
                                        <button
                                            className='remove-time-button btn btn-danger'
                                            onClick={() => handleRemoveTimeInput(time.index)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                            </svg>
                                        </button>
                                    )}
                                </div>


                                <div className="error-container">
                                    {timeErrors && timeErrors.length > 0 ? renderTimeErrors(time) : ''}
                                </div>



                            </div>
                        ))}
                    </div>

                </div>


                <div className="mb-2">
                    {timeErrors && timeErrors.length > 0 ? renderTimeErrors({ index: -1 }) : ''}
                </div>






                <button
                    className='add-time-button btn btn-success'
                    type="button"
                    onClick={handleAddTimeInput}
                >
                    <div className='mx-2'>Add Time</div>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                    </svg>
                </button>



                <label>Days of Week:</label>

                {Object.entries(dayOfWeekNames).map(([key, name]) => (
                    <div key={key} className="form-check form-switch">
                        <input
                            className="form-check-input"
                            id="flexSwitchCheckDefault"
                            type="checkbox"
                            checked={selectedDays[key] || false}
                            onChange={() => handleDayToggle(key)}
                        />
                        <label className="form-check-label" for="flexSwitchCheckDefault">
                            {name}
                        </label>
                    </div>
                ))}
                <div className="mb-2">
                    {dayOfWeekErrors && dayOfWeekErrors.length > 0 ? renderDayOfWeekErrors(-1) : ''}
                </div>



                <div>
                    <button type="button" onClick={handleToggleWeekdays} className='add-time-button btn btn-success'>Weekdays</button>
                    <button type="button" onClick={handleToggleWeekends} className='add-time-button btn btn-success'>Weekends</button>
                </div>

                <button
                    className='btn btn-primary'
                    type="submit"
                    disabled={
                        (timeErrors && timeErrors.length !== 0) ||
                        (dayOfWeekErrors && dayOfWeekErrors.length !== 0)
                    }
                >Save</button>
            </form>
        </div>
    );
};

export default WeeklyTab;
