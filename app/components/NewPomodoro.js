import React, { Component, PropTypes } from 'react';
import style from './NewPomodoro.css';

export default class NewPomodoro extends Component {

  static propTypes = {
    pomodoros: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { filter: 0, processing: false, minutes: 0, seconds: 0,};
  }

  startOrStopPomodoro = () => {
    if(this.props.pomodoros[0].remainingTime <= 0) {
      this.props.actions.startPomodoro('new pomo')
      // this.timer = setInterval(this.props.actions.updatePomodoro, 1000)
    } else if(this.props.pomodoros[0].remainingTime > 0) {
      this.props.actions.stopPomodoro('new pomo')
      // clearInterval(this.timer)
    } 
  };

  componentDidMount() {
    this.timer = setInterval(() => {

      const firstPomodoro = this.props.pomodoros[0];
      let e = 25*60 - (new Date().getTime() - firstPomodoro.startedAt)/1000
      if(e < 0) {
        e = 0
      }
      if(firstPomodoro.stopped) {
        e = 0
      }
      //.padStart(2, 0)
      let minutes = Math.floor(e/60)
      minutes = minutes >= 10 ? minutes : '0'+minutes
      let seconds = Math.floor(e%60)
      seconds = seconds >= 10 ? seconds : '0'+seconds

      this.setState({minutes, seconds});
    }, 200)
  }
  
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { pomodoros, actions } = this.props;

    let btnText = ''
    if(this.props.pomodoros[0].remainingTime <= 0) {
      btnText = 'Start'
    } else {
      btnText = 'Stop'
    }

    return (
      <section className={style.main}>
        <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <button style={{fontSize: 24, margin: 20, color: 'blue'}} onClick={this.startOrStopPomodoro}>{btnText}</button>
        </div>
        <h1>{this.state.minutes}:{this.state.seconds}</h1>
      </section>
    );
  }
}
