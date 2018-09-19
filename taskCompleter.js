let completerRunning = false;

document.body.addEventListener("keydown", ({ key }) => {
  if (key === "F7") {
    completerRunning = !completerRunning;
  }
});

window.setInterval(async () => {
  if (completerRunning) {
    const id = document.querySelector("dd.instance-id").textContent.trim();
    const response = await fetch(
      "/camunda/api/engine/engine/default/task/count",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-XSRF-TOKEN": document.cookie.split("=")[1]
        },
        body: JSON.stringify({
          processInstanceId: id
        })
      }
    );

    const numRes = (await response.json()).count;

    const taskId = (await (await fetch(
      "/camunda/api/engine/engine/default/task?firstResult=" +
        ~~(Math.random() * numRes) +
        "&maxResults=1",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-XSRF-TOKEN": document.cookie.split("=")[1]
        },
        body: JSON.stringify({
          processInstanceId: id
        })
      }
    )).json())[0].id;

    fetch("/camunda/api/engine/engine/default/task/" + taskId + "/complete", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-XSRF-TOKEN": document.cookie.split("=")[1]
      },
      body: JSON.stringify({
        variables: {
          cloak: { value: Math.random() > 0.5 ? true : false, type: "Boolean" },
          tutorial: {
            value: Math.random() > 0.5 ? true : false,
            type: "Boolean"
          },
          next: { value: Math.random() > 0.5 ? true : false, type: "Boolean" },
          talks: { value: Math.random() > 0.5 ? true : false, type: "Boolean" },
          boat: { value: Math.random() > 0.5 ? true : false, type: "Boolean" },
          home: { value: Math.random() > 0.5 ? true : false, type: "Boolean" }
        }
      })
    });
  }
}, 1000);
