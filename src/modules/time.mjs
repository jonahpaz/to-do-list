const time = {
    hoursBase12: undefined,
    hoursBase24: undefined,
    minutes: undefined,
    meridian: undefined,
    getHoursBase12(hoursBase24) {
        let hoursBase12 = +hoursBase24;
        if (hoursBase12 === 0) hoursBase12 = 12;
        if (hoursBase12 > 12) hoursBase12 -= 12;
        return hoursBase12;
    },
    getHoursBase24(hoursBase12) {
        let hoursBase24 = +hoursBase12; 
        if (this.meridian === 'AM') {
            hoursBase24 = +this.hoursBase12;
            if (hoursBase24 === 12) hoursBase24 = 0;
        } else if (this.meridian === 'PM') {
            hoursBase24 = +this.hoursBase12 + 12;
            if (hoursBase24 === 24) hoursBase24 = 12;
        }
        return hoursBase24;
    },
    getTimeForInput() {
        const hoursString = ('0' + this.hoursBase24).slice(-2);
        const minutesString = ('0' + this.minutes).slice(-2);
        return `${hoursString}:${minutesString}`;
    },
    update(timeInputValue, snap) {
        if (snap) {
            if (snap.hoursBase12) {
                this.hoursBase12 = snap.hoursBase12;
                this.hoursBase24 = this.getHoursBase24(snap.hoursBase12);
            }
            else if (snap.hoursBase24) {
                this.hoursBase24 = snap.hoursBase24;
                this.hoursBase12 = this.getHoursBase12(snap.hoursBase24);
            }
            else if (snap.meridian) {
                this.meridian = snap.meridian;
                this.hoursBase24 = this.getHoursBase24(this.hoursBase12);
            }
            else if (snap.minutes) this.minutes = snap.minutes;

        } else if (timeInputValue) {
            const inputHours = +timeInputValue.slice(0,2);
            this.hoursBase24 = inputHours;
            if (inputHours === 0) {this.hoursBase12 = 12} else {
                this.hoursBase12 = inputHours > 12 ? inputHours - 12 : inputHours;
            }
            this.minutes = +timeInputValue.slice(3,5);
            this.meridian = inputHours >= 12 ? 'PM' : 'AM';
        }
    }
};

export { time }