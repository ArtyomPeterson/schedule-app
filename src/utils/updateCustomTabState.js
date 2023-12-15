export function updateUI(cronExpression, setFormData) {

    // const cronExpression = {
    //     minutes: [''],
    //     hours: [''],
    //     days: [''],
    //     months: [''],
    //     daysOfWeek: [''],
    // };

    // const formData = {
    //     minutes: '',
    //     hours: '',
    //     days: '',
    //     months: '',
    //     daysOfWeek: '',
    // };

    setFormData({
        minutes: cronExpressionValueToString(cronExpression.minutes),
        hours: cronExpressionValueToString(cronExpression.hours),
        days: cronExpressionValueToString(cronExpression.days),
        months: cronExpressionValueToString(cronExpression.months),
        daysOfWeek: cronExpressionValueToString(cronExpression.daysOfWeek),
    });
}






const cronExpressionValueToString = (cronExpressionValue) => {
    if (!cronExpressionValue) {
        return ''; 
    }
    const cronValueString = cronExpressionValue.join(',');
    return cronValueString;
};



