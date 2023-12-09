import React from 'react';
import useTimeInput from "./useTimeInput";

function TimeInputs({ times, useStep }) {
    const {
        handleAddTimeField,
        handleRemoveTimeField,
        handleTimeChange
    } = useTimeInput();

    return (
        <div>
            {/* Первое поле ввода time */}
            <div className='mb-2'>
                <label>
                    At time:
                    <input
                        type="time"
                        value={times[0].value}
                        onChange={(e) => handleTimeChange(times[0].id, e.target.value)}
                    />
                </label>

                {times.length > 1 && (
                    <button
                        className='ml-2'
                        onClick={() => handleRemoveTimeField(times[0].id)}
                    >
                        Remove
                    </button>
                )}
            </div>

            {/* Все остальные поля ввода time */}
            {times.slice(1).map((time) => (
                <div key={time.id} className='mb-2'>
                    <label>
                        and at time
                        <input
                            type="time"
                            value={time.value}
                            onChange={(e) => handleTimeChange(time.id, 'value', e.target.value)}
                            disabled={useStep}
                        />

                        {times.length > 1 && (
                            <button
                                className='ml-2'
                                onClick={() => handleRemoveTimeField(time.id)}
                            >
                                Remove
                            </button>
                        )}
                    </label>
                </div>
            ))}

            <button className='ml-2' onClick={handleAddTimeField}>
                Add Time
            </button>
        </div>
    );
}

export default TimeInputs;
