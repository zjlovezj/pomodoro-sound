const bluebird = require('bluebird');

global.Promise = bluebird;

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);
promisifyAll(chrome.storage, [
  'local',
]);

require('./background/contextMenus');
require('./background/inject');
require('./background/badge');

function updateTime () {
  chrome.storage.local.get('state', (obj) => {
    const { state } = obj;
    if(!!!state) {
      return
    }
    const initialState = JSON.parse(state || '{}');
// alert(JSON.stringify(initialState))
    const newState = initialState.pomodoros.map((pomodoro, idx) => {
      // alert(pomodoro)
        if(idx === 0) {
          let e = 25*60 - (new Date().getTime() - pomodoro.startedAt)/1000
          if(e < 0) {
            e = 0
          }
          // alert(e)
          return Object.assign({}, pomodoro, { remainingTime: e}) 
        } else {
          return pomodoro;
        }
    });

    // const pomodoro = initialState[0]
    // alert(pomodoro)
    // let e = 25*60 - (new Date().getTime() - pomodoro.startedAt)/1000
    // if(e < 0) {
    //   e = 0
    // }
    // pomodoro.remainingTime = e

    // const newState = initialState
    // alert(JSON.stringify(newState))

    
    chrome.storage.local.set({ state: JSON.stringify({pomodoros: newState}) });
    // alert(JSON.stringify(newState))
  });
}

setInterval(updateTime, 200)
// setInterval(() => alert(1), 1000)
