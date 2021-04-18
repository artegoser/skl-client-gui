const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");

window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");
  let login = localStorage.getItem("login");
  $("#login").html("Логин:"+login);
  socket.emit("autorisation", {name:localStorage.getItem("login"), password:localStorage.getItem("password")});
  socket.emit("balance", login);
  socket.emit("transactions", login);
  socket.emit("checkchain");

  socket.on("usbalance", (data)=>{
    $("#balance").html("Баланс:"+data);
  });
  socket.on("usertransactions", (data)=>{
    for(let i = 0; i<data.length; i++){
      $("#transact").append("<div id=\"block\"><p>"+data[i]+"</p></div>")
    }
  });
  socket.on("chcheck", (data)=>{
    $("#chaincheck").html("Блокчейн:"+data);
    if(data=="Блокчейн не был изменен!"){
      $("#chaincheck").css({color: "green",});
    }
  });
};