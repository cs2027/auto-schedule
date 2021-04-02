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
        // Parse course overlaps & other scheduling constraints
        let overlaps = this.computeAllOverlaps();
        let constraints = this.computeConstraints();
        let [fallOverlaps, 
            winterOverlaps, 
            springOverlaps] = [overlaps['fallOverlaps'],
                            overlaps['winterOverlaps'], 
                            overlaps['springOverlaps']]
        let [prefs, 
            prereqs, 
            coreqs, 
            seqs] = [constraints['prefs'], 
                    constraints['prereqs'], 
                    constraints['coreqs'], 
                    constraints['seqs']];

        // Constraints related to year-long course sequences
        let seqConstraints = [];
        for (let i = 0; i < seqs.length; i++) {
            let index = this.findIndex(seqs[i].courseId);
            let val = seqs[i].seriesIndex;

            seqConstraints.push({'index': index, 'val': val});
        };
 
        // Constraints related to prerequisites
        let prereqConstraints = [];
        for (let i = 0; i < prereqs.length; i++) {
            let prereqList = prereqs[i];

            if (prereqList.length !== 0) {
                let courseIndex = this.findIndex(prereqList[0].courseId);
                let prereqIds = prereqList[0].prereqIds;
                
                for (let j = 0; j < prereqIds.length; j++) {
                    let prereqIndex = this.findIndex(prereqIds[j]);
                    prereqConstraints.push({'courseIndex': courseIndex, 
                                        'prereqIndex': prereqIndex});
                }
            }
        };

        // Constraints related to co-requisites
        let coreqConstraints = [];
        for (let i = 0; i < coreqs.length; i++) {
            let coreqList = coreqs[i];

            if (coreqList.length !== 0) {
                let courseIndex = this.findIndex(coreqList[0].courseId);
                let coreqIds = coreqList[0].coreqIds;
                
                for (let j = 0; j < coreqIds.length; j++) {
                    let coreqIndex = this.findIndex(coreqIds[j]);
                    coreqConstraints.push({'courseIndex': courseIndex, 
                                        'coreqIndex': coreqIndex});
                }
            }
        };

        // Take all possible course schedules (permutations) ...
        // ... and filter them based on these^^ constraints
        let permutations = this.permute(this.state.courses.length, 3) 
                                .filter(p => 
                                    this.freqTest(p, 0, 5) 
                                    && this.freqTest(p, 1, 5) 
                                    && this.freqTest(p, 2, 5)
                                    && this.seqTest(p, seqConstraints)
                                    && this.prereqTest(p, prereqConstraints)
                                    && this.coreqTest(p, coreqConstraints));
        
        // Filter down further if necessary
        if (this.state.maxFour) {
            permutations = permutations.filter(p => this.freqTest(p, 0, 4) 
                                    && this.freqTest(p, 1, 4) 
                                    && this.freqTest(p, 2, 4));
        };

        if (this.state.balance) {
            permutations = permutations.filter(p => this.balanceTest(p, this.state.courses.length));
        };

        console.log(permutations);

        /* 
        Things to consider: 
            -Series (DONE)
            -Preferences
            -Availability, both lectures & discussion
            -Prereqs / coreqs (DONE)
        */
    };


    ////////////////////////////////////////////////
    /// Helper Functions for Filtering Schedules ///
    ////////////////////////////////////////////////


    // Recursively generate all possible n-bit sequences, ...
    // ... where each value is between 0 and 'limit'
    permute = (n, limit) => {
        let result = [];

        if (n === 1) {
            for (let i = 0; i < limit; i++) {
                result.push([i]);
            };
        } else {
            let prev = this.permute(n - 1, limit);

            for (let i = 0; i < prev.length; i++) {
                for (let j = 0; j < limit; j++) {
                    let subResult = [...prev[i]];
                    subResult.push(j);
                    result.push(subResult);
                }
            };
        }

        return result;
    };

    // Ensure a balanced schedule (~ equal # of courses each quarter)
    balanceTest = (arr, numCourses) => {
        let numZeros = 0;
        let numOnes = 0;
        let numTwos = 0;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                numZeros = numZeros + 1;
            } else if (arr[i] === 1) {
                numOnes = numOnes + 1;
            } else {
                numTwos = numTwos + 1;
            }
        };

        if (numCourses % 3 === 0) {
            return (numZeros === numOnes) && (numOnes === numTwos);
        } else {
            return Math.abs(numZeros - numOnes) <= 1 
                && Math.abs(numZeros - numTwos) <= 1 
                && Math.abs(numOnes - numTwos) <= 1;
        }
    };

    // Test that co-requisite requirements are met
    coreqTest = (arr, coreqConstraints) => {
        for (let i = 0; i < coreqConstraints.length; i++) {
            let constraint = coreqConstraints[i];

            if (arr[constraint.courseIndex] < arr[constraint.coreqIndex]) {
                return false;
            }
        };

        return true;
    };

    // Test that pre-requisite requirements are met
    prereqTest = (arr, prereqConstraints) => {
        for (let i = 0; i < prereqConstraints.length; i++) {
            let constraint = prereqConstraints[i];

            if (arr[constraint.courseIndex] <= arr[constraint.prereqIndex]) {
                return false;
            }
        };

        return true;
    };

    // Check that year-long sequences occur as needed
    seqTest = (arr, seqConstraints) => {
        for (let i = 0; i < seqConstraints.length; i++) {
            let constraint = seqConstraints[i];

            if (arr[constraint.index] !== constraint.val) {
                return false;
            }
        };

        return true;
    }

    // Check if a certain array element shows up too often
    freqTest = (arr, target, limit) => {
        let count = 0;

        for (let i = 0; i < arr.length; i++) {
            if (count > limit) {
                return false;
            } 

            if (arr[i] === target) {
                count = count + 1;
            }
        };

        return count <= limit;
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

        // Update internal state & return course overlaps (b/c 'setState' is asynchronous)
        this.setState({ fallOverlaps, winterOverlaps, springOverlaps });
        return {'fallOverlaps': fallOverlaps, 'winterOverlaps': winterOverlaps, 'springOverlaps': springOverlaps};
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

        // Update internal state & return parsed courses (b/c 'setState()' is asynchronous)
        this.setState({ coursesParsed });
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
        let prefs = this.findPrefs();
        let prereqs = this.findPrereqs();
        let coreqs = this.findCoreqs();
        let seqs = this.findSeqs();

        return {
            'prefs': prefs, 
            'prereqs': prereqs, 
            'coreqs': coreqs, 
            'seqs': seqs
        };
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

        this.setState({ prefs });
        return prefs;
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

        this.setState({ prereqs });
        return prereqs;
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

        this.setState({ coreqs });
        return coreqs;
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

        this.setState({ seqs });
        return seqs;
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