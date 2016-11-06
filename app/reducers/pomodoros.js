import * as ActionTypes from '../constants/ActionTypes';

const initialState = [{
  text: 'Init 0',
  completed: false,
  id: 0,
  remainingTime: 0,
  startedAt: 0,
}];

const actionsMap = {
  [ActionTypes.START_POMODORO](state, action) {
    return [{
      id: state.reduce((maxId, pomodoro) => Math.max(pomodoro.id, maxId), -1) + 1,
      completed: false,
      text: action.text,
      startedAt: new Date().getTime(),
      remainingTime: 25*60,
    }, ...state];
  },
  [ActionTypes.STOP_POMODORO](state, action) {
    return state.map((pomodoro, idx) =>
      (idx === 0 ?
        Object.assign({}, pomodoro, { remainingTime: 0 }) :
        pomodoro)
    );
  },
  [ActionTypes.UPDATE_POMODORO](state, action) {
    return state.map((pomodoro, idx) =>
      (idx === 0 ?
        Object.assign({}, pomodoro, { remainingTime: 25*60 - (new Date().getTime() - pomodoro.startedAt)/1000 }) :
        pomodoro)
    );
  },
};

export default function pomodoros(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
