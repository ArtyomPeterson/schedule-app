import React, { useState, useEffect } from 'react';
import { validateForm } from '../validators/cronValidator';

function Output({ cronExpression, onLoad }) {
    const [errors, setErrors] = useState();

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
    };


    const handleLoad = () => {


        const validationErrors = validateForm(userCronStringExpression);
        setErrors({});


        if (validationErrors && Object.keys(validationErrors).length === 0) {

            const valuesArray = userCronStringExpression.split(" ").map((group) =>
                group.split(",").map((value) => value.trim())
            );

            const newCronExpression = {
                minutes: valuesArray[0],
                hours: valuesArray[1],
                days: valuesArray[2],
                months: valuesArray[3],
                daysOfWeek: valuesArray[4],
            };

            onLoad(newCronExpression);

        } else {
            setErrors(validationErrors);

        }
    }

    return (
        <div className='container'>



            <input
                type="text"
                value={userCronStringExpression}
                onChange={(e) => handleInputChange(e.target.value)}
            />
            <button className='' onClick={handleLoad}>Load</button>

            {errors && Object.keys(errors).map((fieldName) => (
                <div key={fieldName}>
                    {errors[fieldName] && <span>{errors[fieldName]}</span>}
                </div>
            ))}


        </div>

    );
};

export default Output;
