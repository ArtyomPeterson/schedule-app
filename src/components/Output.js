import React, { useState, useEffect } from 'react';
import { validateForm } from '../validators/customFormValidator';

function Output({ cronExpression, onLoad }) {
    const [formData, setFormData] = useState({ minutes: "", hours: "", days: "", months: "", daysOfWeek: "", });
    const [errors, setErrors] = useState({});
    const [userCronExpression, setUserCronExpression] = useState("");


    useEffect(() => {
        //при изменении cron expression автоматически меняется userCronExpression
        setUserCronExpression(cronExpression);
        console.log("cronExpression " + cronExpression);
    }, [cronExpression]);



    const handleInputChange = (expression) => {

        //TODO проверка 
        setUserCronExpression(expression);
        console.log("userCronExpression " + userCronExpression);
    };




    const handleLoad = () => {
        console.log("вызван handleLoad в Output.js " + userCronExpression);
        const trimmedString = userCronExpression.trim();
        const substrings = trimmedString.split(' ');
        console.log("userCronExpression разделен на массив строк " + substrings);
        // подстрок должно быть 5
        if (substrings.length === 5) {

            setFormData(prevFormData => ({
                ...prevFormData,
                minutes: substrings[0],
                hours: substrings[1],
                days: substrings[2],
                months: substrings[3],
                daysOfWeek: substrings[4]
            }));

            const validationErrors = validateForm(formData);
            console.log("validationErrors: ", validationErrors);


            setErrors((prevErrors) => {
                if (Object.keys(validationErrors).length > 0) {
                    console.log("userCronExpression не прошел проверку в Output.js " + userCronExpression);
                    console.log("ошибки: " + validationErrors);
                    return validationErrors;
                } else {
                    console.log("userCronExpression прошел проверку в Output.js " + userCronExpression);
                    console.log("будет вызван onLoad()");
                    onLoad(userCronExpression.trim());
                    // TODO проверить
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
