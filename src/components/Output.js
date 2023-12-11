import React, { useState, useEffect } from 'react';

function Output({ cronExpression, onLoad, onInputChange }) {

    // useEffect(() => {

    //     onInputChange(cronExpression);
    // }, [cronExpression, onInputChange]);

    const handleLoad = () => {

        onLoad(cronExpression);
    };


    return (
        <div className='container output-container'>
            <input type="text" value={cronExpression} onChange={(e) => onInputChange(e.target.value)} />
            <button className='tab-button tab-secondary-button' onClick={handleLoad}>Load</button>
        </div>
    );
}

export default Output;
