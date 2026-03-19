const timeInput = document.querySelector('#time-dialog input');

const time = {
    hoursBase12: undefined,
    minutes: undefined,
    meridian: undefined,
    getTimeForInput() {
        let hoursBase24 = this.hoursBase12; 
        if (this.meridian === 'AM') {
            hoursBase24 = +this.hoursBase12;
            if (hoursBase24 === 12) hoursBase24 = 0;
        } else if (this.meridian === 'PM') {
            hoursBase24 = +this.hoursBase12 + 12;
            if (hoursBase24 === 24) hoursBase24 = 12;
        }
        const hoursString = ('0' + hoursBase24).slice(-2);
        const minutesString = ('0' + this.minutes).slice(-2);
        return `${hoursString}:${minutesString}`;
    },
    update(timeInput) {
        const inputHours = +timeInput.value.slice(0,2);
        if (inputHours === 0) {this.hoursBase12 = 12} else {
            this.hoursBase12 = inputHours > 12 ? inputHours - 12 : inputHours;
        }
        this.minutes = +timeInput.value.slice(3,5);
        this.meridian = inputHours >= 12 ? 'PM' : 'AM';
    }
};

const clockDiv = document.createElement('div');
timeInput.after(clockDiv);
clockDiv.id = 'clock';
clockDiv.ariaHidden = true;

const hoursUl = document.createElement('ul');
clockDiv.appendChild(hoursUl);
hoursUl.id = 'hours';
for (let i = 11; i <= 12; i++) {
    const hourLi = document.createElement('li');
    hoursUl.appendChild(hourLi);
    hourLi.textContent = i;
}
for (let i = 1; i <= 12; i++)  {
    const hourLi = document.createElement('li');
    hoursUl.appendChild(hourLi);
    hourLi.textContent = i;
    hourLi.dataset.value = i;
}
for (let i = 1; i <= 2; i++) {
    const hourLi = document.createElement('li');
    hoursUl.appendChild(hourLi);
    hourLi.textContent = i;
}
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
    time.hoursBase12 = hoursBase12;
    const timeForInput = time.getTimeForInput();
    timeInput.value = timeForInput;
}

const colonDiv = document.createElement('div');
clockDiv.appendChild(colonDiv);
colonDiv.textContent = ':';

const minutesUl = document.createElement('ul');
clockDiv.appendChild(minutesUl);
minutesUl.id = 'minutes';
for (let i = 50; i <= 55; i += 5)  {
    const minuteLi = document.createElement('li');
    minutesUl.appendChild(minuteLi);
    minuteLi.textContent = ('0' + i).slice(-2);
}
for (let i = 0; i <= 55; i += 5)  {
    const minuteLi = document.createElement('li');
    minutesUl.appendChild(minuteLi);
    minuteLi.textContent = ('0' + i).slice(-2);
    minuteLi.dataset.value = ('0' + i).slice(-2);
}
for (let i = 0; i <= 5; i += 5)  {
    const minuteLi = document.createElement('li');
    minutesUl.appendChild(minuteLi);
    minuteLi.textContent = ('0' + i).slice(-2);
}
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
    time.minutes = minutes;
    const timeForInput = time.getTimeForInput();
    timeInput.value = timeForInput;
}


const meridiesUl = document.createElement('ul');
clockDiv.appendChild(meridiesUl);
meridiesUl.id = 'meridies';
    const AMLi = document.createElement('li');
    meridiesUl.appendChild(AMLi);
    AMLi.textContent = 'AM';
    const PMLi = document.createElement('li');
    meridiesUl.appendChild(PMLi);
    PMLi.textContent = 'PM';
meridiesUl.addEventListener('scrollsnapchanging', setMeridiesForInput);
function setMeridiesForInput(event) {
    const meridian = event.snapTargetBlock.textContent;
    time.meridian = meridian;
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

export { time, snapElementsInClockBasedOnTimeObject }