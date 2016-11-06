import * as types from '../constants/ActionTypes';

export function startPomodoro(text) {
  return { type: types.START_POMODORO, text };
}

export function stopPomodoro(id) {
  return { type: types.STOP_POMODORO, id };
}

export function updatePomodoro(id) {
  return { type: types.UPDATE_POMODORO, id };
}
