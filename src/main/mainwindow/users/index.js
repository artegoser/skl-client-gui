const $ = require("Jquery");

window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");

  let users = [];
  socket.emit("getusers");
  socket.on("users", data=>{
    users = data
    for(let i = 0; i<users.length; i++){
      $("#users").append(`<a href="../balance/index.html?user=${users[i]}"><div id="block">${users[i]}</div></a>`);
    }
  })

  $("#search").on("click", () => {
    $("#users").html("");
    users.forEach(i=>{
      if (i.search($("#user").val()) != -1) {
        $("#users").append(`<a href="../balance/index.html?user=${i}"><div id="block">${i.replace($("#user").val(), `<span id="light">${$("#user").val()}</span>`)}</div></a>`);
      }
    });
  });
};