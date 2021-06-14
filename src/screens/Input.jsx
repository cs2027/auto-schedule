import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import { capitalize, timeToNum } from '../Globals';

// Input data regarding classes over all 3 quarters
class Input extends Component {

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
            dows: ["M", "Tu", "W", "Th", "F"]
        };
    };

    ////////////////////////////////
    // Universal Helper Functions //
    ////////////////////////////////
  
    // Find course index in internal list, based on its Id number
    findIndex = (courseId) => {
      let courses = [...this.state.courses];
  
      for (let i = Math.min(courseId - 1, courses.length - 1); i >= 0; i--) {
        if (courses[i].id === courseId) {
          return i;
        };
      };
    };
  
    //////////////////////////
    // Add & remove courses //
    //////////////////////////
  
    // Add a new course 
    addCourse = () => {
      this.setState(oldState => ({
        currentId: oldState.currentId + 1,
        courses: [...oldState.courses, 
                  {
                    id: oldState.currentId, 
                    title: `Course ${oldState.currentId}`,
                    lecTimes: {
                      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                    },
                    discTimes: {
                      fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                      winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                      spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                    },
                    available: {
                      fall: true,
                      winter: true,
                      spring: true
                    },
                    disc: {
                      fall: true,
                      winter: true,
                      spring: true
                    },
                    series: false,
                    seriesIndex: 0, 
                    unique: false,
                    pref: "",
                    prereqs: null,
                    coreqs: null
                  }],
      }));
    };
  
    // Remove a specified course
    removeCourse = (courseId) => {
      this.setState(oldState => ({
        courses: oldState.courses.filter((course) => course.id !== courseId)
      }));
    };
  
    // Method to add year-long course sequences
    addSeries = () => {
      for (let i = 0; i < 3; i++) {
        this.addSeriesCourse(i);
      };
    };
  
    // Helper function for 'addSeries'^^
    addSeriesCourse = (index) => {
      if (index === 0) {
        this.setState(oldState => ({
          currentId: oldState.currentId + 1,
          courses: [...oldState.courses, 
                    {
                      id: oldState.currentId, 
                      title: `Course ${oldState.currentId}`,
                      lecTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      discTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      available: {
                        fall: true,
                        winter: false,
                        spring: false
                      },
                      disc: {
                        fall: true,
                        winter: false,
                        spring: false
                      },
                      series: true,
                      seriesIndex: 0,
                      unique: true,
                      pref: "",
                      prereqs: null,
                      coreqs: null
                    }],
        }));
      } else if (index === 1) {
        this.setState(oldState => ({
          currentId: oldState.currentId + 1,
          courses: [...oldState.courses, 
                    {
                      id: oldState.currentId, 
                      title: `Course ${oldState.currentId}`,
                      lecTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      discTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      available: {
                        fall: false,
                        winter: true,
                        spring: false
                      },
                      disc: {
                        fall: false,
                        winter: true,
                        spring: false
                      },
                      series: true,
                      seriesIndex: 1,
                      unique: true,
                      pref: "",
                      prereqs: null,
                      coreqs: null
                    }],
        }));
      } else {
        this.setState(oldState => ({
          currentId: oldState.currentId + 1,
          courses: [...oldState.courses, 
                    {
                      id: oldState.currentId, 
                      title: `Course ${oldState.currentId}`,
                      lecTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      discTimes: {
                        fall: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        winter: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}],
                        spring: [{start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]}]
                      },
                      available: {
                        fall: false,
                        winter: false,
                        spring: true
                      },
                      disc: {
                        fall: false,
                        winter: false,
                        spring: true
                      },
                      series: true,
                      seriesIndex: 2,
                      unique: true,
                      pref: "",
                      prereqs: null,
                      coreqs: null
                    }],
        }));
      }
    };

    // Clears all user input data
    clear = () => {
        if (this.state.courses.length === 0) {
            alert('There is no course data to clear.');
            return;
        };

        this.setState({
            currentId: 1,
            courses: [],
            tenMinGap: true,
            maxFour: true,
            balance: false,
            quarters: ["fall", "winter", "spring"],
            dows: ["M", "Tu", "W", "Th", "F"]
        });
    };
  
    /////////////////////////////////////
    // High-level algorithm specifiers //
    /////////////////////////////////////

    // Enforce a 10-min gap between classes
    tenMinGap = () => {
      let tenMinGap = !(this.state.tenMinGap);
      this.setState({ tenMinGap });
    }
  
    // Enforce maximum of 4 classes per quarter
    maxFour = () => {
      let maxFour = !(this.state.maxFour);
      this.setState({ maxFour });
    }
  
    // Try to balance equal # of classes per quarter (as close as possible)
    balance = () => {
      let balance = !(this.state.balance);
      this.setState({ balance });
    }
  
    //////////////////
    // Course title //
    //////////////////
  
    // Update course title
    changeTitle = ({target}) => {
      let index = this.findIndex(parseInt(target.id));
  
      let courses = [...this.state.courses];
      courses[index].title = target.value;
      this.setState({ courses });
    };
  

    ///////////////////////////////
    // Course timing preferences //
    ///////////////////////////////
  
    // Edit preferences regarding course timing (fa, wi, sp)
    changePref = ({target}) => {
      let courseId = parseInt(target.dataset.courseid);
      let value = target.value;
  
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
      courses[index].pref = value;
      this.setState({ courses });
    };
  
    /////////////////////////
    // Course availability //
    /////////////////////////
  
    // Update whether or not a course is available in a given quarter
    // Also update if a course is only offered in a single quarter
    changeAvail = (courseId, quarter) => {
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      let avail = courses[index].available[quarter];
      courses[index].available[quarter] = !(avail);

      let offerings = 0;
      for (let i = 0; i < this.state.quarters.length; i++) {
          if (courses[index].available[this.state.quarters[i]]) {
              offerings = offerings + 1;
          };
      };

      courses[index].unique = (offerings === 0 || offerings === 1);
      this.setState({ courses });
    };
   
    // Update whether or not a course has a disc. section for a given quarter
    changeDisc = (courseId, quarter) => {
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      let status = courses[index].disc[quarter];
      courses[index].disc[quarter] = !(status); 
      this.setState({ courses });
    };
  
    //////////////////////////
    // Update lecture times //
    //////////////////////////
  
    // Add a lecture time slot for a course (ex. 9am and 11am sections)
    addLecture = (courseId, quarter) => {
      let index = this.findIndex(courseId);
  
      let courses = [...this.state.courses];
      courses[index].lecTimes[quarter].push({start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]});
      this.setState({ courses });
    };
  
    // Remove a lecture time slot for a course
    removeLecture = (courseId, quarter) => {
      let index = this.findIndex(courseId);
  
      let courses = [...this.state.courses];
      if (courses[index].lecTimes[quarter].length === 1) {
        alert('Error: You are attempting to remove the only time slot.');
        return;
      };
  
      courses[index].lecTimes[quarter].pop();
      this.setState({ courses });
    };
  
    // Update days of week of a lecture time slot
    lecDow = (courseId, quarter, lecIndex, dayIndex) => {
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      let current = courses[index].lecTimes[quarter][lecIndex].dow[dayIndex];
      if (current === 0) {
        courses[index].lecTimes[quarter][lecIndex].dow[dayIndex] = 1;
      } else {
        courses[index].lecTimes[quarter][lecIndex].dow[dayIndex] = 0;
      }
  
      this.setState({ courses });
    };
  
    // Update start & end times of a lecture time slot
    lecTimes = ({target}) => {
      let courseId = parseInt(target.dataset.courseid);
      let quarter = target.dataset.quarter;
      let lecIndex = parseInt(target.dataset.lecindex);
      let type = target.dataset.type;
      let value = parseInt(target.value);
  
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      if (type === "start-hr") {
        courses[index].lecTimes[quarter][lecIndex].start[0] = value;
      } else if (type === "start-min") {
        courses[index].lecTimes[quarter][lecIndex].start[1] = value;
      } else if (type === "start-am-pm") {
        courses[index].lecTimes[quarter][lecIndex].start[2] = value;
      } else if (type === "end-hr") {
        courses[index].lecTimes[quarter][lecIndex].end[0] = value;
      } else if (type === "end-min") {
        courses[index].lecTimes[quarter][lecIndex].end[1] = value;
      } else {
        courses[index].lecTimes[quarter][lecIndex].end[2] = value;
      }
  
      this.setState({ courses });
    };
  
    /////////////////////////////
    // Update discussion times //
    /////////////////////////////
  
    // Add a discussion section time slot for a course
    addDiscussion = (courseId, quarter) => {
      let index = this.findIndex(courseId);
  
      let courses = [...this.state.courses];
      courses[index].discTimes[quarter].push({start: [-1, -1, 0], end: [-1, -1, 0], dow: [0, 0, 0, 0, 0]});
      this.setState({ courses });
    };
  
    // Remove a discussion section time slot for a course
    removeDiscussion = (courseId, quarter) => {
      let index = this.findIndex(courseId);
  
      let courses = [...this.state.courses];
      if (courses[index].discTimes[quarter].length === 1) {
        alert("Error: Please select the 'No Discussion Section' box instead.");
        return;
      };
  
      courses[index].discTimes[quarter].pop();
      this.setState({ courses });
    };
  
    // Update days of week of a discussion section time slot
    discDow = (courseId, quarter, discIndex, dayIndex) => {
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      let current = courses[index].discTimes[quarter][discIndex].dow[dayIndex];
      if (current === 0) {
        courses[index].discTimes[quarter][discIndex].dow[dayIndex] = 1;
      } else {
        courses[index].discTimes[quarter][discIndex].dow[dayIndex] = 0;
      }
  
      this.setState({ courses });
    };
  
    // Update start & end times of a discussion section time slot
    discTimes = ({target}) => {
      let courseId = parseInt(target.dataset.courseid);
      let quarter = target.dataset.quarter;
      let discIndex = parseInt(target.dataset.discindex);
      let type = target.dataset.type;
      let value = parseInt(target.value);
  
      let index = this.findIndex(courseId);
      let courses = [...this.state.courses];
  
      if (type === "start-hr") {
        courses[index].discTimes[quarter][discIndex].start[0] = value;
      } else if (type === "start-min") {
        courses[index].discTimes[quarter][discIndex].start[1] = value;
      } else if (type === "start-am-pm") {
        courses[index].discTimes[quarter][discIndex].start[2] = value;
      } else if (type === "end-hr") {
        courses[index].discTimes[quarter][discIndex].end[0] = value;
      } else if (type === "end-min") {
        courses[index].discTimes[quarter][discIndex].end[1] = value;
      } else {
        courses[index].discTimes[quarter][discIndex].end[2] = value;
      }
  
      this.setState({ courses });
    };


    ////////////////////////////////////////
    /// Error catching for course inputs ///
    ////////////////////////////////////////


    // Catch course input errors before navigating to the next page
    catchInputErrors = () => {

      /*
        Check for the following errors:
          (1) User has entered at least one course
          (2) + (3) User has not entered too many courses
          (4) User has entered valid data for discussion & lecture times
      */
      if (this.state.courses.length === 0) {  // (1)
        alert("You cannot continue until you enter at least one course.");
        return true;
      } else if (this.state.maxFour && this.state.courses.length > 12) {  // (2)
        alert("You have entered over 12 courses, so we cannot enforce a maximum of 4 courses per quarter.");
        return true;
      } else if (this.state.courses.length > 15) {  // (3)
        let errorMsg = "Looks like you're an ambitious person (or don't know how to use this website)";
        errorMsg += ", but we're not going to let you enter over 15 courses.";
        alert(errorMsg);
        return true;
      } else {  // (4)
        let errorCourses = [];

        for (let i = 0; i < this.state.courses.length; i++) {
          let course = this.state.courses[i];

          for (let j = 0; j < this.state.quarters.length; j++) {
            let quarter = this.state.quarters[j];

            if (course["available"][quarter]) {

              // Check for errors with lecture time inputs
              for (let k = 0; k < course["lecTimes"][quarter].length; k++) {
                let lecTime = course["lecTimes"][quarter][k];
                
                // Check for undefined lecture times
                if (this.arrEq(lecTime["dow"], [0, 0, 0, 0, 0]) ||
                    this.arrEq(lecTime["end"], [-1, -1, 0]) ||
                    this.arrEq(lecTime["start"], [-1, -1, 0])) {
                  errorCourses.push([course.title, quarter, "lecture"]);
                  break;
                } // Check that start & end times make sense
                else if (timeToNum(lecTime["start"]) >= (timeToNum(lecTime["end"]))) {
                  errorCourses.push([course.title, quarter, "lecture"]);
                  break;
                }
              }
              
              // Same for discussion time inputs
              if (course["disc"][quarter]) {
                for (let k = 0; k < course["discTimes"][quarter].length; k++) {
                  let discTime = course["discTimes"][quarter][k];
                  
                  if (this.arrEq(discTime["dow"], [0, 0, 0, 0, 0]) ||
                      this.arrEq(discTime["end"], [-1, -1, 0]) ||
                      this.arrEq(discTime["start"], [-1, -1, 0])) {
                    errorCourses.push([course.title, quarter, "discussion"]);
                    break;
                  } else if (timeToNum(discTime["start"]) >= (timeToNum(discTime["end"]))) {
                    errorCourses.push([course.title, quarter, "discussion"]);
                    break;
                  }
                }
              }
            }
          }
        }

        // 'Compile' all course input error (lecture + discussions) & render alert message
        let errorCoursesStr = "";
        for (let i = 0; i < errorCourses.length; i++) {
          let error = errorCourses[i];
          if (i !== 0) {
            errorCoursesStr += " ";
          }

          errorCoursesStr += `${error[0]} (${capitalize(error[1])} - ${capitalize(error[2])})`;

          if (i + 1 !== errorCourses.length) {
            errorCoursesStr += " |";
          }
        }
        
        if (errorCourses.length > 0) {
          let errorMsg = "It looks like you had some errors in entering courses.";
          errorMsg += " Remember to (1) make sure you filled out the correct lecture times,";
          errorMsg += " discussions times, and days of the week and (2) all end times";
          errorMsg += " for lectures & discussions come after start times. Here are the errors";
          errorMsg += ` we found: ${errorCoursesStr}.`;
          alert(errorMsg);
          return true;
        }
      }

      return false;
    }

    // Helper function to check for array equality
    arrEq = (arr1, arr2) => {
      if (arr1.length !== arr2.length) {
        return false;
      } else {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] !== arr2[i]) {
            return false;
          }
        }

        return true;
      }
    }

    
    ///////////////////
    // Render method //
    ///////////////////

  
    render() { 
      return ( 
        <div className="m-bottom">
          {this.state.courses.map((course, courseIndex) => (
            <React.Fragment>
              <div key={courseIndex} className="form-row">
  
                {/* Start: Column 1 (Title, Pre/Co-Reqs, Preferences) */}
                <div className="form-group col-md-3">
                  {/* Course Title */}
                  <h4>Course Title: {course.title}</h4>
                  <h4 hidden={!(course.series)}>
                    (Year-Long Series: {capitalize(this.state.quarters[course.seriesIndex])})
                  </h4>
                  <div className="input-group m-bottom">
                    <input 
                      onChange={this.changeTitle} 
                      id={course.id}
                      value={course.title}
                      type="text"
                      className="form-control" 
                    />
                  </div>
  
                  {/* Course Timing Preferences */}
                  <div className="m-top" hidden={course.series || course.unique}>
                    <h4>Course Timing</h4>
                    <h6>Select the quarter you would like to take this course, if possible.</h6>
                    <div className="input-group m-bottom">
                      <select 
                        onChange={this.changePref}
                        data-courseid={course.id}
                        value={course.pref}
                        className="custom-select" 
                      >
                        <option value="">No Preference</option>
                        {this.state.quarters.filter(quarter => course.available[quarter]).map((quarter) => (
                        <React.Fragment>
                          <option value={quarter}>{capitalize(quarter)}</option>
                        </React.Fragment>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button onClick={() => this.removeCourse(course.id)} className="btn btn-danger btn-sm m-top">Remove Course</button>
                </div>
                {/* End: Column 1 */}
  
                {/* Start: Columns 2, 3, 4 (Lecture, Disc Times) */}
                {/* Quarters (Fa, Wi, Sp) */}
                {this.state.quarters.map((quarter, qIndex) => (
                  <div key={qIndex} className="form-group col-md-3">
                    <h4>{capitalize(quarter)}</h4>
                    <div className="form-check">
                      <input 
                        onChange={() => this.changeAvail(course.id, quarter)}
                        checked={!(course.available[quarter])}
                        disabled={course.series && this.state.quarters[course.seriesIndex] !== quarter}
                        className="form-check-input" 
                        type="checkbox" 
                      />
                      <label className="form-check-label">
                        Unavailable This Quarter
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        onChange = {() => this.changeDisc(course.id, quarter)}
                        checked={!(course.available[quarter]) ||
                          !(course.disc[quarter])}
                        disabled={course.series && this.state.quarters[course.seriesIndex] !== quarter}
                        className="form-check-input" 
                        type="checkbox" 
                      />
                      <label className="form-check-label">
                        No Discussion Section
                      </label>
                    </div>
  
                    {/* Lecture Times */}
                    <div hidden={!(course.available[quarter])}>
                      <h5 className="m-top-lg">Lectures</h5>
                      {course.lecTimes[quarter].map((lecTime, lecIndex) => (
                        <React.Fragment>
                          <div className="input-group m-bottom">
                            {this.state.dows.map((dow, dowIndex) => (
                              <React.Fragment>
                                <div className="form-check m-right">
                                  <input
                                    onChange={() => this.lecDow(course.id, quarter, lecIndex, dowIndex)} 
                                    checked={lecTime.dow[dowIndex] === 1}
                                    className="form-check-input" 
                                    type="checkbox" 
                                  />
                                  <label className="form-check-label">{dow}</label>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
  
                          <div className="input-group">
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.start[0]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="start-hr"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">Start Hr</option>
                              {[...Array(12)].map((_x, i) =>
                              <option value={i + 1}>
                                {i + 1}
                              </option>)}
                            </select>
                            <label className="m-right m-left">:</label>
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.start[1]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="start-min"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">Start Min</option>
                              {[...Array(10)].map((x, i) =>
                              <option value={i}>
                                {"0" + i}
                              </option>)}
                              {[...Array(50)].map((x, i) =>
                              <option value={i + 10}>
                                {i + 10}
                              </option>)}
                            </select>
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.start[2]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="start-am-pm"
                            >
                              <option value="0">AM</option>
                              <option value="1">PM</option>
                            </select>
                          </div>
                          <div className="input-group m-bottom">
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.end[0]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="end-hr"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">End Hr</option>
                              {[...Array(12)].map((x, i) =>
                              <option value={i + 1}>
                                {i + 1}
                              </option>)}
                            </select>
                            <label className="m-right m-left">:</label>
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.end[1]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="end-min"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">End Min</option>
                              {[...Array(10)].map((x, i) =>
                              <option value={i}>
                                {"0" + i}
                              </option>)}
                              {[...Array(50)].map((x, i) =>
                              <option value={i + 10}>
                                {i + 10}
                              </option>)}
                            </select>
                            <select 
                              onChange={this.lecTimes}
                              value={lecTime.end[2]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-lecindex={lecIndex}
                              data-type="end-am-pm"
                            >
                              <option value="0">AM</option>
                              <option value="1">PM</option>
                            </select>
                          </div>
                        </React.Fragment>
                      ))}
                      <button 
                        onClick={() => this.addLecture(course.id, quarter)} 
                        className="btn btn-success btn-sm m-top">
                          Add Lecture Time
                      </button>
                      <button 
                        onClick={() => this.removeLecture(course.id, quarter)} 
                        className="btn btn-warning btn-sm m-top m-left">
                          Remove Lecture Time
                      </button>
  
                      {/* Discussion Times */}
                      <div hidden={!(course.disc[quarter])}>
                        <h5 className="m-top-lg">Discussion Section</h5>
                        {course.discTimes[quarter].map((discTime, discIndex) => (
                          <React.Fragment>
                          <div className="input-group m-bottom">
                            {this.state.dows.map((dow, dowIndex) => ( 
                              <React.Fragment>
                                <div className="form-check m-right">
                                  <input
                                  onChange={() => this.discDow(course.id, quarter, discIndex, dowIndex)} 
                                  checked={discTime.dow[dowIndex] === 1}
                                  className="form-check-input" 
                                  type="checkbox" 
                                  />
                                  <label className="form-check-label">{dow}</label>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                            
                          <div className="input-group">
                            <select 
                              onChange={this.discTimes}
                              value={discTime.start[0]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="start-hr"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">Start Hr</option>
                              {[...Array(12)].map((x, i) =>
                              <option value={i + 1}>
                                {i + 1}
                              </option>)}
                            </select>
                            <label className="m-right m-left">:</label>
                            <select 
                              onChange={this.discTimes}
                              value={discTime.start[1]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="start-min"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">Start Min</option>
                              {[...Array(10)].map((x, i) =>
                              <option value={i}>
                                {"0" + i}
                              </option>)}
                              {[...Array(50)].map((x, i) =>
                              <option value={i + 10}>
                                {i + 10}
                              </option>)}
                            </select>
                            <select 
                              onChange={this.discTimes}
                              value={discTime.start[2]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="start-am-pm"
                            >
                              <option value="0">AM</option>
                              <option value="1">PM</option>
                            </select>
                          </div>
                          <div className="input-group m-bottom">
                            <select 
                              onChange={this.discTimes}
                              value={discTime.end[0]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="end-hr"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">End Hr</option>
                              {[...Array(12)].map((x, i) =>
                              <option value={i}>
                                {i}
                              </option>)}
                            </select>
                            <label className="m-right m-left">:</label>
                            <select 
                              onChange={this.discTimes}
                              value={discTime.end[1]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="end-min"
                              className="custom-select" 
                              style={{width: "auto"}}
                            >
                              <option value="-1">End Min</option>
                              {[...Array(10)].map((x, i) =>
                              <option value={i}>
                                {"0" + i}
                              </option>)}
                              {[...Array(50)].map((x, i) =>
                              <option value={i + 10}>
                                {i + 10}
                              </option>)}
                            </select>
                            <select 
                              onChange={this.discTimes}
                              value={discTime.end[2]}
                              data-courseid={course.id}
                              data-quarter={quarter}
                              data-discindex={discIndex}
                              data-type="end-am-pm"
                            >
                              <option value="0">AM</option>
                              <option value="1">PM</option>
                            </select>
                          </div>
                        </React.Fragment>
                        ))}
                        <button 
                          onClick={() => this.addDiscussion(course.id, quarter)} 
                          className="btn btn-success btn-sm m-top">
                            Add Disc. Time
                        </button>
                        <button 
                          onClick={() => this.removeDiscussion(course.id, quarter)} 
                          className="btn btn-warning btn-sm m-top m-left">
                            Remove Disc. Time
                        </button>
                      </div>
                    </div>
                  </div> 
                ))}
                {/* End: Columns 2, 3, 4 */}
              </div>
              <hr className="hr" />
            </React.Fragment>
          ))}
         
          {/* Final Section: Add Courses, Specify Algorithm */}
          <button onClick={this.addCourse} className="btn btn-primary m-right-sm">Add Course</button>
          <button onClick={this.addSeries} className="btn btn-primary m-right-sm">Add Year-Long Series</button>
          <button onClick={this.clear} className="btn btn-danger m-right-sm">Clear Data</button>
          <button onClick={() => {
            if (!this.catchInputErrors()) {
              this.props.onTransition("preCoReq",
                                      this.state.currentId, 
                                      this.state.courses, 
                                      this.state.maxFour, 
                                      this.state.balance)
            }
          }}
                            className="btn btn-success">Enter Pre/Co-Requisites</button>
          <div className="form-check m-top-sm">
            <input 
              onChange={this.tenMinGap} 
              checked={this.state.tenMinGap} 
              className="form-check-input" 
              type="checkbox" 
            />
            <label className="form-check-label">Enforce a 10-Min Gap Between Classes</label>
          </div>
          <div className="form-check">
            <input 
              onChange={this.maxFour} 
              checked={this.state.maxFour} 
              className="form-check-input" 
              type="checkbox" 
            />
            <label className="form-check-label">Max 4 Courses Per Quarter</label>
          </div>
          <div className="form-check">
            <input 
              onChange={this.balance} 
              checked={this.state.balance} 
              className="form-check-input" 
              type="checkbox" 
            />
            <label className="form-check-label">Balance Schedule (Equal # of Courses Per Quarter)</label>
          </div>
        </div>
      );
    }
  }

export default Input;