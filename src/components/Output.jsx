import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

// Displays suggested course schedule(s)
class Output extends Component {


    ///////////////////
    /// Constructor ///
    ///////////////////


    // Initializes internal state using data from 'App' component
    constructor(props) {
        super(props);
        let numCourses = this.props.courses.length;
        let arr = (len) => {
            let arr = new Array(len);
            for (let i = 0; i < len; i++) {arr[i] = []};
            return arr;
        };

        this.state = {
            schedule: [], // Recommended course schedules based on user inputs
            currentId: props.currentId,
            courses: props.courses,
            tenMinGap: props.tenMinGap,
            maxFour: props.maxFour,
            balance: props.balance,
            quarters: ["fall", "winter", "spring"],
            dows: ["M", "Tu", "W", "Th", "F"],
            coursesParsed: [], // (1) Parses each lecture & disc. time for every course
            fallOverlaps: arr(numCourses), // (2) Course overlaps during each quarter
            winterOverlaps: arr(numCourses),
            springOverlaps: arr(numCourses),
            prefs: arr(numCourses), // Course timing preferences (i.e. which quarter is best?)
            prereqs: arr(numCourses), // Pre & co-reqs
            coreqs: arr(numCourses),  
            seqs: [] // Year-long sequences
        };

        this.buildSchedules();
    };

    /*
    (1) Parsed courses are of the following form:
    {
        courseId: course ID,
        quarter: fall/winter/spring,
        type: "lec" vs. "disc",
        index: index within the list of lecture/discussion sections
    }
    */

    /* 
    (2) Overlaps are of the following form:
    {
        courseId1: ID of 1st course, 
        type1: "lec" vs. "disc", 
        index1: index within the list of lecture/discussion sections for 1st course
        courseId2: ID of 2nd course, 
        type2: "lec" vs "disc", i
        index2: index within the list of lecture/discussion sections for 2nd course
    });
    */


    ////////////////////////////////////////
    /// Build suggested course schedules ///
    ////////////////////////////////////////


    // Main method that computes suggested course schedules per quarter
    buildSchedules = () => {
        this.computeAllOverlaps();
        this.computeConstraints();

        /* 
        Things to consider: 
            -Series
            -Preferences
            -Availability (both lectures & discussion sections)
            -Prereqs / coreqs
        */
    };


    ///////////////////////////////
    /// Compute course overlaps ///
    ///////////////////////////////


    // Determine all overlaps between the various courses
    computeAllOverlaps = () => {
        let fallOverlaps = [...this.state.fallOverlaps]; 
        let winterOverlaps = [...this.state.winterOverlaps];
        let springOverlaps = [...this.state.springOverlaps];
        let coursesParsed = this.parseCourses(); // Call to helper 'parseCourses()'
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
                    let index1 = this.findIndex(period1.courseId);
                    let index2 = this.findIndex(period2.courseId);

                    if (q1 === "fall") {
                        fallOverlaps[index1].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                                courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                        fallOverlaps[index2].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    } else if (q1 === "winter") {
                        winterOverlaps[index1].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                        winterOverlaps[index2].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    } else {
                        springOverlaps[index1].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                        springOverlaps[index2].push({courseId1: period1.courseId, type1: period1.type, index1: period1.index,
                            courseId2: period2.courseId, type2: period2.type, index2: period2.index});
                    }
                };
            };
        };

        // Update internal state
        console.log(fallOverlaps);
        console.log(springOverlaps);
        console.log(winterOverlaps);
        console.log('Course Overlaps Computed^^');
        this.setState({ fallOverlaps, winterOverlaps, springOverlaps });
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
        console.log(coursesParsed);
        console.log('Courses Parsed^^');
        this.setState({ coursesParsed });

        // Return the list of parsed courses for use in 'computeAllOverlaps()'
        // Cannot use internal state directly b/c 'setState()' is asynchronous
        return coursesParsed;
    };


    /////////////////////////////////////
    /// Parse other info:             ///
    ///     |___ timing preferences   ///
    ///     |___ pre/co-reqs          ///
    ///     |___ year-long sequences  ///
    /////////////////////////////////////


    // Determine course timing preferences, pre/co-reqs, year-long sequences
    computeConstraints = () => {
        this.findPrefs();
        this.findPrereqs();
        this.findCoreqs();
        this.findSeqs();
        console.log('Prefs, Pre/Co-Reqs, Sequences Computed^^');
    };

    // Determine all course timing preferences
    findPrefs = () => {
        let prefs = [...this.state.prefs];
        let courses = [...this.state.courses];

        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];

            if (course.pref === "") {
                continue;
            } else if (course.pref === "fall") {
                prefs[i].push({courseId: course.id, pref: "fall"});
            } else if (course.pref === "winter") {
                prefs[i].push({courseId: course.id, pref: "winter"});
            } else {
                prefs[i].push({courseId: course.id, pref: "spring"});
            }
        };

        console.log(prefs);
        this.setState({ prefs });
    };

    // Determine all course prereqs
    findPrereqs = () => {
        let prereqs = [...this.state.prereqs];
        let courses = [...this.state.courses];

        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];

            if (course.prereqs === null) {
                continue;
            } else {
                prereqs[i].push({courseId: course.id, prereqIds: course.prereqs});
            }
        };

        console.log(prereqs);
        this.setState({ prereqs });
    };

    // Determine all course co-reqs
    findCoreqs = () => {
        let coreqs = [...this.state.coreqs];
        let courses = [...this.state.courses];

        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];

            if (course.coreqs === null) {
                continue;
            } else {
                coreqs[i].push({courseId: course.id, coreqIds: course.coreqs});
            }
        };

        console.log(coreqs);
        this.setState({ coreqs });
    };

    // Determine all year-long course sequences
    findSeqs = () => {
        let seqs = [...this.state.seqs];
        let courses = [...this.state.courses];

        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];

            if (! (course.series)) {
                continue;
            } else {
                seqs.push({courseId: course.id, seriesIndex: course.seriesIndex});
            }
        };

        console.log(seqs);
        this.setState({ seqs });
    };


    //////////////////////////////////////////
    /// Helpers for 'computeAllOverlaps()' ///
    //////////////////////////////////////////


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

    // Find course index in internal list, based on its Id number
    findIndex = (courseId) => {
        let courses = [...this.state.courses];

        for (let i = Math.min(courseId - 1, courses.length - 1); i >= 0; i--) {
            if (courses[i].id === courseId) {
                return i;
            };
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


    /////////////////////
    /// Render method ///
    /////////////////////


    render() { 
        return (  
            <React.Fragment>
                <button onClick={() => this.props.onTransition("input", this.state.courses)} 
                        className="btn btn-warning m-bottom-sm m-top-sm">Edit Original Courses</button>
                <br />
                <button onClick={() => this.props.onTransition("preCoReq", this.state.courses)} 
                        className="btn btn-success">Edit Pre/Co-Requisites</button>
            </React.Fragment>
        );
    };
};
 
export default Output;