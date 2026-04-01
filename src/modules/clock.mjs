import { time } from "./time.mjs";


const timeInput = document.querySelector('#time-dialog input');

// class Clock {
//     constructor(increment, meridian) {
//         this.minutesIncrement = this.getValidIncrement(increment);
//         this.meridian = meridian;
//         this.hoursUl = undefined;
//         this.minutesUl = undefined;
//         this.meridiesUl = undefined;
//         this.html = this.getHTML();
//     }
//     getValidIncrement(increment){
//         //It has to be a factor of 60
//     }
//     getHTML() {
//         if (this.html) return;

//         let preHours, startHours, endHours, postHours;
//         if (this.meridian) {
//             startHours = 1; endHours = 12; 
//             preHours = [11, 12]; postHours = [1, 2];
//         } else {
//             startHours = 0; endHours = 23;
//             preHours = [22, 23]; postHours = [0, 1];
//         }
//         const preMinutes = [-2*this.minutesIncrement, -this.minutesIncrement];
//         const postMinutes = [this.minutesIncrement, 2*this.minutesIncrement];

//         const data = {
//             preHours, startHours, endHours, postHours,
//             preMinutes, postMinutes,
//         }

//         const clockDiv = document.createElement('div');
//         timeInput.after(clockDiv);
//         clockDiv.classList.add('clock');
//         this.hoursUl = this.getHoursUl(data, time, timeInput);
//         this.minutesUl = this.getMinutesUl(data, time, timeInput);
//         this.meridiesUl = this.getMeridiesUl(time, timeInput);
//         clockDiv.appendChild(this.hoursUl);
//         clockDiv.appendChild(this.getColonLi());
//         clockDiv.appendChild(this.minutesUl);
//         if (this.meridiesUl) clockDiv.appendChild(this.meridiesUl);

//         return clockDiv;
//     }
//     getHoursUl(data, time, timeInput) {
//         const hoursUl = document.createElement('ul');
//         hoursUl.ariaLabel = 'hours';
//         function createHoursLi(hours, snappable) {
//             const hourLi = document.createElement('li');
//             hoursUl.appendChild(hourLi);
//             hourLi.textContent = hours;
//             if (snappable) hourLi.dataset.value = hours;
//         }
//         data.preHours.forEach(hours => createHoursLi(hours, false));
//         for (let i = data.startHours; i <= data.endHours; i++)  {
//             createHoursLi(i, true);
//         }
//         data.postHours.forEach(hours => createHoursLi(hours, false));
//         hoursUl.addEventListener('scrollsnapchanging', setHoursOfTimeInput);
//         function setHoursOfTimeInput(event) {
//             let hoursLi = event.snapTargetBlock;
//             if (!hoursLi.dataset.value) {
//                 const value = hoursLi.textContent;
//                 hoursLi = [...hoursUl.children].find(
//                     el => el.dataset.value === value
//                 );
//                 hoursLi.scrollIntoView({block: "center"});
//             }
//             const hoursBase12 = +hoursLi.textContent;
//             time.hoursBase12 = hoursBase12;
//             const timeForInput = time.getTimeForInput();
//             timeInput.value = timeForInput;
//         }
//         return hoursUl;
//     }
//     getMinutesUl(data, time, timeInput) {
//         const minutesUl = document.createElement('ul');
//         clockDiv.appendChild(minutesUl);
//         minutesUl.ariaLabel = 'minutes';
//         function createMinutesLi(minutes, snappable) {
//             const minuteLi = document.createElement('li');
//             minutesUl.appendChild(minuteLi);
//             minuteLi.textContent = ('0' + minutes).slice(-2);
//             if (snappable) minuteLi.dataset.value = ('0' + minutes).slice(-2);
//         }
//         data.preMinutes.forEach(minutes => createMinutesLi(minutes, false));
//         for (let i = 0; i < 60; i += this.minutesIncrement)  {
//             createMinutesLi(i, true);
//         }
//         data.postMinutes.forEach(minutes => createMinutesLi(minutes, false));
//         minutesUl.addEventListener('scrollsnapchanging', setMinutesOfTimeInput);
//         function setMinutesOfTimeInput(event) {
//             let minutesLi = event.snapTargetBlock;
//             if (!minutesLi.dataset.value) {
//                 const value = minutesLi.textContent;
//                 minutesLi = [...minutesUl.children].find(
//                     el => el.dataset.value === value
//                 );
//                 minutesLi.scrollIntoView({block: "center"});
//             }
//             const minutes = +minutesLi.textContent;
//             time.minutes = minutes;
//             const timeForInput = time.getTimeForInput();
//             timeInput.value = timeForInput;
//         }
//         return minutesUl;
//     }
//     getMeridiesUl(time, timeInput) {
//         const meridiesUl = document.createElement('ul');
//         meridiesUl.ariaLabel = 'meridian';
//         function createMeridianLi(meridian) {
//             const meridianLi = document.createElement('li');
//             meridiesUl.appendChild(meridianLi);
//             meridianLi.textContent = meridian;
//         }
//         createMeridianLi('AM');
//         createMeridianLi('PM');
//         meridiesUl.addEventListener('scrollsnapchanging', setMeridiesForInput);
//         function setMeridiesForInput(event) {
//             const meridian = event.snapTargetBlock.textContent;
//             time.meridian = meridian;
//             const timeForInput = time.getTimeForInput();
//             timeInput.value = timeForInput;
//         }
//         return meridiesUl;
//     }
//     getColonLi() {
//         const colonDiv = document.createElement('div');
//         colonDiv.textContent = ':';
//         return colonDiv;
//     }
//     snapElementsInClockBasedOnTimeObject(timeDialog) {
//         timeDialog.show();
//         const hoursLi = [...this.hoursUl.children].find(
//             el => +el.dataset.value === time.hoursBase12
//         );
//         hoursLi.scrollIntoView({block: "center"});
        
