chrome.storage.local.get('pomodoros', (obj) => {
  let pomodoros = obj.pomodoros;
  if (pomodoros) {
    pomodoros = JSON.parse(pomodoros);
    const len = pomodoros.filter(pomodoro => !pomodoro.marked).length;
    if (len > 0) {
      chrome.browserAction.setBadgeText({ text: len.toString() });
    }
  } else {
    // Initial
    chrome.browserAction.setBadgeText({ text: '' });
  }
});

let previousAnnounceTime = 25*60+3; // because we want to announce game begins

function makeSound(pomodoros) {

  const remainingTime = pomodoros[0].remainingTime;
  if(remainingTime <= 0) {
    return
  }

  const minutes = Math.floor(remainingTime/60)
  const seconds = Math.floor(remainingTime%60)

  const TOTAL = 25*60
  if(remainingTime > TOTAL - 1 || 
    (minutes%5 === 0 && seconds === 0 ) ||
    (minutes === 15 && seconds === 0 ) ||
    (minutes === 5 && seconds === 0 ) ||
    (minutes === 1 && seconds === 0 ) ||
    (minutes === 0 && seconds === 30 ) ||
    (minutes === 0 && seconds === 10 ) ||
    (minutes === 0 && seconds === 5 )  ||
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
    msg.text = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} and ${seconds} ${seconds > 1 ? 'seconds' : 'second'} left` ;
    if(seconds === 0) {
      msg.text = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} left` ;
    }
  } else {
    msg.text = `${seconds} ${seconds > 1 ? 'seconds' : 'second'}` ;
  }

  if(remainingTime > TOTAL - 1) {
    msg.text = 'Game begins!'
  }
  if(remainingTime <= 1 && remainingTime > 0) {
    msg.text = 'Game over! You are the best!'
  }

  if( previousAnnounceTime - remainingTime < 1 && previousAnnounceTime > remainingTime)
    return;

  speechSynthesis.speak(msg);
  previousAnnounceTime = remainingTime

  //voices.forEach((i,j) => console.log(i.lang+", index: " + j + ", localService: " + i.localService))
}

chrome.storage.onChanged.addListener(() => {
  // alert('in onChanged');
  chrome.storage.local.get('state', (obj) => {
    
    const { state } = obj;
    if(!!!state) {
      return
    }
    const initialState = JSON.parse(state);
    let pomodoros = initialState.pomodoros;
    // alert(pomodoros)
    if (pomodoros) {
      const remainingTime = pomodoros[0].remainingTime;
      chrome.browserAction.setBadgeText({ text: remainingTime > 0 ? Math.ceil(remainingTime/60).toString() : '' });
      makeSound(pomodoros)
    } else {
      // Initial
      chrome.browserAction.setBadgeText({ text: '' });
    }
  });
})
