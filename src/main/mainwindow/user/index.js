const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");
window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");
  let login = localStorage.getItem("login");
  $("#login").html("User:"+login);
  socket.emit("balance", login);
  socket.emit("transactions", login);
  socket.emit("checkchain");
  socket.on("usbalance", (data)=>{
    $("#balance").html("Balance:"+data);
  });
  socket.on("usertransactions", (data)=>{
    for(let i = 0; i<data.length; i++){
      $("#transact").append("<p>"+data[i]+"</p>")
    }
  });
  socket.on("chcheck", (data)=>{
    $("#chaincheck").html("Chain:"+data);
    if(data=="Chain is ok!"){
      $("#chaincheck").css({color: "green",});
    }
  });
};