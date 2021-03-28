import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

// Displays suggested course schedule
class Output extends Component {

    // Initializes internal state using data from 'App' component
    constructor(props) {
        super(props);
        this.state = {
            currentId: props.currentId,
            courses: props.courses,
            maxFour: props.maxFour,
            balance: props.balance,
            quarters: ["fall", "winter", "spring"],
            dows: ["M", "Tu", "W", "Th", "F"]
        };
    };

    render() { 
        return (  
            <React.Fragment>
                <div>Output Component</div>
                <button onClick={() => this.props.onTransition("input", this.state.courses)} 
                        className="btn btn-warning m-bottom-sm">Edit Original Courses</button>
                <br />
                <button onClick={() => this.props.onTransition("preCoReq", this.state.courses)} 
                        className="btn btn-success">Edit Pre/Co-Requisites</button>
            </React.Fragment>
        );
    };
};
 
export default Output;