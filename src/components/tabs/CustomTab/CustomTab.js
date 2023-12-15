import React, { useState, useEffect } from 'react';
import { validateForm } from '../../../validators/customFormValidator';
import getInfoText from './InfoText';
import { updateUI } from '../../../utils/updateCustomTabState';

function CustomTab({ onSave, cronCustomExpression }) {

    const [formData, setFormData] = useState({
        minutes: '',
        hours: '',
        days: '',
        months: '',
        daysOfWeek: '',
    });

    const [errors, setErrors] = useState({});

    const [infoText, setInfoText] = useState('');

    



    useEffect(() => {
        if (cronCustomExpression.minutes[0] !== '') {
            updateUI(cronCustomExpression, setFormData);
        }
    }, [cronCustomExpression]);




    const handleInfoClick = (fieldName) => {
        setInfoText(getInfoText(fieldName))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const renderErrors = (fieldName) => {
        const errorsForField = errors.filter(error => error.fieldName === fieldName);
        return errorsForField.map((error, errorIndex) => (
            <span key={errorIndex}>{error.message}</span>
        ));
    };

    const handleSave = (event) => {
        event.preventDefault();

        console.log("errors"+ errors);
        console.log("formData"+ formData);

        const validationErrors = validateForm(formData);

        setErrors(validationErrors);


        if (Object.keys(validationErrors).length === 0) {
            const newCronExpression = {
                minutes: formData.minutes.split(","),
                hours: formData.hours.split(","),
                days: formData.days.split(","),
                months: formData.months.split(","),
                daysOfWeek: formData.daysOfWeek.split(",")
            }
            onSave(newCronExpression);
        }
    };

    return (


        <div className='tab-container custom-tab-container'>
            <form onSubmit={handleSave}>
                {Object.keys(formData).map((fieldName) => (

                    <label key={fieldName} onClick={() => handleInfoClick(fieldName)}>
                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} :

                        <input
                            type="text"
                            name={fieldName}
                            value={formData[fieldName]}
                            onChange={handleChange}
                        />
                        <div>
                            {errors && errors.length > 0 && renderErrors(fieldName)}
                        </div>

                    </label>

                ))}

                <div className="info-block">
                    <pre>{infoText}</pre>
                </div>

                <div className="button-container">
                    <button type="submit" className='tab-button' onClick={handleSave}>Save</button>
                </div>
            </form>
        </div >
    );
};


export default CustomTab;