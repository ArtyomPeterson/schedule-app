export const validateMonths = (selectedMonths) => {
    let errors = [];
    
    // Проверка на выделение хотя бы одного месяца
    if (!Object.values(selectedMonths).some((value) => value)) {
        errors.push({
            index: -1,
            message: 'Choose at least one day of the week.'
        });
    }
    
    return errors;
};
