// import logo from './logo.svg';
import React, { Component } from 'react';
import { courseIdMap_sm, courseIdMap_lg, groupsSmall, groupsLarge } from './SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = { 
    numCourses: 0,
    groups: [],
    courseIdMap: []
  }

  handleCourse = () => {
    console.log('Handle Course');
  }

  handleSeries = () => {
    console.log('Handle Series');
  }

  render() { 
    return ( 
      <div className="m-bottom">
        {groupsSmall.map((group, index) => (
          <div key={index} className="form-row m-bottom-sm">
            {group.map((course, index) => (
              <div key={index} className="form-group col-md-3">
                <div className="input-group m-bottom">
                  <input type="text" className="form-control" placeholder="Course Title" />
                </div>

                <label>Prerequisites:</label>
                <div className="input-group">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">None</label>
                  </div>
                </div>
                <div className="input-group m-bottom">
                    {courseIdMap_lg.map((course) => (
                      <div className="form-check m-right">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">{course.title}</label>
                      </div>
                    ))}
                </div>

                <hr className="hr" />

                <label>Fall</label>
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
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Start Time" />
                  <select>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="End Time" />
                  <select>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
                <button className="btn btn-success btn-sm m-top">Add Time</button>
              </div>
            ))}
          </div>
        ))}
        <button onClick={this.handleCourse} className="btn btn-primary m-right-sm">Add Course</button>
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
