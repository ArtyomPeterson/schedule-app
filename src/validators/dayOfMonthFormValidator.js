export const validateDayOfMonth = (dayOfMonth) => {
    let errors = [];

    if (!dayOfMonth || dayOfMonth === '') {
        errors.push({
            index: -1,
            message: 'Select the day of the month.'
        }); 
    } else if (dayOfMonth < 1 || dayOfMonth > 31) {
        errors.push({
            index: -1,
            message: 'The day of the month should be from 1 to 31.'
        }); 
    }

    return errors;
};