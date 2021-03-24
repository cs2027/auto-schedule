// import logo from './logo.svg';
import React, { Component } from 'react';
import { courses_sm, courses_lg } from './SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = { 
    currentId: 3,
    courses: [
      {
        id: 1, 
        title: "Course 1",
        times: {
          fall: [{start: null, end: null}],
          winter: [{start: null, end: null}],
          spring: [{start: null, end: null}]
        },
        series: false,
        prereq: null
      }, 
      {
        id: 2, 
        title: "Course 2", 
        times: {
          fall: [{start: null, end: null}],
          winter: [{start: null, end: null}],
          spring: [{start: null, end: null}]
        },
        series: false,
        prereq: null
      }
    ]
  }

  // Find course index in internal list, based on its Id number
  findCourse = (courseId) => {
    let courses = [...this.state.courses];

    for (var i in courses) {
      if (courses[i].id === courseId) {
        return i;
      };
    };

    return -1;
  }

  // Add a new course 
  addCourse = () => {
    this.setState(oldState => ({
      currentId: oldState.currentId + 1,
      courses: [...oldState.courses, 
                {
                  id: oldState.currentId, 
                  title: `Course ${oldState.currentId}`, 
                  times: {
                    fall: [{start: null, end: null}],
                    winter: [{start: null, end: null}],
                    spring: [{start: null, end: null}]
                  },
                  series: false,
                  prereq: null
                }]
    }));
  };

  // Remove a specified course
  removeCourse = (courseId) => {
    this.setState(oldState => ({
      courses: oldState.courses.filter((course) => course.id !== courseId)
    }));
  };

  // Add a time slot for a course (ex. 9am and 11am sections)
  addTime = (courseId, quarter) => {
    let index = this.findCourse(courseId);

    if (index === -1) {
      return;
    }

    let courses = [...this.state.courses];
    courses[index].times[quarter].push({start: null, end: null});
    this.setState({ courses });
  };

  // Remove a time slot for a course
  removeTime = (courseId, quarter) => {
    let index = this.findCourse(courseId);

    if (index === -1) {
      return;
    }

    let courses = [...this.state.courses];
    if (courses[index].times[quarter].length === 1) {
      alert('Error: You are attempting to remove the only time slot.');
      return;
    };

    courses[index].times[quarter].pop();
    this.setState({ courses });
  };

  // TODO
  handleSeries = () => {
    console.log('Handle Series');
  }

  // Render method
  render() { 
    return ( 
      <div className="m-bottom">
        <div className="form-row m-bottom-sm">
          {this.state.courses.map((course, index) => (
            <div key={index} className="form-group col-md-3">

              {/* Course Title */}
              <h4>Course Title: {course.title}</h4>
              <div className="input-group m-bottom">
                <input type="text" className="form-control" placeholder="Course Title" />
              </div>

              {/* Prereqs */}
              <h4>Prerequisites:</h4>
              <div className="input-group">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">None</label>
                </div>
              </div>
              <div className="input-group m-bottom">
                  {this.state.courses.map((course) => (
                    <div key={course.id} className="form-check m-right">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">{course.title}</label>
                    </div>
                  ))}
              </div>

              {/* Fall Quarter */}
              <h4>Fall</h4>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">
                  Unavailable This Quarter
                </label>
              </div>
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

              {/* Fall Quarter: Times */}
              {course.times.fall.map((index) => (
                <React.Fragment>
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
                onClick={() => this.addTime(course.id, 'fall')} 
                className="btn btn-success btn-sm m-top">
                  Add Time
              </button>
              <button 
                onClick={() => this.removeTime(course.id, 'fall')} 
                className="btn btn-warning btn-sm m-top m-left">
                  Remove Time
              </button>

              {/* Remove Course */}
              <br />
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
