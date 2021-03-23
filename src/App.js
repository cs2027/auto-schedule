// import logo from './logo.svg';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = {  
    numCourses: 2,
    courses: [
      {
        id: 1, 
        title: "CS 336",
        fall: [1300, 1420],
        winter: [930, 1050],
        spring: [930, 1050]
      }, 
      {
        id: 2, 
        title: "CS 339", 
        fall: [900, 950],
        winter: [1530, 1650],
        spring: [1530, 1650]
      }, 
    ]
  }

  handleCourse = () => {
    console.log(this.state.courses);
  }

  render() { 
    return ( 
      <>
        <h2>Courses Added: {this.state.courses.map((course) => (
          course.title + " | "
        ))}
        </h2>
        <form>
          {this.state.courses.map((course) => (
            <React.Fragment>
              <div class="form-group">
                <label>Course Name</label>
                <input type="text" class="form-control" placeholder="Name" />
              </div>
              <div class="form-group">
                <label>Fall</label>
                <input type="text" class="form-control" placeholder="Start Time" />
                <br />
                <input type="text" class="form-control" placeholder="End Time" />
              </div>
              <div class="form-group">
                <label>Winter</label>
                <input type="text" class="form-control" placeholder="Start Time" />
                <br />
                <input type="text" class="form-control" placeholder="End Time" />
              </div>
              <div class="form-group">
                <label>Spring</label>
                <input type="text" class="form-control" placeholder="Start Time" />
                <br />
                <input type="text" class="form-control" placeholder="End Time" />
              </div>
              <hr className="hr-light" />
            </React.Fragment>
          ))}
        </form>
        <button onClick={this.handleCourse} className="btn btn-primary">Add Course</button>
      </>
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
      <div className="Global">
        <h1>AutoSchedule</h1>
        <hr className="hr"/>
        {this.state.input ? <Input /> : <Output />}
      </div>
    );
  }
}

export default App;
