import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

// Select pre/co-requisites for appropriate courses
class PreCoReq2 extends Component {

    // Initializes internal state using data from 'App' component
    constructor(props) {
        super(props);
        this.state = {courses: props.courses, titleMap: props.titleMap};
    };

    ////////////////////////////
    // Testing w/ Sample Data //
    ////////////////////////////

    sampleDataSm = () => {
        this.setState({
            currentId: 6,
            courses: courses_sm,
            tenMinGap: true,
            maxFour: true,
            balance: true
        });
    };

    sampleDataLg = () => {
        this.setState({
            currentId: 13,
            courses: courses_lg,
            tenMinGap: true,
            maxFour: true,
            balance: true
        });
    };

    ///////////////////////////
    // End Testing Functions //
    ///////////////////////////

    // Find course index in internal list, based on its Id number
    findIndex = (courseId) => {
        let courses = [...this.state.courses];

        for (let i = Math.min(courseId - 1, courses.length - 1); i >= 0; i--) {
            if (courses[i].id === courseId) {
            return i;
            };
        };
    };

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

    render() { 
        return (  
            <React.Fragment>
                {this.state.courses.map((course, index) => (
                <div key={index}>
                    <h3
                        hidden={course.prereqs === null && course.coreqs === null} 
                        className="m-top">
                        {course.title}
                    </h3>

                    {/* Prereqs */}
                    <div hidden={course.prereqs === null}>
                        <h4>Prerequisites:</h4>
                        <div className="input-group">
                            {this.state.courses.filter(prereq => prereq.id !== course.id).map((prereq) => (
                                <div key={prereq.id} className="form-check m-right">
                                <input 
                                    onChange={() => this.editPrereqs(course.id, prereq.id)}
                                    checked={course.prereqs !== null && course.prereqs.includes(prereq.id)}
                                    className="form-check-input" 
                                    type="checkbox" 
                                />
                                <label className="form-check-label">{prereq.title}</label>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    {/* Co-reqs */}
                    <div hidden={course.coreqs === null}>
                        <h4>Co-Requisites:</h4>
                        <div className="input-group">
                            {this.state.courses.filter(coreq => coreq.id !== course.id).map((coreq) => (
                                <div key={coreq.id} className="form-check m-right">
                                    <input 
                                    onChange={() => this.editCoreqs(course.id, coreq.id)}
                                    checked={course.coreqs !== null && course.coreqs.includes(coreq.id)}
                                    className="form-check-input" 
                                    type="checkbox" 
                                    />
                                    <label className="form-check-label">{coreq.title}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                ))}

                <br />
                <button onClick={this.sampleDataLg} className="btn btn-primary m-right-sm">Populate Sample Data (Large)</button>
                <button onClick={this.sampleDataSm} className="btn btn-primary m-right-sm">Populate Sample Data (Small)</button>
                <br />
                <button onClick={() => this.props.onTransition("input", this.state.courses)} 
                        className="btn btn-warning m-top m-bottom-sm">Return to Course Inputs</button>
                <br />
                <button onClick={() => this.props.onTransition("preCoReq", this.state.courses)} 
                        className="btn btn-warning m-bottom-sm">Edit Pre/Co-Requisite List</button>
                <br />
                <button onClick={() => this.props.onTransition("output", this.state.courses)} 
                        className="btn btn-success">View Course Schedule(s)</button>

            </React.Fragment>
        );
    }
}
 
export default PreCoReq2;