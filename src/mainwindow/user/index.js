const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const localStorage = require("../../modules/localStorage");

window.onload = () => {
    $("#login").html("User:"+localStorage.getItem("login"));
    let me = {
        "type":"balance",
        "message":{"user":localStorage.getItem("login")}
        }
    let message = Buffer.from(JSON.stringify(me));
    client.send(message, 9191, "artegoser.tplinkdns.com", (err) => {
      if (err) {
        console.log(err);
        $("#warn").html(err);
      }
    });
    client.on("message", function (message, remote) {
        console.log(message.toString());
        let resp = message.toString();
        $("#balance").html("Balance:"+resp);
    });
};