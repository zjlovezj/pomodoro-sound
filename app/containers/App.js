import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import style from './App.css';
import NewPomodoro from '../components/NewPomodoro';
import * as PomodoroActions from '../actions/pomodoros';

@connect(
  state => ({
    pomodoros: state.pomodoros,
  }),
  dispatch => ({
    actions: bindActionCreators(PomodoroActions, dispatch),
  })
)
export default class App extends Component {

  static propTypes = {
    pomodoros: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { pomodoros, actions } = this.props;

    return (
      <div className={style.normal}>
        <NewPomodoro pomodoros={pomodoros} actions={actions} />
      </div>
    );
  }
}
