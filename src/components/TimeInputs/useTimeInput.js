import { useState, useEffect } from 'react';

const useTimeInput = () => {
    const [times, setTimes] = useState([{ id: 1, value: '' }]);

    // Функция ставит текущее время в инпут Time
    useEffect(() => {
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };
        setTimes([{ id: 1, value: getCurrentTime() }]);
    }, []);

    const handleAddTimeField = () => {
        setTimes((prevTimes) => [
            ...prevTimes,
            { id: prevTimes.length + 1, value: '' }
        ]);
    };

    const handleRemoveTimeField = (id) => {
        setTimes((prevTimes) => prevTimes.filter((time) => time.id !== id));
    };

    const handleTimeChange = (id, value) => {
        setTimes((prevTimes) =>
            prevTimes.map((time) => (time.id === id ? { ...time, value } : time))
        );
    };

    return {
        times,
        handleAddTimeField,
        handleRemoveTimeField,
        handleTimeChange
    };
};

export default useTimeInput;
