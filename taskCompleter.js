let completerRunning = false;

document.body.addEventListener("keydown", ({ key }) => {
  if (key === "F7") {
    completerRunning = !completerRunning;
  }
});

window.setInterval(async () => {
  if (completerRunning) {
    const response = await fetch("/camunda/api/engine/engine/default/task", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-XSRF-TOKEN": document.cookie.split("=")[1]
      },
      body: JSON.stringify({
        name: "Bouncer"
      })
    });

    const json = await response.json();

    json.forEach(({ id }) => {
      fetch("/camunda/api/engine/engine/default/task/" + id + "/complete", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "X-XSRF-TOKEN": document.cookie.split("=")[1]
        },
        body: JSON.stringify({
          variables: {}
        })
      });
    });
  }
}, 2000);
