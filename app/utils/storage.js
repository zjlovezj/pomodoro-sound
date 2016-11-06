function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

// todos unmarked count
function setBadge(pomodoros) {
  if (chrome.browserAction) {
    // const count = pomodoros.filter(pomodoro => !pomodoro.marked).length;
    const remainingTime = pomodoros[0].remainingTime;
    chrome.browserAction.setBadgeText({ text: remainingTime > 0 ? Math.round(remainingTime/60).toString() : '' });
  }
}

// todos unmarked count
function makeSound(pomodoros) {

  const remainingTime = pomodoros[0].remainingTime;
  if(remainingTime <= 0) {
    return
  }

  const minutes = Math.floor(remainingTime/60)
  const seconds = Math.floor(remainingTime%60)

  const TOTAL = 25*60
  if(remainingTime > TOTAL - 1 || 
    (minutes === 15 && seconds === 0 ) ||
    (minutes === 5 && seconds === 0 ) ||
    (minutes === 1 && seconds === 0 ) ||
    (minutes === 0 && seconds === 30 ) ||
    (minutes === 0 && seconds === 10 ) ||
    (minutes === 0 && seconds === 5 ) ||
    (minutes === 0 && seconds === 1 )
  ) {

  } else {
    return; // mock unless
  }

  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[0]; // Note: some voices don't support altering params
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  if(minutes > 0) {
    msg.text = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} and ${seconds} ${seconds > 1 ? 'seconds' : 'second'}` ;
  } else {
    msg.text = `${seconds} ${seconds > 1 ? 'seconds' : 'second'}` ;
  }

  if(remainingTime > TOTAL - 1) {
    msg.text = 'Game begins!'
  }
  if(remainingTime <= 1 && remainingTime > 0) {
    msg.text = 'Game over!'
  }

  speechSynthesis.speak(msg);


  //voices.forEach((i,j) => console.log(i.lang+", index: " + j + ", localService: " + i.localService))
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.pomodoros);
      makeSound(state.pomodoros);
    });
    return store;
  };
}
