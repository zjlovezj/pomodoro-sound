function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

// todos unmarked count
function setBadge(pomodoros) {
  if (chrome.browserAction) {
    // const count = pomodoros.filter(pomodoro => !pomodoro.marked).length;
    const remainingTime = pomodoros[0].remainingTime;
    chrome.browserAction.setBadgeText({ text: remainingTime > 0 ? Math.ceil(remainingTime/60).toString() : '' });
  }
}



export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.pomodoros);
    });
    return store;
  };
}
