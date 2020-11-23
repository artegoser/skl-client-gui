const dgram = require("dgram");
const $ = require("Jquery");

const client = dgram.createSocket("udp4");

window.onload = function() {
  let me = {
    type: "autorisation",
    message: { name: $("#login").val(), password: $("#password").val() },
  };

  $("#reg").on("click", (evt) => {
    me.type = "register"
    $("#text").html("registration") 
  });

  $("#aut").on("click", (evt) => {
    me.type = "autorisation"
    $("#text").html("autorisation")
  });
    
  $("#sig").on("click", (evt) => {
    me.message.name = $("#login").val()
    me.message.password = $("#password").val()

    let message = Buffer.from(JSON.stringify(me));
    client.send(message, 9191, "artegoser.tplinkdns.com", (err) => {
      //console.log(err)
    });
  
    client.on("message", function (message, remote) {
      console.log(message.toString());
      let resp = message.toString()
    });
  });
  
  
};
