import React, { Component } from 'react';
import { courses_sm, courses_lg } from '../utils/SampleData';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

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

    ///////////////////
    // Render method //
    ///////////////////
    
    render() { 
        return (  
            <React.Fragment>
                <div>Output Component</div>
                <button onClick={() => this.props.onTransition(this.state.currentId, 
                                                            this.state.courses, 
                                                            this.state.maxFour, 
                                                            this.state.balance)} 
                        className="btn btn-success">Edit Courses</button>
            </React.Fragment>
        );
    };
};
 
export default Output;