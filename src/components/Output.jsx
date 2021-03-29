import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

// Displays suggested course schedule
class Output extends Component {

    // Initializes internal state using data from 'App' component
    constructor(props) {
        super(props);
        this.state = {
            currentId: props.currentId,
            courses: props.courses,
            coursesParsed: props.coursesParsed,
            tenMinGap: props.tenMinGap,
            maxFour: props.maxFour,
            balance: props.balance,
            quarters: ["fall", "winter", "spring"],
            dows: ["M", "Tu", "W", "Th", "F"],
            fallOverlaps: [], // Course overlaps during each quarter (1)
            winterOverlaps: [],
            springOverlaps: []
        };
    };

    /* 
    (1) overlaps are of the following form:
    {
        courseId1: ID of 1st course, 
        type1: "lec" vs. "disc", 
        index1: index within the list of lecture/discussion sections for 1st course
        courseId2: ID of 2nd course, 
        type2: "lec" vs "disc", i
        index2: index within the list of lecture/discussion sections for 2nd course
    });
    */

    ////////////////////////////
    // Testing w/ Sample Data //
    ////////////////////////////

    sampleDataSm = () => {
        this.setState({
            currentId: 6,
            courses: courses_sm,
            tenMinGap: true,
            maxFour: true,
            balance: true
        });

        alert('Sample Data Added (Small)');
    };

    sampleDataLg = () => {
        this.setState({
            currentId: 13,
            courses: courses_lg,
            tenMinGap: true,
            maxFour: true,
            balance: true
        });

        alert('Sample Data Added (Large)');
    };

    // Parse period into a nice, readable format
    parsePeriod = (period, type) => {
        let start = period.start;
        let end = period.end;

        let startTime = `${start[0]}:${start[1] < 10 ? "0" + start[1] : start[1]} ${start[2] === 0 ? " AM" : " PM"}`;
        let endTime = `${end[0]}:${end[1] < 10 ? "0" + end[1] : end[1]} ${end[2] === 0 ? " AM" : " PM"}`;
        return ` (Start: ${startTime}, End: ${endTime}, Type: ${type})`;
    };

    ///////////////////////////
    // End Testing Functions //
    ///////////////////////////

    // Find course index in internal list, based on its Id number
    findIndex = (courseId) => {
        let courses = [...this.state.courses];

        for (let i = Math.min(courseId - 1, courses.length - 1); i >= 0; i--) {
            if (courses[i].id === courseId) {
                return i;
            };
        };
    };

    // Add each lecture & discussion section for every course as a distinct array entry
    parseCourses = () => {
        let coursesParsed = [...this.state.coursesParsed];

        // Loop over each course
        for (let i = 0; i < this.state.courses.length; i++) {
            let course = this.state.courses[i];

            for (let j = 0; j < this.state.quarters.length; j++) {
                let quarter = this.state.quarters[j];

                // Add each lecture for the current course
                if (course.available[quarter]) {
                    for (let k = 0; k < course.lecTimes[quarter].length; k++) {
                        coursesParsed.push({courseId: course.id, quarter: quarter, type: "lec", index: k});
                    };
                };

                // Add each dicussino section for the current course
                if (course.disc[quarter]) {
                    for (let l = 0; l < course.discTimes[quarter].length; l++) {
                        coursesParsed.push({courseId: course.id, quarter: quarter, type: "disc", index: l});
                    };
                };
            };
        };

        // Update internal state
        this.setState({ coursesParsed });
    };

    // Determine all overlaps between the various courses
    computeAllOverlaps = () => {
        let fallOverlaps = [...this.state.fallOverlaps]; 
        let winterOverlaps = [...this.state.winterOverlaps];
        let springOverlaps = [...this.state.springOverlaps];
        let coursesParsed = [...this.state.coursesParsed];
        let numPeriods = coursesParsed.length;

        // Loop over every possible lecture & discussion section
        for (let i = 0; i < numPeriods; i++) {
            for (let j = i + 1; j < numPeriods; j++) {
                let period1 = coursesParsed[i];
                let period2 = coursesParsed[j];
                let q1 = period1.quarter;
                let q2 = period2.quarter;

                // Do not need to consider overlaps within same course or for different quarters
                if (period1.courseId === period2.courseId || q1 !== q2) {
                    continue;
                };

                // Add course overlaps to the correct list, based on the quarter
                if (this.weeklyOverlap(period1, period2)) {
                    if (q1 === "fall") {
                        fallOverlaps.push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                                courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    } else if (q1 === "winter") {
                        winterOverlaps.push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    } else {
                        springOverlaps.push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    }
                };
            };
        };

        // Update internal state
        this.setState({ fallOverlaps, winterOverlaps, springOverlaps });
    };

