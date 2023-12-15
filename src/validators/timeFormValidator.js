
export const validateTime = (times) => {
    let errors = [];

    times.forEach((time) => {
        if (time.value === '') {
            errors.push({
                index: time.index,
                message: "The Time value should not be empty."
            });
        }
    });



    const seen = new Set();
    for (const { index, value } of times) {
        if (value !== "") {
             if (seen.has(value)) {
            errors.push({
                index: index,
                message: 'The Times values should not be repeated.'
            });
        }
        seen.add(value);
        }
       
    }


    // массив всех часов
     console.log(times);

    const hours = times.map((time) => time.value.split(':')[0]);
    const minutes = times.map((time) => time.value.split(':')[1]);


    const areElementsEqual = (array) => {
        if (array.length === 0) {
            return false;
        }
        return array.every(element => element === array[0]);
    };

    const areHoursEqual = areElementsEqual(hours);
    const areMinutesEqual = areElementsEqual(minutes);



    if (!(times.length === 1) &&
        !(areHoursEqual ^ areMinutesEqual)) {
        errors.push({
            index: -1,
            message: "Either all hours or all minutes should be the same."
        });

    }

    // if (
    //     ![...new Set(hours)].length === 1 ||
    //     ![...new Set(minutes)].length === 1
    // ) {
    //     errors.push({
    //         index: -1,
    //         message: "Either all hours or all minutes should be the same."
    //     });
    // }
    // console.log();
    return errors;
};