import React, { useState, useEffect } from 'react';
import { validateForm } from '../validators/customFormValidator';

function Output({ cronExpression, onLoad }) {
    const [formData, setFormData] = useState({ minutes: "", hours: "", days: "", months: "", daysOfWeek: "", });
    const [errors, setErrors] = useState({});
    const [userCronExpression, setUserCronExpression] = useState(cronExpression);


    useEffect(() => {
        //при изменении cron expression автоматически меняется userCronExpression
        setUserCronExpression(cronExpression);
    }, [cronExpression]);



    const handleInputChange = (expression) => {

        setUserCronExpression(expression);
    };




    const handleLoad = () => {
        console.log("проверка " + userCronExpression);
        //обрезаем пробелы
        const trimmedString = userCronExpression.trim();
        // делим на подстроки
        const substrings = trimmedString.split(' ');
        console.log("подстроки" + substrings);
        // подстрок должно быть 5
        if (substrings.length === 5) {
            setFormData({
                ...formData,
                minutes: substrings[0],
                hours: substrings[1],
                days: substrings[2],
                months: substrings[3],
                daysOfWeek: substrings[4]
            });

            const validationErrors = validateForm(formData);

            setErrors((prevErrors) => {
                if (Object.keys(validationErrors).length > 0) {
                    console.log("output.js есть ошибки " + userCronExpression);
                    console.log(validationErrors);
                    return validationErrors;
                } else {
                    console.log("output.js ошибок нет " + userCronExpression);

                    onLoad(userCronExpression.trim());
                    return {};
                }
            });


        } else {
            alert('Неверный формат строки. Ожидается 5 подстрок.');
            return {};
        }
    };




    return (
        <div className='container output-container'>
            <input type="text" value={userCronExpression} onChange={(e) => handleInputChange(e.target.value)} />
            <button className='tab-button tab-secondary-button' onClick={handleLoad}>Load</button>
            {Object.keys(formData).map((fieldName) => (
                <div key={fieldName}>
                    {errors[fieldName] && <span>{errors[fieldName]}</span>}
                </div>
            ))}
        </div>

    );
}

export default Output;
