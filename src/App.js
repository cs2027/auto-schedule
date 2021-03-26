// import logo from './logo.svg';
import React, { Component } from 'react';
import { courses_sm, courses_lg } from './SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = { 
    currentId: 1,
    courses: [],
    maxFour: false,
    balance: false
  }

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

  // Pad numbers to 2 digits
  // Used to format single-digit minutes nicely (8:0 AM --> 8:00 AM)
  padDigits = (n) => {
    return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
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
                  pref: "",
                  prereqs: [],
                  coreqs: []
                }]
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
                    title: `Course ${oldState.currentId} (Series)`, 
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
                    pref: "",
                    prereqs: [],
                    coreqs: []
                  }]
      }));
    } else if (index === 1) {
      this.setState(oldState => ({
        currentId: oldState.currentId + 1,
        courses: [...oldState.courses, 
                  {
                    id: oldState.currentId, 
                    title: `Course ${oldState.currentId} (Series)`, 
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
                    pref: "",
                    prereqs: [], 
                    coreqs: []
                  }]
      }));
    } else {
      this.setState(oldState => ({
        currentId: oldState.currentId + 1,
        courses: [...oldState.courses, 
                  {
                    id: oldState.currentId, 
                    title: `Course ${oldState.currentId} (Series)`, 
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
                    pref: "",
                    prereqs: [],
                    coreqs: []
                  }]
      }));
    }
  };

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

  ////////////////////
  // Course prereqs //
  ////////////////////

  // Update whether or not a course has prereqs
  prereqStatus = ({target}) => {
    let index = this.findIndex(parseInt(target.id));
    let courses = [...this.state.courses];

    if (courses[index].prereqs === null) {
      courses[index].prereqs = [];
    } else {
      courses[index].prereqs = null;
    }

    this.setState({ courses });
  }

  // Add or remove a prereq for a course
  editPrereqs = (courseId, prereqId) => {
    let index = this.findIndex(courseId);
    let courses = [...this.state.courses];
  
    if (courses[index].prereqs.includes(prereqId)) {
      let prereqs = courses[index].prereqs;
      courses[index].prereqs = prereqs.filter(Id => Id !== prereqId);
    } else {
      courses[index].prereqs.push(prereqId);
    }

    this.setState({ courses });
  };

  ////////////////////
  // Course co-reqs //
  ////////////////////
  
  // Update whether or not a course has co-requisites
  coreqStatus = ({target}) => {
    let index = this.findIndex(parseInt(target.id));
    let courses = [...this.state.courses];

    if (courses[index].coreqs === null) {
      courses[index].coreqs = [];
    } else {
      courses[index].coreqs = null;
    }

    this.setState({ courses });
  }

  // Edit co-requisites for a given course
  editCoreqs = (courseId, coreqId) => {
    let index = this.findIndex(courseId);
    let courses = [...this.state.courses];
  
    if (courses[index].coreqs.includes(coreqId)) {
      let coreqs = courses[index].coreqs;
      courses[index].coreqs = coreqs.filter(Id => Id !== coreqId);
    } else {
      courses[index].coreqs.push(coreqId);
    }

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
  changeAvail = (courseId, quarter) => {
    let index = this.findIndex(courseId);
    let courses = [...this.state.courses];

    let avail = courses[index].available[quarter];
    courses[index].available[quarter] = !(avail);
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

  ///////////////////
  // Render method //
  ///////////////////

  render() { 
    return ( 
      <div className="m-bottom">
        <div className="form-row m-bottom-sm">
          {this.state.courses.map((course, index) => (
            <div key={index} className="form-group col-md-3">

              {/* Course Title */}
              <h4>Course Title: {course.title}</h4>
              <div className="input-group m-bottom">
                <input 
                  onChange={this.changeTitle} 
                  id={course.id}
                  value={course.title}
                  type="text"
                  className="form-control" 
                />
              </div>

              {/* Prereqs */}
              <h4>Prerequisites:</h4>
              <div className="input-group">
                <div className="form-check">
                  <input 
                    onChange={this.prereqStatus}
                    checked={this.state.courses[this.findIndex(course.id)].prereqs === null} 
                    id={course.id}
                    className="form-check-input" 
                    type="checkbox" 
                  />
                  <label className="form-check-label">None</label>
                </div>
              </div>
              <div 
                hidden={this.state.courses[this.findIndex(course.id)].prereqs === null} 
                className="input-group"
              >
                  {this.state.courses.filter(prereq => !(prereq.series) && prereq.id !== course.id).map((prereq) => (
                    <div key={prereq.id} className="form-check m-right">
                      <input 
                        onChange={() => this.editPrereqs(course.id, prereq.id)}
                        checked={this.state.courses[this.findIndex(course.id)].prereqs !== null &&
                                this.state.courses[this.findIndex(course.id)].prereqs.includes(prereq.id)}
                        className="form-check-input" 
                        type="checkbox" 
                      />
                      <label className="form-check-label">{prereq.title}</label>
                    </div>
                  ))}
              </div>

              {/* Co-reqs */}
              <h4 className="m-top">Co-Requisites:</h4>
              <div className="input-group">
                <div className="form-check">
                  <input 
                    onChange={this.coreqStatus}
                    checked={this.state.courses[this.findIndex(course.id)].coreqs === null} 
                    id={course.id}
                    className="form-check-input" 
                    type="checkbox" 
                  />
                  <label className="form-check-label">None</label>
                </div>
              </div>
              <div 
                hidden={this.state.courses[this.findIndex(course.id)].coreqs === null} 
                className="input-group"
              >
                  {this.state.courses.filter(coreq => !(coreq.series) && coreq.id !== course.id).map((coreq) => (
                    <div key={coreq.id} className="form-check m-right">
                      <input 
                        onChange={() => this.editCoreqs(course.id, coreq.id)}
                        checked={this.state.courses[this.findIndex(course.id)].coreqs !== null &&
                                this.state.courses[this.findIndex(course.id)].coreqs.includes(coreq.id)}
                        className="form-check-input" 
                        type="checkbox" 
                      />
                      <label className="form-check-label">{coreq.title}</label>
                    </div>
                  ))}
              </div>

              {/* Course Timing */}
              <div className="m-top" hidden={this.state.courses[this.findIndex(course.id)].series}>
                <h4>Course Timing</h4>
                <h6>Select the quarter you would like to take this course, if possible.</h6>
                <div className="input-group m-bottom">
                  <select 
                    onChange={this.changePref}
                    data-courseid={course.id}
                    value={this.state.courses[this.findIndex(course.id)].pref}
                    className="custom-select" 
                  >
                    <option value="">No Preference</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                    <option value="spring">Spring</option>
                  </select>
                </div>
              </div>

              {/* START: Fall Quarter */}
              <h4 className="m-top-lg">Fall</h4>
              <div className="form-check">
                <input 
                  onChange={() => this.changeAvail(course.id, 'fall')}
                  checked={!(this.state.courses[this.findIndex(course.id)].available.fall)}
                  className="form-check-input" 
                  type="checkbox" 
                />
                <label className="form-check-label">
                  Unavailable This Quarter
                </label>
              </div>
              <div className="form-check">
                <input 
                  onChange = {() => this.changeDisc(course.id, 'fall')}
                  checked={!(this.state.courses[this.findIndex(course.id)].available.fall) ||
                    !(this.state.courses[this.findIndex(course.id)].disc.fall)}
                  className="form-check-input" 
                  type="checkbox" 
                />
                <label className="form-check-label">
                  No Discussion Section
                </label>
              </div>

              <div hidden={!(this.state.courses[this.findIndex(course.id)].available.fall)}>

                {/* Fall Quarter: Lecture Times */}
                <h5 className="m-top-lg">Lectures</h5>
                {course.lecTimes.fall.map((lecTime, index) => (
                  <React.Fragment>
                    <div className="input-group m-bottom">
                      <div className="form-check m-right">
                        <input
                          onChange={() => this.lecDow(course.id, 'fall', index, 0)} 
                          checked={lecTime.dow[0] === 1}
                          className="form-check-input" 
                          type="checkbox" 
                        />
                        <label className="form-check-label">M</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                          onChange={() => this.lecDow(course.id, 'fall', index, 1)} 
                          checked={lecTime.dow[1] === 1}
                          className="form-check-input" 
                          type="checkbox" 
                        />
                        <label className="form-check-label">Tu</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                          onChange={() => this.lecDow(course.id, 'fall', index, 2)} 
                          checked={lecTime.dow[2] === 1}
                          className="form-check-input" 
                          type="checkbox" 
                        />
                        <label className="form-check-label">W</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                          onChange={() => this.lecDow(course.id, 'fall', index, 3)} 
                          checked={lecTime.dow[3] === 1}
                          className="form-check-input" 
                          type="checkbox" 
                        />
                        <label className="form-check-label">Th</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                          onChange={() => this.lecDow(course.id, 'fall', index, 4)} 
                          checked={lecTime.dow[4] === 1}
                          className="form-check-input" 
                          type="checkbox" 
                        />
                        <label className="form-check-label">F</label>
                      </div>
                    </div>

                    <div className="input-group">
                      <select 
                        onChange={this.lecTimes}
                        value={lecTime.start[0]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-lecindex={index}
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
                        onChange={this.lecTimes}
                        value={lecTime.start[1]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-lecindex={index}
                        data-type="start-min"
                        className="custom-select" 
                        style={{width: "auto"}}
                      >
                        <option value="-1">Start Min</option>
                        {[...Array(60)].map((x, i) =>
                        <option value={i}>
                          {this.padDigits(i)}
                        </option>)}
                      </select>
                      <select 
                        onChange={this.lecTimes}
                        value={lecTime.start[2]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-lecindex={index}
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
                        data-quarter="fall"
                        data-lecindex={index}
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
                        onChange={this.lecTimes}
                        value={lecTime.end[1]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-lecindex={index}
                        data-type="end-min"
                        className="custom-select" 
                        style={{width: "auto"}}
                      >
                        <option value="-1">End Min</option>
                        {[...Array(60)].map((x, i) =>
                        <option value={i}>
                          {this.padDigits(i)}
                        </option>)}
                      </select>
                      <select 
                        onChange={this.lecTimes}
                        value={lecTime.end[2]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-lecindex={index}
                        data-type="end-am-pm"
                      >
                        <option value="0">AM</option>
                        <option value="1">PM</option>
                      </select>
                    </div>
                  </React.Fragment>
                ))}
                <button 
                  onClick={() => this.addLecture(course.id, 'fall')} 
                  className="btn btn-success btn-sm m-top">
                    Add Lecture Time
                </button>
                <button 
                  onClick={() => this.removeLecture(course.id, 'fall')} 
                  className="btn btn-warning btn-sm m-top m-left">
                    Remove Lecture Time
                </button>

                {/* Fall Quarter: Discussion Times */}
                <div hidden={!(this.state.courses[this.findIndex(course.id)].disc.fall)}>
                  <h5 className="m-top-lg">Discussion Section</h5>
                  {course.discTimes.fall.map((discTime, index) => (
                    <React.Fragment>
                    <div className="input-group m-bottom">
                      <div className="form-check m-right">
                        <input
                        onChange={() => this.discDow(course.id, 'fall', index, 0)} 
                        checked={discTime.dow[0] === 1}
                        className="form-check-input" 
                        type="checkbox" 
                        />
                        <label className="form-check-label">M</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                        onChange={() => this.discDow(course.id, 'fall', index, 1)} 
                        checked={discTime.dow[1] === 1}
                        className="form-check-input" 
                        type="checkbox" 
                        />
                        <label className="form-check-label">Tu</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                        onChange={() => this.discDow(course.id, 'fall', index, 2)} 
                        checked={discTime.dow[2] === 1}
                        className="form-check-input" 
                        type="checkbox" 
                        />
                        <label className="form-check-label">W</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                        onChange={() => this.discDow(course.id, 'fall', index, 3)} 
                        checked={discTime.dow[3] === 1}
                        className="form-check-input" 
                        type="checkbox" 
                        />
                        <label className="form-check-label">Th</label>
                      </div>
                      <div className="form-check m-right">
                        <input
                        onChange={() => this.discDow(course.id, 'fall', index, 4)} 
                        checked={discTime.dow[4] === 1}
                        className="form-check-input" 
                        type="checkbox" 
                        />
                        <label className="form-check-label">F</label>
                      </div>
                    </div>
                      
                    <div className="input-group">
                      <select 
                        onChange={this.discTimes}
                        value={discTime.start[0]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-discindex={index}
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
                        data-quarter="fall"
                        data-discindex={index}
                        data-type="start-min"
                        className="custom-select" 
                        style={{width: "auto"}}
                      >
                        <option value="-1">Start Min</option>
                        {[...Array(60)].map((x, i) =>
                        <option value={i}>
                          {this.padDigits(i)}
                        </option>)}
                      </select>
                      <select 
                        onChange={this.discTimes}
                        value={discTime.start[2]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-discindex={index}
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
                        data-quarter="fall"
                        data-discindex={index}
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
                        data-quarter="fall"
                        data-discindex={index}
                        data-type="end-min"
                        className="custom-select" 
                        style={{width: "auto"}}
                      >
                        <option value="-1">End Min</option>
                        {[...Array(60)].map((x, i) =>
                        <option value={i}>
                          {this.padDigits(i)}
                        </option>)}
                      </select>
                      <select 
                        onChange={this.discTimes}
                        value={discTime.end[2]}
                        data-courseid={course.id}
                        data-quarter="fall"
                        data-discindex={index}
                        data-type="end-am-pm"
                      >
                        <option value="0">AM</option>
                        <option value="1">PM</option>
                      </select>
                    </div>
                  </React.Fragment>
                  ))}
                  <button 
                    onClick={() => this.addDiscussion(course.id, 'fall')} 
                    className="btn btn-success btn-sm m-top">
                      Add Disc. Time
                  </button>
                  <button 
                    onClick={() => this.removeDiscussion(course.id, 'fall')} 
                    className="btn btn-warning btn-sm m-top m-left">
                      Remove Disc. Time
                  </button>
                </div>
              </div>
              {/* END: Fall Quarter */}
              
              {/* Remove Course */}
              <button onClick={() => this.removeCourse(course.id)} className="btn btn-danger btn-sm m-top">Remove Course</button>
              <hr className="hr" />
            </div>
          ))}
        </div>
       
        {/* Final Section: Add Courses, Specify Algorithm */}
        <button onClick={this.addCourse} className="btn btn-primary m-right-sm">Add Course</button>
        <button onClick={this.addSeries} className="btn btn-primary">Add Year-Long Series</button>
        <div className="form-check m-top-sm">
          <input className="form-check-input" type="checkbox" />
          <label className="form-check-label">Max 4 Courses Per Quarter</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" />
          <label className="form-check-label">Balance Schedule (Equal # of Courses Per Quarter)</label>
        </div>
      </div>
    );
  }
}
 
class Output extends Component {
  state = {  }
  render() { 
    return (  
      <p>Output Component</p>
    );
  }
}

class App extends Component {
  state = {
    'input': true
  }

  render() {
    return (
      <div className="global">
        <h1 style={{marginTop: "1%"}}>AutoSchedule</h1>
        <hr className="hr"/>
        {this.state.input ? <Input /> : <Output />}
      </div>
    );
  }
}

export default App