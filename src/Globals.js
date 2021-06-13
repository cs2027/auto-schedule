// Miscellaneous helper functions used throughout the app

// Capitalizes a word (1st letter becomes uppercase)
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

///////////////////////////////////////////////////
/// Helpers for time computations + comparisons ///
///////////////////////////////////////////////////

 // Compare the (lecture) start times of two courses
 // Break ties based on days of week of courses, if needed
 export const orderCourses = (course1, course2) => {
    let lecStart1 = course1[1].split(" ")[2];
    let lecParsed1 = lecStart1.split(":");
    let lecHour1 = parseInt(lecParsed1[0]);
    let lecMinute1 = parseInt(lecParsed1[1].substring(0, 2));
    let lecSuffix1 = lecParsed1[1].substring(2, 4);

    if (lecSuffix1 === "AM") {
        lecSuffix1 = 0;
    } else {
        lecSuffix1 = 1;
    }

    let lecStart2 = course2[1].split(" ")[2];
    let lecParsed2 = lecStart2.split(":");
    let lecHour2 = parseInt(lecParsed2[0]);
    let lecMinute2 = parseInt(lecParsed2[1].substring(0, 2));
    let lecSuffix2 = lecParsed2[1].substring(2, 4);

    if (lecSuffix2 === "AM") {
        lecSuffix2 = 0;
    } else {
        lecSuffix2 = 1;
    }

    let lecTime1 = timeToNum([lecHour1, lecMinute1, lecSuffix1]);
    let lecTime2 = timeToNum([lecHour2, lecMinute2, lecSuffix2]);

    if (lecTime1 === lecTime2) {
        let firstDow1 = course1[1].split(" ")[5].split(/(?=[A-Z])/)[0];
        let firstDow2 = course2[1].split(" ")[5].split(/(?=[A-Z])/)[0];

        switch(firstDow1) {
            case "M":
                firstDow1 = 0;
                break;
            case "Tu":
                firstDow1 = 1;
                break;
            case "W":
                firstDow1 = 2;
                break;
            case "Th":
                firstDow1 = 3;
                break;
            case "F":
                firstDow1 = 4;
                break;
            default:
                firstDow1 = 5;
        }

        switch(firstDow2) {
            case "M":
                firstDow2 = 0;
                break;
            case "Tu":
                firstDow2 = 1;
                break;
            case "W":
                firstDow2 = 2;
                break;
            case "Th":
                firstDow2 = 3;
                break;
            case "F":
                firstDow2 = 4;
                break;
            default:
                firstDow2 = 5;
        }

        return firstDow1 - firstDow2;
    } else {
        return lecTime1 - lecTime2;
    }
}

// Determine if 'time1' comes before 'time2'
export const ltTime = (time1, time2) => {
    return timeToNum(time2) >= timeToNum(time1);
};

// Determine if there are at least 10 mins between 'time1' and 'time2'
export const tenMinGap = (time1, time2) => {
    return timeToNum(time2) - timeToNum(time1) >= 10;
};

// Convert a time object to a numerical value (# of mins past midnight)
export const timeToNum = (time) => {
    if (time[2] === 0) {
        if (time[0] !== 12) {
            return time[0] * 60 + time[1];
        } else {
            return time[1];
        }
    } else {
        if (time[0] !== 12) {
            return time[0] * 60 + time[1] + 720;
        } else {
            return time[1] + 720;
        }
    }
};

