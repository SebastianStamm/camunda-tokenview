let viewer;
let ongoingActivities = {};

let queryOffset = '2017-09-19T13:22:01.058+0200';
const processedMap = new Set();

window.tokenManager = (id, v) => {
  window.tokens = [];
  window.tokenManagerInstance = id;
  ongoingActivities = {};
  viewer = v;
};

window.setInterval(async () => {
  if (window.tokenManagerInstance) {
    const response = await fetch(
      "/camunda/api/engine/engine/default/history/activity-instance",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-XSRF-TOKEN": document.cookie.split("=")[1]
        },
        body: JSON.stringify({
          processInstanceId: window.tokenManagerInstance,
          startedAfter: queryOffset,
          sorting: [
            {
              sortBy: "startTime",
              sortOrder: "asc"
            },
            {
              sortBy: "occurrence",
              sortOrder: "asc"
            }
          ]
        })
      }
    );

    processResponse(await response.json());
  }
}, 1000);

window.tokens = [];
function processResponse(response) {
  let progression = true;

  response.forEach(entry => {
    if(progression && entry.endTime) {
      queryOffset = entry.startTime;
    }
    if(!entry.endTime) {
      progression = false;
    }
    if (ongoingActivities[entry.id] && entry.endTime) {
      ongoingActivities[entry.id].open = true;
      delete ongoingActivities[entry.id];
    }

    if(!processedMap.has(entry.id)) {
      process(entry);
      processedMap.add(entry.id);
    }
  });

  tokens.forEach(token => {
    // kill all open tokens
    if (token.open) {
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

    const currentActivity = viewer
      .get("elementRegistry")
      .get(token.life[token.life.length - 1].activityId);
    const nextActivity = viewer.get("elementRegistry").get(entry.activityId);

    return (
      token.open &&
      currentActivity.outgoing
        .map(connection => connection.businessObject.targetRef.id)
        .includes(nextActivity.id)
    );
  });

  if (!token) {
    // if there is a previous activity, we should create it there
    const prevActivity = viewer.get("elementRegistry").get(entry.activityId)
      .incoming[0];

    if (prevActivity) {
      token = {
        open: false,
        life: [
          {
            activityId: prevActivity.businessObject.sourceRef.id
          }
        ]
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

  if (entry.endTime) {
    token.open = true;
  } else {
    ongoingActivities[entry.id] = token;
  }
}
