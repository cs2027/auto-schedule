// import logo from './logo.svg';
import React, { Component } from 'react';
import { courses_sm, courses_lg } from './SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = { 
    currentId: 1,
    courses: []
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
  }

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
                    fall: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}],
                    winter: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}],
                    spring: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}]
                  },
                  discTimes: {
                    fall: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}],
                    winter: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}],
                    spring: [{start: null, end: null, dow: [0, 0, 0, 0, 0]}]
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
                  prereqs: []
                }]
    }));
  };

  // Remove a specified course
  removeCourse = (courseId) => {
    this.setState(oldState => ({
      courses: oldState.courses.filter((course) => course.id !== courseId)
    }));
  };

  // Method to add year-long course sequences (TODO)
  handleSeries = () => {
    console.log('Handle Series');
  };

  //////////////////////////
  // Update lecture times //
  //////////////////////////

  // Add a lecture time slot for a course (ex. 9am and 11am sections)
  addLecture = (courseId, quarter) => {
    let index = this.findIndex(courseId);

    let courses = [...this.state.courses];
    courses[index].lecTimes[quarter].push({start: null, end: null, dow: [0, 0, 0, 0, 0]});
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

  /////////////////////////////
  // Update discussion times //
  /////////////////////////////

  // Add a discussion section time slot for a course
  addDiscussion = (courseId, quarter) => {
    let index = this.findIndex(courseId);

    let courses = [...this.state.courses];
    courses[index].discTimes[quarter].push({start: null, end: null, dow: [0, 0, 0, 0, 0]});
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
                  {this.state.courses.map((prereq) => (
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

              {/* START: Fall Quarter */}
              <h4 className="m-top">Fall</h4>
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
                  checked={!(this.state.courses[this.findIndex(course.id)].disc.fall)}
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
                {course.lecTimes.fall.map((index) => (
                  <React.Fragment>
                    <div className="input-group m-bottom">
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">M</label>
                      </div>
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">Tu</label>
                      </div>
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">W</label>
                      </div>
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">Th</label>
                      </div>
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">F</label>
                      </div>
                    </div>
                    <div className="input-group">
                    <input type="text" className="form-control" placeholder="Start Time" />
                    <select>
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                    </div>
                    <div className="input-group m-bottom">
                      <input type="text" className="form-control" placeholder="End Time" />
                      <select>
                        <option>AM</option>
                        <option>PM</option>
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
                  {course.discTimes.fall.map((index) => (
                    <React.Fragment>
                      <div className="input-group m-bottom">
                        <div className="form-check m-right">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">M</label>
                        </div>
                        <div className="form-check m-right">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">Tu</label>
                        </div>
                        <div className="form-check m-right">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">W</label>
                        </div>
                        <div className="form-check m-right">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">Th</label>
                        </div>
                        <div className="form-check m-right">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">F</label>
                        </div>
                      </div>
                      <div className="input-group">
                      <input type="text" className="form-control" placeholder="Start Time" />
                      <select>
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                      </div>
                      <div className="input-group m-bottom">
                        <input type="text" className="form-control" placeholder="End Time" />
                        <select>
                          <option>AM</option>
                          <option>PM</option>
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
        <button onClick={this.handleSeries} className="btn btn-primary">Add Year-Long Series</button>
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

export default App;
