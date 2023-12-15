// const selectedDays: {
//     mon: boolean;
//     tue: boolean;
//     wed: boolean;
//     thu: boolean;
//     fri: boolean;
//     sat: boolean;
//     sun: boolean;
// }

export const validateDayOfWeek = (selectedDays) => {
    let errors = [];


    const atLeastOneDaySelected = Object.values(selectedDays).some(value => value === true);

    if (!atLeastOneDaySelected) {
        errors.push({
            index: -1,
            message: 'Choose at least one day of the week.'
        });
    }

    return errors;
};