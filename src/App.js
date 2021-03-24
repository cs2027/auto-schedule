// import logo from './logo.svg';
import React, { Component } from 'react';
import { groups } from './SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Input extends Component {
  state = { }

  handleCourse = () => {
    console.log('Handle Course');
  }

  handleSeries = () => {
    console.log('Handle Series');
  }

  render() { 
    return ( 
      <div style={{marginBottom: "2%"}}>
        {groups.map((group, index) => (
          <div style={{marginBottom: "5%"}} key={index} className="form-row">
            {group.map((course, index) => (
              <div key={index} className="form-group col-md-3">
                <u>{course.title}</u>

                <br />
                <label>Fall</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Unavailable This Quarter
                  </label>
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

                <br />
                <label>Winter</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Unavailable This Quarter
                  </label>
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

                <br />
                <label>Spring</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Unavailable This Quarter
                  </label>
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

              </div>
            ))}
          </div>
        ))}
        <button style={{marginRight: "1%"}} onClick={this.handleCourse} className="btn btn-primary">Add Course</button>
        <button onClick={this.handleSeries} className="btn btn-primary">Add Year-Long Series</button>
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
