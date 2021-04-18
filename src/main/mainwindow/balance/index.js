const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");

window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");

  const getparse = new URLSearchParams(window.location.search);
  let user = getparse.get('user');
  if(user){
    $("a").attr("href", "../users/index.html");
    $("#user").val(user)
    let login = $("#user").val();
    socket.emit("balance", login);
    socket.emit("transactions", login);
  }

  $("#get").on("click", () => {
    $("#transact").html("");
    let login = $("#user").val();
    socket.emit("balance", login);
    socket.emit("transactions", login);
  });

  socket.on("usbalance", (data)=>{
    $("#balance").html("Баланс:"+data);
  });
  socket.on("usertransactions", (data)=>{
    for(let i = 0; i<data.length; i++){
      $("#transact").append("<div id=\"block\"><p>"+data[i]+"</p></div>")
    }
  });

};