    // Determine if there is any overlap between two course periods in a week
    weeklyOverlap = (period1, period2) => {
        const numDows = 5;
        let time1 = this.findPeriod(period1.courseId, period1.quarter, period1.type, period1.index);
        let time2 = this.findPeriod(period2.courseId, period2.quarter, period2.type, period2.index);

        for (let i = 0; i < numDows; i++) {
            if (time1.dow[i] === 0 || time2.dow[i] === 0) {
                continue;
            };

            if (this.periodOverlap(time1, time2)) {
                return true;
            };
        };

        return false;
    };

    // Determine if there is an overlap between two class periods
    periodOverlap = (period1, period2) => {
        let tenMinGap = this.state.tenMinGap;

        if (tenMinGap) {
            if (this.tenMinGap(period1.end, period2.start) ||
                this.tenMinGap(period2.end, period1.start)) {
                return false;
            } else {
                return true;
            }
        } else {
            if (this.ltTime(period1.end, period2.start) ||
                this.ltTime(period2.end, period1.start)) {
                    return false;
                } else {
                    return true;
                }
        };
    };

    // Look up information about a specific lecture/discussion section
    findPeriod = (courseId, quarter, type, index) => {
        return this.state.courses[this.findIndex(courseId)][type === "lec" ? "lecTimes" : "discTimes"][quarter][index];
    };

    // Determine if 'time1' comes before 'time2'
    ltTime = (time1, time2) => {
        return this.timeToNum(time2) >= this.timeToNum(time1);
    };

    // Determine if there are at least 10 mins between 'time1' and 'time2'
    tenMinGap = (time1, time2) => {
        return this.timeToNum(time2) - this.timeToNum(time1) >= 10;
    };

    // Convert a time object to a numerical value (# of mins past midnight)
    timeToNum = (time) => {
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

    render() { 
        return (  
            <React.Fragment>
                <div>
                    <h3>Fall Overlaps</h3>
                    <ul>
                    {this.state.fallOverlaps.map((overlap, index) => ( 
                        <li key={index}>
                            {this.state.courses[this.findIndex(overlap.courseId1)].title}
                            {overlap.type1 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].lecTimes["fall"][overlap.index1], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].discTimes["fall"][overlap.index1], "Disc.")}
                            {", "} 
                            {this.state.courses[this.findIndex(overlap.courseId2)].title}
                            {overlap.type2 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].lecTimes["fall"][overlap.index2], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].discTimes["fall"][overlap.index2], "Disc.")}
                        </li>
                    ))}
                    </ul>

                    <h3>Winter Overlaps</h3>
                    <ul>
                    {this.state.winterOverlaps.map((overlap, index) => ( 
                        <li key={index}>
                            {this.state.courses[this.findIndex(overlap.courseId1)].title}
                            {overlap.type1 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].lecTimes["winter"][overlap.index1], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].discTimes["winter"][overlap.index1], "Disc.")}
                            {", "}
                            {this.state.courses[this.findIndex(overlap.courseId2)].title}
                            {overlap.type2 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].lecTimes["winter"][overlap.index2], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].discTimes["winter"][overlap.index2], "Disc.")}
                        </li>
                    ))}
                    </ul>

                    <h3>Spring Overlaps</h3>
                    <ul>
                    {this.state.springOverlaps.map((overlap, index) => ( 
                        <li key={index}>
                            {this.state.courses[this.findIndex(overlap.courseId1)].title}
                            {overlap.type1 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].lecTimes["spring"][overlap.index1], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].discTimes["spring"][overlap.index1], "Disc.")}
                            {", "}
                            {this.state.courses[this.findIndex(overlap.courseId2)].title}
                            {overlap.type2 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].lecTimes["spring"][overlap.index2], "Lecture")
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].discTimes["spring"][overlap.index2], "Disc.")}
                        </li>
                    ))}
                    </ul>
                </div>
                <button onClick={this.sampleDataLg} className="btn btn-primary m-right-sm">Populate Sample Data (Large)</button>
                <button onClick={this.sampleDataSm} className="btn btn-primary m-right-sm">Populate Sample Data (Small)</button>
                <button onClick={this.parseCourses} className="btn btn-primary m-right-sm">Parse Course Data</button>
                <br />
                <button onClick={this.computeAllOverlaps} 
                        className="btn btn-primary m-bottom-sm m-top-sm">Compute Course Overlaps</button>
                <br />
                <button onClick={() => this.props.onTransition("input", this.state.courses)} 
                        className="btn btn-warning m-bottom-sm">Edit Original Courses</button>
                <br />
                <button onClick={() => this.props.onTransition("preCoReq", this.state.courses)} 
                        className="btn btn-success">Edit Pre/Co-Requisites</button>
            </React.Fragment>
        );
    };
};
 
export default Output;