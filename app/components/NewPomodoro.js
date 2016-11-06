import React, { Component, PropTypes } from 'react';
import style from './NewPomodoro.css';

export default class NewPomodoro extends Component {

  static propTypes = {
    pomodoros: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { filter: 0, processing: false, };
  }

  handleClearCompleted = () => {
    const atLeastOneCompleted = this.props.pomodoros.some(pomodoro => pomodoro.completed);
    if (atLeastOneCompleted) {
      this.props.actions.clearCompleted();
    }
  };

  startOrStopPomodoro = () => {
    if(this.props.pomodoros[0].remainingTime <= 0) {
      this.props.actions.startPomodoro('new pomo')
      // this.timer = setInterval(this.props.actions.updatePomodoro, 1000)
    } else if(this.props.pomodoros[0].remainingTime > 0) {
      this.props.actions.stopPomodoro('new pomo')
      // clearInterval(this.timer)
    } 
  };

  // componentWillUnmount() {
  //   clearInterval(this.timer)
  // }

  render() {
    const { pomodoros, actions } = this.props;

    const firstPomodoro = pomodoros[0];

    let btnText = ''
    if(this.props.pomodoros[0].remainingTime <= 0) {
      btnText = 'Start'
    } else {
      btnText = 'Stop'
    }

    //.padStart(2, 0)
    const minutes = Math.floor(firstPomodoro.remainingTime/60)
    const seconds = Math.floor(firstPomodoro.remainingTime%60)

    return (
      <section className={style.main}>
        <h3>remaining time: {minutes}:{seconds}</h3>
        <button onClick={this.startOrStopPomodoro}>{btnText}</button>
      </section>
    );
  }
}