//         const minutesLi = [...this.minutesUl.children].find(
//             el => +el.dataset.value === time.minutes
//         );
//         minutesLi.scrollIntoView({block: "center"});
        
//         const meridianLi = [...this.meridiesUl.children].find(
//             el => el.textContent === time.meridian
//         );
//         meridianLi.scrollIntoView({block: "center"});
//         timeDialog.close();
//     }
// }


const clockDiv = document.createElement('div');
timeInput.after(clockDiv);
clockDiv.id = 'clock';

const hoursUl = document.createElement('ul');
clockDiv.appendChild(hoursUl);
hoursUl.ariaLabel = 'hours';
hoursUl.id = 'hours';
function createHoursLi(hours, snappable) {
    const hourLi = document.createElement('li');
    hoursUl.appendChild(hourLi);
    hourLi.textContent = hours;
    if (snappable) hourLi.dataset.value = hours;
}
const preHours = [11, 12];
preHours.forEach(hours => createHoursLi(hours, false));
for (let i = 1; i <= 12; i++)  {
    createHoursLi(i, true);
}
const postHours = [1, 2];
postHours.forEach(hours => createHoursLi(hours, false));
hoursUl.addEventListener('scrollsnapchanging', setHoursOfTimeInput);
function setHoursOfTimeInput(event) {
    let hoursLi = event.snapTargetBlock;
    if (!hoursLi.dataset.value) {
        const value = hoursLi.textContent;
        hoursLi = [...hoursUl.children].find(
            el => el.dataset.value === value
        );
        hoursLi.scrollIntoView({block: "center"});
    }
    const hoursBase12 = +hoursLi.textContent;
    time.update(undefined, { hoursBase12 });
    const timeForInput = time.getTimeForInput();
    timeInput.value = timeForInput;
}

const colonDiv = document.createElement('div');
clockDiv.appendChild(colonDiv);
colonDiv.textContent = ':';

const minutesUl = document.createElement('ul');
clockDiv.appendChild(minutesUl);
minutesUl.ariaLabel = 'minutes';
minutesUl.id = 'minutes';
function createMinutesLi(minutes, snappable) {
    const minuteLi = document.createElement('li');
    minutesUl.appendChild(minuteLi);
    minuteLi.textContent = ('0' + minutes).slice(-2);
    if (snappable) minuteLi.dataset.value = ('0' + minutes).slice(-2);
}
const preMinutes = [50, 55];
preMinutes.forEach(minutes => createMinutesLi(minutes, false));
for (let i = 0; i < 60; i += 5)  {
    createMinutesLi(i, true);
}
const postMinutes = [0, 5];
postMinutes.forEach(minutes => createMinutesLi(minutes, false));
minutesUl.addEventListener('scrollsnapchanging', setMinutesOfTimeInput);
function setMinutesOfTimeInput(event) {
    let minutesLi = event.snapTargetBlock;
    if (!minutesLi.dataset.value) {
        const value = minutesLi.textContent;
        minutesLi = [...minutesUl.children].find(
            el => el.dataset.value === value
        );
        minutesLi.scrollIntoView({block: "center"});
    }
    const minutes = +minutesLi.textContent;
    time.update(undefined, { minutes });
    const timeForInput = time.getTimeForInput();
    timeInput.value = timeForInput;
}


const meridiesUl = document.createElement('ul');
clockDiv.appendChild(meridiesUl);
meridiesUl.ariaLabel = 'meridian';
meridiesUl.id = 'meridies';
function createMeridianLi(meridian) {
    const meridianLi = document.createElement('li');
    meridiesUl.appendChild(meridianLi);
    meridianLi.textContent = meridian;
}
createMeridianLi('AM');
createMeridianLi('PM');
meridiesUl.addEventListener('scrollsnapchanging', setMeridiesForInput);
function setMeridiesForInput(event) {
    const meridian = event.snapTargetBlock.textContent;
    time.update(undefined, { meridian });
    const timeForInput = time.getTimeForInput();
    timeInput.value = timeForInput;
}

function snapElementsInClockBasedOnTimeObject(timeDialog) {
    timeDialog.show();
    const hoursLi = [...hoursUl.children].find(
        el => +el.dataset.value === time.hoursBase12
    );
    hoursLi.scrollIntoView({block: "center"});
    
    const minutesLi = [...minutesUl.children].find(
        el => +el.dataset.value === time.minutes
    );
    minutesLi.scrollIntoView({block: "center"});
    
    const meridianLi = [...meridiesUl.children].find(
        el => el.textContent === time.meridian
    );
    meridianLi.scrollIntoView({block: "center"});
    timeDialog.close();
}

export { snapElementsInClockBasedOnTimeObject }