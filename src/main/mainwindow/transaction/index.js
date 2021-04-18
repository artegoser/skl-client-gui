const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");

window.onload = () => {
  const socket = io("http://artegoser.tplinkdns.com:9191");
  socket.emit("autorisation", {name:localStorage.getItem("login"), password:localStorage.getItem("password")});
  socket.on("logstate", (data)=>{
    $("#info").html(data.message)
  });
  $("#send").on("click",()=>{
    socket.emit("transaction", {
      sender: localStorage.getItem("login"),
      recipient: $("#recipient").val(),
      amount:parseFloat($("#amount").val())})
  });
  socket.on("transactionstate", (data)=>{
    if (data.state == true){
      $("#info").css({color: "green",});
    } else{
        $("#info").css({color: "red",});
    }
    $("#info").html(data.message)
  });
};