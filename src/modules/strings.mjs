export function getDefaultDateStringForInput() {
    const dateTimeObj = new Date();
    return getDateStringInputFormat(dateTimeObj);
}
export function getDateStringInputFormat(dateTimeObj) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat(undefined, options);
    const parts = formatter.formatToParts(dateTimeObj);

    let yearPart, monthPart, dayPart;
    parts.forEach(part => {
        if (part.type === 'year') yearPart = part.value;
        if (part.type === 'month') monthPart = part.value;
        if (part.type === 'day') dayPart = part.value;
    });

    return `${yearPart}-${monthPart}-${dayPart}`;
}
export function getDateStringsForSpanAndButton(dateInputValue) {
    const dateTimeString = `${dateInputValue}T00:00`; 
    const dateTimeObj = new Date(dateTimeString);

    const dateForButton = getLargeFromattedDate(dateTimeObj);
    
    const dateForSpan = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
    }).format(dateTimeObj);
    
    return {dateForButton, dateForSpan};
}
export function getLargeFromattedDate(dateTimeObj) {
    return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }).format(dateTimeObj);
}
export function getDefaultTimeStringForInput() {
    const dateTimeObj = new Date();
    dateTimeObj.setHours(dateTimeObj.getHours() + 1);
    dateTimeObj.setMinutes(0);
    const defaulTimeString = getTimeStringInputFormat(dateTimeObj);
    return defaulTimeString;
}
export function getTimeStringInputFormat(dateTimeObj) {
    const timeForInput = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(dateTimeObj);
    return timeForInput;
}
export function getTimeStringForSpan(timeInputValue) {
    const dateTimeString = `0000-01-01T${timeInputValue}`;
    const dateTimeObj = new Date(dateTimeString);
    const timeString = Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(dateTimeObj);
    return timeString;
}
export function getTimeInputValueMinutesMultipleOf5(value) {
    const minutes = +value.slice(3,5);
    const minutesMultipleOf5 = Math.round(minutes / 5) * 5;
    const minutesString0padded = ('0' + minutesMultipleOf5).slice(-2);
    const newInputvalue = 
        `${value.slice(0,3)}${minutesString0padded}${value.slice(5)}`;
    return newInputvalue;
}