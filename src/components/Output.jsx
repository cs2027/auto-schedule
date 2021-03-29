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
            tenMinGap: props.tenMinGap,
            maxFour: props.maxFour,
            balance: props.balance,
            quarters: ["fall", "winter", "spring"],
            dows: ["M", "Tu", "W", "Th", "F"],
            overlaps: [] // Field to hold course overlaps
        };
    };

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

    // Parse course objects into readable times
    parsePeriod = (period) => {
        let start = period.start;
        let end = period.end;

        let startTime = `${start[0]}:${start[1]} ${start[2] === 0 ? " AM" : " PM"}`;
        let endTime = `${end[0]}:${end[1]} ${end[2] === 0 ? " AM" : " PM"}`;
        return `(Start: ${startTime}, End: ${endTime})`;
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

    // Determine all overlaps between the various courses
    computeAllOverlaps = () => {
        let overlapsRaw = [] // Holds course overlaps
        let numCourses = this.state.courses.length;

        // Loop over all pairs of possible course combos
        for (let i = 0; i < numCourses; i++) {
            for (let j = i + 1; j < numCourses; j++) {
                for (let k = 0; k < 3; k++) {
                    let course1 = this.state.courses[i];
                    let course2 = this.state.courses[j];
                    let quarter = this.state.quarters[k];

                    // Either course is unavailable -> no possible overlap
                    if (!(course1.available[quarter]) || !(course2.available[quarter])) {
                        continue;
                    };

                    let lecs1 = course1.lecTimes[quarter].length;
                    let lecs2 = course2.lecTimes[quarter].length;
                    let discs1 = course1.discTimes[quarter].length;
                    let discs2 = course2.discTimes[quarter].length;

                    // For each combo of lecture & disc. times, see if an overlap occurs
                    for (let w = 0; w < lecs1; w++) {
                        for (let x = 0; x < lecs2; x++) {
                            for (let y = 0; y < discs1; y++) {
                                for (let z = 0; z < discs2; z++) {
                                    overlapsRaw.push(this.courseOverlap(course1, course2, quarter, w, x, y, z));
                                }
                            }
                        }
                    };
                }
            }
        };

        // Update the internal state field 'overlaps'
        let overlaps = [].concat.apply([], overlapsRaw);
        this.setState({ overlaps });
    };

    // Helper function to determine overlap between two coursres
    courseOverlap = (course1, course2, quarter, lecIndex1, lecIndex2, discIndex1, discIndex2) => {
        const numDows = 5;
        let overlaps = [] // Holds course overlaps
        let c1Times = []; // Holds course times for 'course1' and 'course2'
        let c2Times = [];

        for (let i = 0; i < numDows; i++) {
            c1Times.push([]);
            c2Times.push([]);
        };

        // Add lecture times for both courses
        for (let i = 0; i < numDows; i++) {
            if (course1.lecTimes[quarter][lecIndex1].dow[i] === 1) {
                c1Times[i].push({start: course1.lecTimes[quarter][lecIndex1].start, 
                                end: course1.lecTimes[quarter][lecIndex1].end,
                                index: lecIndex1,
                                type: "lec"});
            };

            if (course2.lecTimes[quarter][lecIndex2].dow[i] === 1) {
                c2Times[i].push({start: course2.lecTimes[quarter][lecIndex2].start, 
                                end: course2.lecTimes[quarter][lecIndex2].end,
                                index: lecIndex2,
                                type: "lec"});
            };
        };

        // Add discussion times for both courses, if applicable
        if (course1.disc[quarter]) {
            for (let i = 0; i < numDows; i++) {
                if (course1.discTimes[quarter][discIndex1].dow[i] === 1) {
                    c1Times[i].push({start: course1.discTimes[quarter][discIndex1].start, 
                                    end: course1.discTimes[quarter][discIndex1].end,
                                    index: discIndex1, 
                                    type: "disc"});
                };
            };
        };

        if (course2.disc[quarter]) {
            for (let i = 0; i < numDows; i++) {
                if (course2.discTimes[quarter][discIndex2].dow[i] === 1) {
                    c2Times[i].push({start: course2.discTimes[quarter][discIndex2].start, 
                                    end: course2.discTimes[quarter][discIndex2].end,
                                    index: discIndex2, 
                                    type: "disc"});
                };
            };
        };

        // For each day of the week, see if the courses have any overlap 
        for (let i = 0; i < numDows; i++) {
            let periods1 = c1Times[i].length;
            let periods2 = c2Times[i].length;

            if (periods1 === 0 || periods2 === 0) {
                continue;
            } else {
                for (let j = 0; j < periods1; j++) {
                    for (let k = 0; k < periods2; k++) {
                        let time1 = c1Times[i][j];
                        let time2 = c2Times[i][k];

                        if (this.periodOverlap(time1, time2, this.state.tenMinGap)) {
                            overlaps.push({quarter: quarter, 
                                        courseId1: course1.id, type1: time1.type, index1: time1.index, 
                                        courseId2: course2.id, type2: time2.type, index2: time2.index});
                        }
                    }
                }
            };
        };

        // Return all course overlaps
        return overlaps;
    };

    // Determine if there is an overlap between two class periods
    periodOverlap = (period1, period2, tenMinGap) => {
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
                    <ul>
                    {this.state.overlaps.map((overlap, index) => ( 
                        <li key={index}>
                            {this.state.courses[this.findIndex(overlap.courseId1)].title}
                            {overlap.type1 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].lecTimes[overlap.quarter][overlap.index1])
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId1)].discTimes[overlap.quarter][overlap.index1])}, 
                            {this.state.courses[this.findIndex(overlap.courseId2)].title}
                            {overlap.type2 === "lec"
                            ? 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].lecTimes[overlap.quarter][overlap.index2])
                            : 
                            this.parsePeriod(this.state.courses[this.findIndex(overlap.courseId2)].discTimes[overlap.quarter][overlap.index2])}
                            ({overlap.quarter})
                        </li>
                    ))}
                    </ul>
                </div>
                <button onClick={this.sampleDataLg} className="btn btn-primary m-right-sm">Populate Sample Data (Large)</button>
                <button onClick={this.sampleDataSm} className="btn btn-primary m-right-sm">Populate Sample Data (Small)</button>
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