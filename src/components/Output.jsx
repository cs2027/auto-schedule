import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import { capitalize, orderCourses, ltTime, tenMinGap, timeToNum } from '../Globals';

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
            schedulesFinal: [], // Recommended course schedules based on user inputs
            inProgress: true, // Whether or not schedules are still being computed
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
    };

    // Forcefully update the `schedulesFinal` state variable + re-render screen
    componentDidMount() {
        let schedulesFinal = this.buildSchedules();
        this.setState({ schedulesFinal });
        this.forceUpdate();
    }

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
                            overlaps['springOverlaps']];
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

        // (Def. 1) Permutation = a mapping of courses to quarters
        // Take all possible course schedules (permutations) ...
        // ... and filter them based on multiple constraints 
        let permutations = this.permuteCourses(this.state.courses.length, 3) // Def. 1 (see above)
                                .filter(p => 
                                    this.freqTest(p, 0, 5) // <=5 courses/quarter
                                    && this.freqTest(p, 1, 5) 
                                    && this.freqTest(p, 2, 5)
                                    && this.availableTest(p) // Check course is available in its assigned quarter
                                    && this.seqTest(p, seqConstraints) // Year-long sequences
                                    && this.prereqTest(p, prereqConstraints) // Pre-reqs
                                    && this.coreqTest(p, coreqConstraints)); // Co-reqs
        
        // Filter down further if necessary 
        if (this.state.maxFour) { // Enforce max of 4 courses/quarter
            permutations = permutations.filter(p => this.freqTest(p, 0, 4) 
                                    && this.freqTest(p, 1, 4) 
                                    && this.freqTest(p, 2, 4));
        };

        if (this.state.balance) { // Enforce a balanced schedule (equal # of courses per quarter)
            permutations = permutations.filter(p => this.balanceTest(p, this.state.courses.length));
        };


        // Compute scores for each permutation, based on course timing prefs
        let scores = this.computeScores(permutations);

        /*
        For each permutation, do the following:
        (1) Determine the number of lecture & discussion sections for each course
        (2) Compute all possible combinations of these^^ sections & filter based on 
        if there are any time overlaps or not
        (3) Add valid schedules to the unparsed list, along with their score (see above)
        */
        let schedulesUnparsed = [];
        for (let i = 0; i < permutations.length; i++) {
            let numSections = this.numSections(permutations[i]); // (1)

            // (2)
            let schedules = this.computeSchedules(permutations[i], numSections, permutations[i].length - 1) // (2)
                                .filter(schedule => this.validSchedule(schedule, overlaps));
            
            for (let j = 0; j < schedules.length; j++) {
                schedulesUnparsed.push({'schedule': schedules[j], 'score': scores[i]}); // (3)
            }
        };

        // Sort the schedules in descending score order + only keep best 5 scores
        schedulesUnparsed.sort(function(s1, s2) { return s2.score - s1.score; });
        if (schedulesUnparsed.length > 5) {
            schedulesUnparsed = schedulesUnparsed.slice(0, 5);
        }

        /*
         `schedulesFinal` will be a list of parsed schedules, where each schedule
         is of the following form:
            {
                "fall": {
                    "CS 336": {...},
                    "CS 348": {...}
                }, 
                "winter": {
                    "CS 321": {...},
                    "CS 308": {...}
                },
                "spring": {
                    "CS 339": {...},
                    "CS 337"
                }
            }
        */

        let schedulesFinal = [];

        // Loop over each unparsed schedule...
        for (let i = 0; i < schedulesUnparsed.length; i++) {
            let scheduleFinal = {
                "fall": {},
                "winter": {},
                "spring": {}
            }
            let scheduleUnparsed = schedulesUnparsed[i].schedule;

            /*
                For each unparsed schedule, access all of its course mapping
                i.e. take "CS 336" in the fall, "CS 321" in the winter, etc.)
                and do the following...
                    (1) Obtain the relevant course data from the state `courses` variable
                    (2) Determine the lecture & disc. times and dates based on the schedule
                    (3) Create a parsed schedule of the aforementioned form
                    (4) Add it to the `schedulesFinal` variable
            */
            for (let j = 0; j < scheduleUnparsed.length; j++) {
                
                // (1)
                let courseSchedule = scheduleUnparsed[j];
                let courseData = this.state.courses[j];
                let quarter = courseSchedule.quarter;
                let lecIndex = courseSchedule.lecIndex;
                let discIndex = courseSchedule.discIndex;
                let title = courseData.title;

                let courseScheduleFinal = {};
                let courseLecData = courseData["lecTimes"][quarter];
                let courseDiscData = courseData["discTimes"][quarter];

                // (2)
                if (lecIndex != null) {
                    courseScheduleFinal["lecDow"] = courseLecData[lecIndex]["dow"];
                    courseScheduleFinal["lecStart"] = courseLecData[lecIndex]["start"];
                    courseScheduleFinal["lecEnd"] = courseLecData[lecIndex]["end"];
                } else {
                    courseScheduleFinal["lecDow"] = null;
                    courseScheduleFinal["lecStart"] = null;
                    courseScheduleFinal["lecEnd"] = null;
                }

                if (discIndex != null) {
                    courseScheduleFinal["discDow"] = courseDiscData[discIndex]["dow"];
                    courseScheduleFinal["discStart"] = courseDiscData[discIndex]["start"];
                    courseScheduleFinal["discEnd"] = courseDiscData[discIndex]["end"];
                } else {
                    courseScheduleFinal["discDow"] = null;
                    courseScheduleFinal["discStart"] = null;
                    courseScheduleFinal["discEnd"] = null;
                }

                // (3)
                scheduleFinal[quarter][title] = courseScheduleFinal;
            }

            // (4)
            schedulesFinal.push(scheduleFinal);
        }

        return schedulesFinal;
    };

    /////////////////////////////////////////////
    /// Helpers for Computing Final Schedules ///
    /////////////////////////////////////////////


    // Determines if a given schedule^^ is valid or not
    // ^^schedule = a mapping of courses to quarters, along with 
    // specifying lecture & discussion sections
    validSchedule = (schedule, overlaps) => {
        let [fallOverlaps, 
            winterOverlaps, 
            springOverlaps] = [overlaps['fallOverlaps'],
                            overlaps['winterOverlaps'], 
                            overlaps['springOverlaps']];

        for (let i = 0; i < schedule.length; i++) {
            if (schedule[i].quarter === "fall") {
                if (this.hasConflict(schedule, fallOverlaps[i], i, "fall")) {
                    return false;
                }
            } else if (schedule[i].quarter === "winter") {
                if (this.hasConflict(schedule, winterOverlaps[i], i, "winter")) {
                    return false;
                }
            } if (schedule[i].quarter === "spring") {
                if (this.hasConflict(schedule, springOverlaps[i], i, "spring")) {
                    return false;
                }
            }
        };

        return true;
    };

    // Looks up any potential timing conflicts for a given schedule
    hasConflict = (schedule, conflicts, currentIndex, quarter) => {
        if (conflicts.length === 0) {
            return false;
        } else {
            for (let j = 0; j < conflicts.length; j++) {
                let courseIndex1 = this.findIndex(conflicts[j].courseId1);
                let courseIndex2 = this.findIndex(conflicts[j].courseId2);
                let courseIndex = -1;
                let sectionType = "";
                let sectionIndex = -1;

                if (courseIndex1 === currentIndex) {
                    courseIndex = courseIndex2;
                    sectionType = conflicts[j].type2;
                    sectionIndex = conflicts[j].index2;
                } else {
                    courseIndex = courseIndex1;
                    sectionType = conflicts[j].type1;
                    sectionIndex = conflicts[j].index1;
                }

                let otherSection = schedule[courseIndex];

                if (otherSection.quarter === quarter) {
                    if (sectionType === "lec" && otherSection.lecIndex === sectionIndex) {
                        return true;
                    } else if (sectionType === "disc" && otherSection.discIndex === sectionIndex) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Based on the number of lecture & discussion section available for each course,
    // recursively compute all possible combinations of different sections
    computeSchedules = (permutation, numSections, index) => {
        let result = [];
        let quarter = numSections[index].quarter;
        let numLec = numSections[index].numLec;
        let numDisc = numSections[index].numDisc;

        if (index === 0) {
            if (numDisc === 0) {
                for (let i = 0; i < numLec; i++) {
                    result.push([{'quarter': quarter, 'lecIndex': i, 'discIndex': null}]);
                };
            } else {
                for (let i = 0; i < numLec; i++) {
                    for (let j = 0; j < numDisc; j++) {
                        result.push([{'quarter': quarter, 'lecIndex': i, 'discIndex': j}]);
                    }
                };
            }
        } else {
            let prev = this.computeSchedules(permutation, numSections, index - 1);
            
            for (let i = 0; i < prev.length; i++) {
                if (numDisc === 0) {
                    for (let j = 0; j < numLec; j++) {
                        let subResult = [...prev[i]];
                        subResult.push({'quarter': quarter, 'lecIndex': j, 'discIndex': null});
                        result.push(subResult);
                    };
                } else {
                    for (let j = 0; j < numLec; j++) {
                        for (let k = 0; k < numDisc; k++) {
                            let subResult = [...prev[i]];
                            subResult.push({'quarter': quarter, 'lecIndex': j, 'discIndex': k});
                            result.push(subResult);
                        }
                    };
                }
            };
        }

        return result;
    };
    
    // Determine the number of lecture & discussion sections 
    // for each course in a given permutation
    numSections = (permutation) => {
        let result = [];
        let courses = [...this.state.courses];

        for (let i = 0; i < permutation.length; i++) {
            if (permutation[i] === 0) {
                let quarter = 'fall';
                let numLec = courses[i].lecTimes['fall'].length;
                let numDisc = 0;

                if (courses[i].disc['fall']) {
                    if (! (courses[i].discTimes['fall'][0].start[0] === -1)) {
                        numDisc = courses[i].discTimes['fall'].length;
                    };
                };

                result.push({'quarter': quarter, 'numLec': numLec, 'numDisc': numDisc});
            } else if (permutation[i] === 1) {
                let quarter = 'winter';
                let numLec = courses[i].lecTimes['winter'].length;
                let numDisc = 0;

                if (courses[i].disc['winter']) {
                    if (! (courses[i].discTimes['winter'][0].start[0] === -1)) {
                        numDisc = courses[i].discTimes['winter'].length;
                    };
                };

                result.push({'quarter': quarter, 'numLec': numLec, 'numDisc': numDisc});
            } else {
                let quarter = 'spring';
                let numLec = courses[i].lecTimes['spring'].length;
                let numDisc = 0;

                if (courses[i].disc['spring']) {
                    if (! (courses[i].discTimes['spring'][0].start[0] === -1)) {
                        numDisc = courses[i].discTimes['spring'].length;
                    };
                };

                result.push({'quarter': quarter, 'numLec': numLec, 'numDisc': numDisc});
            }
        };

        return result;
    };

    // Compute scores for a given preference, based on course timing preferences
    computeScores = (permutations) => {
        let courses = [...this.state.courses];
        let numCourses = courses.length;
        let numPerms = permutations.length;

        let scores = new Array(numPerms);
        for (let i = 0; i < numPerms; i++) {
            let currentScore = 0;
            let perm = permutations[i];

            for (let j = 0; j < numCourses; j++) {
                if (courses[j].pref === "") {
                    continue;
                } else if (perm[j] === 0 && courses[j].pref === "fall") {
                    currentScore = currentScore + 1;
                } else if (perm[j] === 1 && courses[j].pref === "winter") {
                    currentScore = currentScore + 1;
                } else if (perm[j] === 2 && courses[j].pref === "spring") {
                    currentScore = currentScore + 1;
                } else {
                    continue;
                }
            };

            scores[i] = currentScore;
        };

        return scores;
    };


    ////////////////////////////////////////////
    /// Helpers for Filtering Permutations^^ ///
    ////////////////////////////////////////////


    // ^^ permutation = a mapping of courses to quarters,
    // w/o considering specific lecture & discussion sections

    // Recursively generate all possible n-bit sequences, ...
    // ... where each value is between 0 and 'limit'
    permuteCourses = (n, limit) => {
        let result = [];

        if (n === 1) {
            for (let i = 0; i < limit; i++) {
                result.push([i]);
            };
        } else {
            let prev = this.permuteCourses(n - 1, limit);

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


    // Ensure that courses are available for a given permutation,
    // i.e. a 'fall' course is actually available in the fall
    availableTest = (arr) => {
        let courses = [...this.state.courses];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                if (! (courses[i].available['fall'])) {
                    return false;
                }
            } else if (arr[i] === 1) {
                if (! (courses[i].available['winter'])) {
                    return false;
                }
            } else {
                if (! (courses[i].available['spring'])) {
                    return false;
                }
            }
        };

        return true;
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
        let tenMinGapState = this.state.tenMinGap;

        if (tenMinGapState) {
            if (tenMinGap(period1.end, period2.start) ||
                tenMinGap(period2.end, period1.start)) {
                return false;
            } else {
                return true;
            }
        } else {
            if (ltTime(period1.end, period2.start) ||
                ltTime(period2.end, period1.start)) {
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


    /////////////////////////////////////////////////
    /// Helpers for rendering schedules on screen ///
    ////////////////////////////////////////////////

    // Parse course schedule data for one quarter (fall, winter, spring)
    parseQuarterCourses = (courseData) => {
        let coursesParsed = [];

        for (const [key, value] of Object.entries(courseData)) {
            let courseDetails = ["", "", ""];
            courseDetails[0] += key;

            if (value["lecStart"] != null) {
                courseDetails[1] += "Lecture = ";
                courseDetails[1] += `${value["lecStart"][0]}:`;

                value["lecStart"][1] < 10 ? 
                courseDetails[1] += `0${value["lecStart"][1]}` 
                : courseDetails[1] += `${value["lecStart"][1]}`;

                value["lecStart"][2] === 0? courseDetails[1] += "AM" : courseDetails[1] += "PM";
                courseDetails[1] += " to ";
                courseDetails[1] += `${value["lecEnd"][0]}:`;

                value["lecEnd"][1] < 10 ? 
                courseDetails[1] += `0${value["lecEnd"][1]}` 
                : courseDetails[1] += `${value["lecEnd"][1]}`;

                value["lecEnd"][2] === 0? courseDetails[1] += "AM" : courseDetails[1] += "PM";
                courseDetails[1] += ", ";
                
                if (value["lecDow"][0] === 1) {
                    courseDetails[1] += "M"
                } 
                
                if (value["lecDow"][1] === 1) {
                    courseDetails[1] += "Tu"
                } 
                
                if (value["lecDow"][2] === 1) {
                    courseDetails[1] += "W"
                } 
                
                if (value["lecDow"][3] === 1) {
                    courseDetails[1] += "Th"
                }
                
                if (value["lecDow"][4] === 1) {
                    courseDetails[1] += "F"
                }
            }

            if (value["discStart"] != null) {
                courseDetails[2] += "Discussion = ";
                courseDetails[2] += `${value["discStart"][0]}:`;

                value["discStart"][1] < 10 
                ? courseDetails[2] += `0${value["discStart"][1]}` 
                : courseDetails[2] += `${value["discStart"][1]}`;

                value["discStart"][2] === 0? courseDetails[2] += "AM" : courseDetails[2] += "PM";
                courseDetails[2] += " to ";
                courseDetails[2] += `${value["discEnd"][0]}:`;

                value["discEnd"][1] < 10 ? 
                courseDetails[2] += `0${value["discEnd"][1]}` 
                : courseDetails[2] += `${value["discEnd"][1]}`;

                value["discEnd"][2] === 0? courseDetails[2] += "AM" : courseDetails[2] += "PM";
                courseDetails[2] += ", ";
                
                if (value["discDow"][0] === 1) {
                    courseDetails[2] += "M"
                } 
                
                if (value["discDow"][1] === 1) {
                    courseDetails[2] += "Tu"
                } 
                
                if (value["discDow"][2] === 1) {
                    courseDetails[2] += "W"
                } 
                
                if (value["discDow"][3] === 1) {
                    courseDetails[2] += "Th"
                } 
                
                if (value["discDow"][4] === 1) {
                    courseDetails[2] += "F"
                }
            }

            coursesParsed.push(courseDetails);
        }

        // Sort courses from earliest to latest (both time and day of week)
        coursesParsed.sort(function(course1, course2) { 
            return orderCourses(course1, course2) 
        });
        return coursesParsed
    }

    /////////////////////
    /// Render method ///
    /////////////////////

    render() { 
        return (  
            <React.Fragment>
                {this.state.schedulesFinal.map((schedule, scheduleIndex) => ( 
                    <React.Fragment>
                    <div key={scheduleIndex} className="form-row">
                        {this.state.quarters.map((quarter, qIndex) => (
                            <div key={qIndex} className="form-group col-md-4">
                                <h4>{capitalize(quarter)}</h4>
                                {this.parseQuarterCourses(schedule[quarter]).map((course, courseIndex) => (
                                    <ul>
                                        <li>{course[0]}</li>
                                        <ul>
                                            {course[1] !== "" 
                                            ?
                                            <li>{course[1]}</li>
                                            :
                                            <li>No lecture</li>
                                            }
                                            {course[2] !== "" 
                                            ?
                                            <li>{course[2]}</li>
                                            :
                                            <li>No discussion</li>
                                            }
                                        </ul>
                                    </ul>
                                ))}
                            </div>
                        ))}
                    </div>
                    <hr className="hr" />
                    </React.Fragment>
                ))}
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