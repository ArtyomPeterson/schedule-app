import React, { useState, useEffect } from 'react';
import { validateForm } from '../../validators/customFormValidator';

function CustomTab({ onSave, cronExpression }) {
    const [formData, setFormData] = useState({ minutes: "", hours: "", days: "", months: "", daysOfWeek: "", });
    const [errors, setErrors] = useState({});
    const [infoText, setInfoText] = useState('');

    // Обновляем formData при изменении cronExpression
    useEffect(() => {
        if (cronExpression) {
            console.log("cronExpression не undefined " + cronExpression);
            const trimmedString = cronExpression.trim();
            const substrings = trimmedString.split(' ');

            if (substrings.length === 5) {
                setFormData({
                    ...formData,
                    minutes: substrings[0],
                    hours: substrings[1],
                    days: substrings[2],
                    months: substrings[3],
                    daysOfWeek: substrings[4],
                });
            }
        } else { }
    }, [cronExpression]);



    const handleInfoClick = (fieldName) => {
        switch (fieldName) {
            case 'minutes':
                setInfoText("Enter minutes.\n* any value\n, value list separator\n- range of values\n/ step values\n0-59 allowed values");
                break;
            case 'hours':
                setInfoText("Enter hours.\n* any value\n, value list separator\n- range of values\n/ step values\n0-23 allowed values");
                break;
            case 'days':
                setInfoText("Enter days.\n* any value\n, value list separator\n- range of values\n/ step values\n1-31 allowed values");
                break;
            case 'months':
                setInfoText("Enter months.\n* any value\n, value list separator\n- range of values\n/ step values\n1-12 allowed values");
                break;
            case 'daysOfWeek':
                setInfoText("Enter days of week.\n* any value\n, value list separator\n- range of values\n/ step values\n0-6 allowed values");
                break;
            default:
                setInfoText('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        const validationErrors = validateForm(formData);

        //setErrors(validationErrors);
        // setErrors выполняется асинхронно
        setErrors((prevErrors) => {
            if (Object.keys(validationErrors).length > 0) {
                return validationErrors;
            } else {
                const cronExpression = `${formData.minutes} ${formData.hours} ${formData.days} ${formData.months} ${formData.daysOfWeek}`;
                onSave(cronExpression);
                return {};
            }
        });

    };

    return (
        <div className='tab-container custom-tab-container'>
            <div className='wide-wrapper'>
                <div className='custom-tab-label'>
                    <table>
                        <tbody>
                            {Object.keys(formData).map((fieldName) => (
                                <tr key={fieldName}>
                                    <td onClick={() => handleInfoClick(fieldName)}>
                                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name={fieldName}
                                            value={formData[fieldName]}
                                            onChange={handleChange}
                                        />
                                        {errors[fieldName] && <span>{errors[fieldName]}</span>}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="info-block">
                        <pre>{infoText}</pre>
                    </div>
                </div>
            </div>

            <div className="button-container">
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};


export default CustomTab;