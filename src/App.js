// import logo from './logo.svg';
import React, { Component } from 'react';
import Input from './components/Input';
import Output from './components/Output';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  state = {
    input: true,
    currentId: 1,
    courses: [],
    maxFour: false,
    balance: false,
    quarters: ["fall", "winter", "spring"],
    dows: ["M", "Tu", "W", "Th", "F"]
  }

  // Toggles between 'Input' & 'Output' components
  handleTransition = (currentId, courses, maxFour, balance) => {
    let input = !(this.state.input);
    this.setState({ input, currentId, courses, maxFour, balance });
  };

  render() {
    return (
      <div className="global">
        <h1 style={{marginTop: "1%"}}>AutoSchedule</h1>
        <hr className="hr"/>
        {this.state.input 
        ? 
        <Input 
          onTransition={this.handleTransition} 
          currentId={this.state.currentId} 
          courses={this.state.courses} 
          maxFour={this.state.maxFour} 
          balance={this.state.balance}
        /> 
        : 
        <Output
          onTransition={this.handleTransition} 
          currentId={this.state.currentId} 
          courses={this.state.courses} 
          maxFour={this.state.maxFour} 
          balance={this.state.balance}
        />}
      </div>
    );
  }
}

export default App