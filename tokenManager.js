window.tokenManager = id => {
  window.tokenManagerInstance = id;
}

window.setInterval(async () => {
  if(window.tokenManagerInstance) {
    const response = await fetch('/camunda/api/engine/engine/default/history/activity-instance', {
      credentials: 'include',
      method: 'POST',
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        processInstanceId: window.tokenManagerInstance,
        "sorting":
        [{"sortBy": "startTime",
        "sortOrder": "asc"
        }]
      })
    });

    processResponse(await response.json());
  }
}, 1000)


let processedCount = 0;
let ongoingActivities = {};
window.tokens = [];
function processResponse(response) {
  response.forEach(entry => {
    if(ongoingActivities[entry.id] && entry.endTime ) {
      ongoingActivities[entry.id].open = true;
      delete ongoingActivities[entry.id];
    }
  });

  while(processedCount < response.length) {
    process(response[processedCount]);
    processedCount++;
  }
}

function process(entry) {
  // look for an open token
  let token = window.tokens.find(token => token.open);

  if(!token) {
    token = {
      open: false,
      life: []
    };
    window.tokens.push(token);
  }

  token.life.push(entry);
  token.open = false;

  if(entry.endTime) {
    token.open = true;
  } else {
    ongoingActivities[entry.id] = token;
  }
}
