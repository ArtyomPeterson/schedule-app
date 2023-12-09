import React from 'react';

function Output({ cronExpression, onLoad }) {
    const handleLoad = () => {
        //TODO логику сохранения данных
        onLoad(cronExpression);
    };

    return (
        <div className='mt-4'>
            <input type="text" value={cronExpression} readOnly />
            <button onClick={handleLoad}>Load</button>
        </div>
    );
}

export default Output;
