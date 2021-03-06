import React, { Component } from 'react';
import Input from './screens/Input';
import PreCoReq from './screens/PreCoReq';
import PreCoReq2 from './screens/PreCoReq2';
import Output from './screens/Output';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  state = {
    screen: "input",
    currentId: 1,
    courses: [],
    tenMinGap: true,
    maxFour: true,
    balance: false,
    quarters: ["fall", "winter", "spring"],
    dows: ["M", "Tu", "W", "Th", "F"]
  }

  // Functions to toggle between various components screens
  handleMajorTransition = (screen, currentId, courses, maxFour, balance) => {
    this.setState({ screen, currentId, courses, maxFour, balance });
  };

  // See previous comment
  handleMinorTransition = (screen, courses) => {
    this.setState({ screen, courses });
  }

  render() {
    const screen = this.state.screen;
    let displayScreen;
    if (screen === "input") {
      displayScreen = <Input 
                        onTransition={this.handleMajorTransition} 
                        currentId={this.state.currentId} 
                        courses={this.state.courses} 
                        tenMinGap={this.state.tenMinGap}
                        maxFour={this.state.maxFour} 
                        balance={this.state.balance}
                      />;
    } else if (screen === "preCoReq") {
      displayScreen = <PreCoReq 
                        onTransition={this.handleMinorTransition}
                        courses={this.state.courses}
                      />;
    } else if (screen === "preCoReq2") {
      displayScreen = <PreCoReq2
                        onTransition={this.handleMinorTransition}
                        courses={this.state.courses}
                      />;
    } else {
      displayScreen = <Output
                        onTransition={this.handleMinorTransition} 
                        currentId={this.state.currentId} 
                        courses={this.state.courses} 
                        tenMinGap={this.state.tenMinGap}
                        maxFour={this.state.maxFour} 
                        balance={this.state.balance}
                      />;
    };

    return (
      <div className="global">
        <h1 style={{marginTop: "1%"}}>AutoSchedule</h1>
        <hr className="hr"/>
        {displayScreen}
      </div>
    );
  }
}

export default App