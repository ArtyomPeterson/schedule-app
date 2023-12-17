import React, { useState, useEffect } from 'react';
import { validateForm } from '../validators/cronValidator';

function Output({ cronExpression, onLoad }) {
    const [errors, setErrors] = useState([]);

    const [userCronStringExpression, setUserCronStringExpression] = useState('');



    useEffect(() => {
        if (cronExpression) {
            if (cronExpression.minutes.length === 0) {
                console.log("cronExpression пустой " + cronExpression);
            } else {
                const cronString = `${cronExpression.minutes} ${cronExpression.hours} ${cronExpression.days} ${cronExpression.months} ${cronExpression.daysOfWeek}`;
                setUserCronStringExpression(cronString);
                console.log("cronExpression string " + cronString);
            }
        }
    }, [cronExpression]);

    const handleInputChange = (expression) => {
        setUserCronStringExpression(expression);
        setErrors([]);
    };








    const handleLoad = () => {

        console.log("errors до setErrors: " + errors);

        //собираем из строчки вывода двумерный массив строк.
        const formData = userCronStringExpression.split(' ').map((group) =>
            group.split(",").map((value) => value.trim()));
        console.log("formData: " + formData);

        if (formData.length !== 5) {
            setErrors([{
                fieldName: "form",
                message: 'Invalid Сron format. Enter 5 values please.'
            }]);
            return;
        };

        const newCronExpression = {
            minutes: formData[0],
            hours: formData[1],
            days: formData[2],
            months: formData[3],
            daysOfWeek: formData[4]
        };


        setErrors([]);
        const validationErrors = validateForm(newCronExpression);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
            onLoad(newCronExpression);
        } else {
            console.log("найдены ошибки: " + validationErrors);
        }

    };







    return (
        <div className='mt-3 container'>


            <div className='output-container'>



                <input
                    className='cron-input'
                    type="text"
                    value={userCronStringExpression}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                <button className='btn btn-outline-primary' onClick={handleLoad}>Load</button>



                {errors && errors.map((error, index) => (
                    <div key={index}>
                        <span>{error.fieldName} - {error.message}</span>
                    </div>
                ))}



            </div>
        </div>
    );
};

export default Output;
