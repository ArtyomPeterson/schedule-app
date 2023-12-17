import React, { useState, useEffect } from 'react';
import { validateForm } from '../../../validators/cronValidator';
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

    const [infoText, setInfoText] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newCronExpression = {
            minutes: formData.minutes.split(","),
            hours: formData.hours.split(","),
            days: formData.days.split(","),
            months: formData.months.split(","),
            daysOfWeek: formData.daysOfWeek.split(",")
        };
        setErrors(validateForm(newCronExpression));
    }, [formData]);

    useEffect(() => {
        if (cronCustomExpression.minutes[0] !== '') {
            updateUI(cronCustomExpression, setFormData);
        }
    }, [cronCustomExpression]);

    useEffect(() => {
        console.log('errors in CustomTab: ');
        Array.isArray(errors) && errors.map(error => {
            console.log(error);
        })
    }, [errors]);

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

        console.log("errors до setErrors: " + errors);
        console.log("formData: " + formData);
        
        const newCronExpression = {
            minutes: formData.minutes.split(","),
            hours: formData.hours.split(","),
            days: formData.days.split(","),
            months: formData.months.split(","),
            daysOfWeek: formData.daysOfWeek.split(",")
        };

        setErrors([]);
        const validationErrors = validateForm(newCronExpression);
        setErrors(validationErrors);

        if (validationErrors.length === 0) {
            onSave(newCronExpression);
        } else {
            console.log("найдены ошибки: " + validationErrors);
        }
    };


    return (


        <div className='tab-container'>
            <form onSubmit={handleSave}>
                <div className='custom-container'>



                    <label onClick={() => { handleInfoClick("minutes") }}>
                        Minutes :
                    </label>

                    <div className='custom-input'
                        onClick={() => { handleInfoClick("minutes") }} >
                        <input
                            className='cron-input'
                            type="text"
                            name="minutes"
                            value={formData.minutes}
                            onChange={handleChange}


                        />

                        <div className="error-container">
                            {errors && errors.length > 0 && renderErrors("minutes")}
                        </div>
                    </div>

                    <div className="info-block">
                        <pre>{infoText}</pre>
                    </div>

                    <label onClick={() => { handleInfoClick("hours") }}>
                        Hours :
                    </label>
                    <div className='custom-input'
                        onClick={() => { handleInfoClick("hours") }}>
                        <input
                            className='cron-input'
                            type="text"
                            name='hours'
                            value={formData.hours}
                            onChange={handleChange}
                        />

                        <div className="error-container">
                            {errors && errors.length > 0 && renderErrors("hours")}
                        </div>
                    </div>

                    <label onClick={() => { handleInfoClick("days") }}>
                        Days :
                    </label>
                    <div className='custom-input'
                        onClick={() => { handleInfoClick("days") }}>
                        <input
                            className='cron-input'
                            type="text"
                            name="days"
                            value={formData.days}
                            onChange={handleChange}
                        />

                        <div className="error-container">
                            {errors && errors.length > 0 && renderErrors("days")}
                        </div>
                    </div>

                    <label onClick={() => { handleInfoClick("months") }}>
                        Months :
                    </label>
                    <div className='custom-input'
                        onClick={() => { handleInfoClick("months") }}>
                        <input
                            className='cron-input'
                            type="text"
                            name="months"
                            value={formData.months}
                            onChange={handleChange}
                        />

                        <div className="error-container">
                            {errors && errors.length > 0 && renderErrors("months")}
                        </div>
                    </div>

                    <label onClick={() => { handleInfoClick("daysOfWeek") }}>
                        Days of Week :
                    </label>
                    <div className='custom-input'
                        onClick={() => { handleInfoClick("daysOfWeek") }}>
                        <input
                            className='cron-input'
                            type="text"
                            name="daysOfWeek"
                            value={formData.daysOfWeek}
                            onChange={handleChange}
                        />

                        <div className="error-container">
                            {errors && errors.length > 0 && renderErrors("daysOfWeek")}
                        </div>
                    </div>




                </div>


                <button
                    type="submit"
                    className='btn btn-primary'
                    disabled={errors && errors.length !== 0}
                    onClick={handleSave}>Save</button>

            </form>
        </div >
    )

};


export default CustomTab;