const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");
window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");
  $("#get").on("click", (evt) => {
    $("#transact").empty();
    let login = $("#user").val();
    socket.emit("balance", login);
    socket.emit("transactions", login);
    socket.on("usbalance", (data)=>{
      $("#balance").html("Balance:"+data);
    });
    socket.on("usertransactions", (data)=>{
      for(let i = 0; i<data.length; i++){
        $("#transact").append("<p>"+data[i]+"</p>")
      }
    });
  });
};