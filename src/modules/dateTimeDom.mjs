import { time } from "./time.mjs";
import * as Strings from "./strings.mjs";
import { snapElementsInClockBasedOnTimeObject } from "./clock.mjs";


const scheduleDiv = document.querySelector('#schedule');
const timeDom = {
    input: document.querySelector('#time-dialog input'),
    dialog: document.querySelector('#time-dialog'),
    setButton: document.querySelector('#set-time'),
    cancelButton: document.querySelector('#time-dialog .cancel'),
    doneButton: document.querySelector('#time-dialog .done'),
}
const dateDom = {
    input: document.querySelector('#date-dialog input'),
    dialog: document.querySelector('#date-dialog'),
    setButton: document.querySelector('#set-date'),
    cancelButton: document.querySelector('#date-dialog .cancel'),
    doneButton: document.querySelector('#date-dialog .done'),
}



function setDefaultDateForInput() {
    const defaulDate = Strings.getDefaultDateStringForInput();
    dateDom.input.value = defaulDate;
    dateDom.input.dataset.default = true;
}
function setDefaultTimeForInput() {
    const defaulTime = Strings.getDefaultTimeStringForInput();
    timeDom.input.value = defaulTime;
    timeDom.input.dataset.default = true;
}

dateDom.setButton.addEventListener('click', () => dateDom.dialog.showModal());
dateDom.cancelButton.addEventListener('click', event => {
    event.preventDefault();
    dateDom.dialog.close();
});
dateDom.doneButton.addEventListener('click', (event) => {
    event.preventDefault();
    delete dateDom.input.dataset.default;
    delete timeDom.input.dataset.default;
    if (dateDom.input.value) {
        if (!scheduleDiv.innerHTML) createDateTimeElements();
        setDateTimeSpansAndButtonsText();
    }
    dateDom.dialog.close();
});
timeDom.setButton.addEventListener('click', () => {
    timeDom.dialog.showModal();
    document.activeElement?.blur();
});
timeDom.cancelButton.addEventListener('click', event => {
    event.preventDefault();
    timeDom.dialog.close();
});
timeDom.doneButton.addEventListener('click', (event) => {
    timeDom.dialog.close();

    if (!timeDom.input.value) timeDom.input.value = time.getTimeForInput();
    const timeInputValue = Strings.getTimeInputValueMinutesMultipleOf5(timeDom.input.value);
    //This is done so if the user sets the time by tabing to the hidden index
    timeDom.input.value = timeInputValue;
    
    event.preventDefault();
    delete dateDom.input.dataset.default;
    delete timeDom.input.dataset.default;
    time.update(timeDom.input.value);
    snapElementsInClockBasedOnTimeObject(timeDom.dialog);
    if (!scheduleDiv.innerHTML) createDateTimeElements();
    setDateTimeSpansAndButtonsText();
});
function getDateObjCorrectedDay(timeInputValue) {
    const dateTimeObj = new Date();
    const desiredHours = +timeInputValue.slice(0,2);
    const desiredMinutes = +timeInputValue.slice(3,5);
    const currentTimeInputValue = Strings.getTimeStringInputFormat(dateTimeObj);
    const currentHours = +currentTimeInputValue.slice(0,2);
    const currentMinutes = +currentTimeInputValue.slice(3,5);

    if ( currentHours > desiredHours || 
        (currentHours === desiredHours && currentMinutes > desiredMinutes )) {
        dateTimeObj.setDate(dateTimeObj.getDate() + 1);
    }
    return dateTimeObj;
}
function actionPresetButton(event, dateTimeObj, dateInputValue, timeInputValue) {
    
    if (!dateInputValue) {
        dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    }
    dateDom.input.value = dateInputValue;
    
    if (!timeInputValue) {
        timeInputValue = Strings.getTimeStringInputFormat(dateTimeObj);
        timeInputValue = Strings.getTimeInputValueMinutesMultipleOf5(timeInputValue);
    }
    timeDom.input.value = timeInputValue;
    
    event.preventDefault();
    delete dateDom.input.dataset.default;
    delete timeDom.input.dataset.default;
    time.update(timeDom.input.value);
    snapElementsInClockBasedOnTimeObject(timeDom.dialog);
    if (!scheduleDiv.innerHTML) createDateTimeElements();
    setDateTimeSpansAndButtonsText();
}


function setDateTimeSpansAndButtonsText() {
    const timeString = Strings.getTimeStringForSpan(timeDom.input.value);
    timeDom.setButton.textContent = timeString;
    const timeSpan = document.querySelector('#time-span');
    timeSpan.textContent = timeString;
    
    const strings = Strings.getDateStringsForSpanAndButton(dateDom.input.value);
    dateDom.setButton.textContent = strings.dateForButton;
    const dateSpan = document.querySelector('#date-span');
    dateSpan.textContent = strings.dateForSpan;
}
function createDateTimeElements() {
    const dateSpan = document.createElement('span');
    scheduleDiv.appendChild(dateSpan);
    dateSpan.id = 'date-span';
    
    scheduleDiv.innerHTML += ', ';

    const timeSpan = document.createElement('span');
    scheduleDiv.appendChild(timeSpan);
    timeSpan.id = 'time-span';
    
    const deleteButton = document.createElement('button');
    scheduleDiv.appendChild(deleteButton);
    deleteButton.id = 'delete-date-time';
    deleteButton.classList.add('circle');
    deleteButton.innerHTML = '&#10060;';
    deleteButton.addEventListener('click', resetDateAndTime);
}
/////////
function resetDateAndTime() {
    scheduleDiv.innerHTML = '';
    dateDom.setButton.textContent = 'Set date';
    timeDom.setButton.textContent = 'Set time';
    setDefaultDateForInput(); setDefaultTimeForInput();
}

const oneHourFromNowButton = document.querySelector('#one-hour-from-now');
oneHourFromNowButton.addEventListener('click', (event) => {
    const now = new Date();    
    const oneHourFromNow = now.setHours(now.getHours() + 1);
    actionPresetButton(event, oneHourFromNow);
});
const sevenAMButton = document.querySelector('#seven-am');
sevenAMButton.addEventListener('click', (event) => {
    const timeInputValue = '07:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});
const tenPMButton = document.querySelector('#ten-pm');
tenPMButton.addEventListener('click', (event) => {
    const timeInputValue = '22:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});
const threePMButton = document.querySelector('#three-pm');
threePMButton.addEventListener('click', (event) => {
    const timeInputValue = '15:00';
    const dateTimeObj = getDateObjCorrectedDay(timeInputValue);
    const dateInputValue = Strings.getDateStringInputFormat(dateTimeObj);
    actionPresetButton(event, undefined, dateInputValue, timeInputValue);
});


export { 
    setDefaultDateForInput, 
    setDefaultTimeForInput,
    resetDateAndTime, 
    scheduleDiv,
    dateDom,
    timeDom,
}