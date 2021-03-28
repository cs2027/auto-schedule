import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

// Select courses with pre/co-requisites
class PreCoReq extends Component {
    
    // Initializes internal state using data from 'App' component
    constructor(props) {
        super(props);
        this.state = {courses: props.courses };
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
    };

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
    };

    render() { 
        return ( 
            <React.Fragment>
                {/* Prereqs */}
                <h4>Please select the courses that have prerequisites.</h4>
                {this.state.courses.map((course, index) => (
                    <div key={index}>
                        <div className="form-check m-bottom-sm">
                        <input 
                            onChange={this.prereqStatus}
                            checked={course.prereqs !== null} 
                            id={course.id}
                            className="form-check-input" 
                            type="checkbox" 
                        />
                        <label className="form-check-label">{course.title}</label>
                        </div>
                    </div>
                    ))}

                {/* Co-reqs */}
                <h4 className="m-top">Please select the courses that have co-requisites.</h4>
                {this.state.courses.map((course, index) => (
                    <div key={index}>
                        <div className="form-check m-bottom-sm">
                        <input 
                            onChange={this.coreqStatus}
                            checked={course.coreqs !== null} 
                            id={course.id}
                            className="form-check-input" 
                            type="checkbox" 
                        />
                        <label className="form-check-label">{course.title}</label>
                        </div>
                    </div>
                ))}

                {/* Toggle between screens */}
                <button onClick={() => this.props.onTransition("input", this.state.courses)} 
                        className="btn btn-warning m-top m-bottom-sm">Return to Course Inputs</button>
                <br />
                <button onClick={() => this.props.onTransition("preCoReq2", this.state.courses)} 
                        className="btn btn-success m-bottom">Select Pre/Co-Requisites</button>
            </React.Fragment>
        );
    }
}
 
export default PreCoReq;