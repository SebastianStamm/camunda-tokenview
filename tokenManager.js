let viewer;
let processedCount = 0;
let ongoingActivities = {};

window.tokenManager = (id, v) => {
  window.tokens = [];
  window.tokenManagerInstance = id;
  processedCount = 0;
  ongoingActivities = {};
  viewer = v;
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
        sorting: [{
          sortBy: "startTime",
          sortOrder: "asc"
        }, {
          sortBy: "occurrence",
          sortOrder: "asc"
        }]
      })
    });

    processResponse(await response.json());
  }
}, 1000)



window.tokens = [];
function processResponse(response) {
  response.forEach(entry => {
    if(ongoingActivities[entry.id] && entry.endTime) {
      ongoingActivities[entry.id].open = true;
      delete ongoingActivities[entry.id];
    }
  });

  while(processedCount < response.length) {
    process(response[processedCount]);
    processedCount++;
  }

  tokens.forEach(token => {
    // kill all open tokens
    if(token.open) {
      token.open = false;
      token.dead = true;
    }
  });
}

function process(entry) {
  // look for an open token
  let token = window.tokens.find(token => {
    // find a token that is
    // a) open
    // b) in a flow node that is before the current node

    const currentActivity = viewer.get('elementRegistry').get(token.life[token.life.length - 1].activityId);
    const nextActivity = viewer.get('elementRegistry').get(entry.activityId);

    return token.open && currentActivity.outgoing.map(connection => connection.businessObject.targetRef.id).includes(nextActivity.id);
  });

  if(!token) {
    // if there is a previous activity, we should create it there
    const prevActivity = viewer.get('elementRegistry').get(entry.activityId).incoming[0];

    if(prevActivity) {
      token = {
        open: false,
        life: [{
          activityId: prevActivity.businessObject.sourceRef.id
        }]
      };
    } else {
      token = {
        open: false,
        life: []
      };
    }

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
