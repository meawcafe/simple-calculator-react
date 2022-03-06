import './App.css';
import { Component } from "react";
import '../root.css';
import Button from "./button";
import Dot from "./dot";

const initialState = {
  displayResult: '0',
  displayCalc: '',
  clearDisplay: false,
  waitForOp: true,
  waitForFloat: true,
  readyToCalc: false
}

export default class App extends Component {
  state = {...initialState}

  constructor(props) {
    super(props)
    
    this.clearMemory = this.clearMemory.bind(this)
    this.setOperation = this.setOperation.bind(this)
    this.addDigit = this.addDigit.bind(this)
  }

  clearMemory() {
    this.setState({...initialState})
  }

  replaceOpEval(text) {
    return text.replace('x', '*').replace('÷', '/')
  }
  
  setOperation(operation) {
    let currentValue = this.state.displayResult
    let displayCalc = this.state.displayCalc
    let displayResult;
    
    if (this.state.clearDisplay) {
      displayCalc = ''
      this.setState({ displayCalc: currentValue, clearDisplay: false })
    }

    if (currentValue === '?') {currentValue = '0'}
    
    if (!this.state.waitForOp) { return }

    if (operation === '=' && this.state.readyToCalc) {
      displayResult = eval(this.replaceOpEval(displayCalc + currentValue)).toString()
      if (displayResult === 'Infinity') { displayResult = '?' }
      this.setState({ displayResult: displayResult ? displayResult : '0',
                      displayCalc: displayCalc + currentValue + "=", clearDisplay: true })
    }

    if (operation !== '=') {
      displayResult = currentValue + operation
      this.setState({ waitForOp: false, readyToCalc: false, waitForFloat: true,
                      displayCalc: displayCalc += displayResult, displayResult: '0' })
    }
  }
  
  addDigit(n) {
    let clearDisplay = this.state.clearDisplay
    let currentValue = this.state.displayResult
    let displayResult;

    if (clearDisplay) {
      currentValue = '0'
      this.setState({ clearDisplay: false, displayCalc: '' })
    }

    if (currentValue === '?') {currentValue = '0'}

    if (n === '⌫') {
      displayResult = currentValue.slice(0, -1)
      
      return this.setState({ displayResult: displayResult ? displayResult : '0',
                             waitForOp: isNaN(currentValue.slice(-2).slice(0, 1)) ? false : true,
                             readyToCalc: true,
                             waitForFloat: currentValue.slice(-2).slice(0, -1) === '.' ? false : true })
    }

    if (n === '.') {
      if (this.state.waitForOp && this.state.waitForFloat) {
        displayResult = currentValue + n
        this.setState({ waitForFloat: false })
      }
      else { return }
    } else {
      if (currentValue === '0' && currentValue.length === 1) { currentValue = '' }
      displayResult = currentValue + n
    }

    this.setState({ displayResult: displayResult ? displayResult : '0', waitForOp: true, readyToCalc: true, currentValue: false })
  }


  render() {
    return (
      <div className="App">
        <div id="display">
          <div id="window-handle">
            <Dot />
            <Dot />
            <Dot />
            <div id="display-calc">{this.state.displayCalc}</div>
          </div>
          <div id="display-content">{this.state.displayResult}</div>
        </div>
        <div id="keyboard">
          <Button label="AC" btnClass="btn-span-2" click={this.clearMemory} />
          <Button label="⌫" click={this.addDigit} />
          <Button label="÷" btnClass="operations" click={this.setOperation} />
          <Button label="7" click={this.addDigit} />
          <Button label="8" click={this.addDigit} />
          <Button label="9" click={this.addDigit} />
          <Button label="x" btnClass="operations" click={this.setOperation} />
          <Button label="4" click={this.addDigit} />
          <Button label="5" click={this.addDigit} />
          <Button label="6" click={this.addDigit} />
          <Button label="-" btnClass="operations" click={this.setOperation} />
          <Button label="1" click={this.addDigit} />
          <Button label="2" click={this.addDigit} />
          <Button label="3" click={this.addDigit} />
          <Button label="+" btnClass="operations" click={this.setOperation} />
          <Button label="0" btnClass="btn-span-2" click={this.addDigit} />
          <Button label="." click={this.addDigit} />
          <Button label="=" btnClass="operations" click={this.setOperation} />
        </div>
      </div>
    );
  }
}