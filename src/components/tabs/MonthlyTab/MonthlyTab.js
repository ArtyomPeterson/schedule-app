import React, { useState, useEffect } from 'react';
import { validateTime } from '../../../validators/timeFormValidator';
import { validateDayOfMonth } from '../../../validators/dayOfMonthFormValidator';
import { validateMonths } from '../../../validators/monthFormValidator';
import { formatSelectedValues } from '../../common/formatSelectedValues';
import { updateUI } from '../../../utils/updateMonthlyTabState';

const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};

function MonthlyTab({ onSave, cronMonthlyExpression }) {

    const [times, setTimes] = useState([{ index: 0, value: '' }]);
    const [dayOfMonth, setDayOfMonth] = useState(1);
    const [selectedMonths, setSelectedMonths] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        11: true,
        12: true,
    });

    const [timeErrors, setTimeErrors] = useState();
    const [dayOfMonthErrors, setDayOfMonthErrors] = useState();
    const [monthErrors, setMonthErrors] = useState();
    useEffect(() => {
        setTimeErrors(validateTime(times));
    }, [times]);
    useEffect(() => {
        setDayOfMonthErrors(validateDayOfMonth(dayOfMonth));
    }, [dayOfMonth]);
    useEffect(() => {
        setMonthErrors(validateMonths(selectedMonths));
    }, [selectedMonths]);

    useEffect(() => {
        if (cronMonthlyExpression.minutes[0] !== '') {
            updateUI(cronMonthlyExpression,
                setTimes, 
                setDayOfMonth, 
                setSelectedMonths,
                selectedMonths);
        }
    }, [cronMonthlyExpression]);

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

    // Изменение day
    const handleDayOfMonthChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setDayOfMonth(value);
        // if (!isNaN(value) && value >= 1 && value <= 31) {
        //     setDayOfMonth(value);
        // }
    };

    // Чекбоксы месяцев
    const handleMonthToggle = (month) => {
        setSelectedMonths((prevSelectedMonths) => ({
            ...prevSelectedMonths,
            [month]: !prevSelectedMonths[month]
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();

        console.log(timeErrors);
        console.log(dayOfMonthErrors);
        console.log(monthErrors);

        const validationTimeErrors = validateTime(times);
        const validationDayOfMonthErrors = validateDayOfMonth(dayOfMonth);
        const validationMonthErrors = validateMonths(selectedMonths);

        setTimeErrors(validationTimeErrors || []);
        setDayOfMonthErrors(validationDayOfMonthErrors || []);
        setMonthErrors(validationMonthErrors || []);

        if (Object.keys(validationTimeErrors).length === 0 &&
            Object.keys(validationDayOfMonthErrors).length === 0 &&
            Object.keys(validationMonthErrors).length === 0) {

            const selectedMonthsCron = formatSelectedValues(selectedMonths, 'months');
            const newCronExpression = {
                minutes: Array.from(new Set(times.map((time) => time.value.split(':')[1]))),
                hours: Array.from(new Set(times.map((time) => time.value.split(':')[0]))),
                days: [`${dayOfMonth}`],
                months: selectedMonthsCron,
                daysOfWeek: ['*']
            }

            onSave(newCronExpression)

        }
    };

    const renderTimeErrors = (field) => {
        const errorsForTime = timeErrors.filter(error => error.index === field.index);
        return errorsForTime.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    const renderDayOfMonthErrors = (fieldIndex) => {
        const errorsForDayOfMonth = dayOfMonthErrors.filter(error => error.index === fieldIndex);
        return errorsForDayOfMonth.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    const renderMonthErrors = (fieldIndex) => {
        const errorsForMonth = monthErrors.filter(error => error.index === fieldIndex);
        return errorsForMonth.map((error, errorIndex) => (
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



                <label>Day of Month:</label>
                <input
                    type="number"
                    value={dayOfMonth}
                    onChange={handleDayOfMonthChange}
                    min="1"
                    max="31"
                />
                {dayOfMonthErrors && dayOfMonthErrors.length > 0 ? renderDayOfMonthErrors(-1) : ''}


                <label>Months:</label>

                <div>
                    {Object.entries(monthNames).map(([key, name]) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={selectedMonths[key] || false}
                                onChange={() => handleMonthToggle(key)}
                            />
                            {name}
                        </label>
                    ))}
                </div>

                {monthErrors && monthErrors.length > 0 ? renderMonthErrors(-1) : ''}


                <button type="submit">Save</button>

            </form>

        </div>
    );
}

export default MonthlyTab;
