export default function getInfoText(fieldName) {
    switch (fieldName) {
        case 'minutes':
            return "Enter minutes.\n* any value\n, value list separator\n- range of values\n/ step values\n0-59 allowed values";
        case 'hours':
            return "Enter hours.\n* any value\n, value list separator\n- range of values\n/ step values\n0-23 allowed values";
        case 'days':
            return "Enter days.\n* any value\n, value list separator\n- range of values\n/ step values\n1-31 allowed values";
        case 'months':
            return "Enter months.\n* any value\n, value list separator\n- range of values\n/ step values\n1-12 allowed values";
        case 'daysOfWeek':
            return "Enter days of week.\n* any value\n, value list separator\n- range of values\n/ step values\n0-6 allowed values";
        default:
            return '';
    }
}