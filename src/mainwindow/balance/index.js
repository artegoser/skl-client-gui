const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const localStorage = require("../../modules/localStorage");
const options = require("../../modules/options");

window.onload = () => {
  $("#get").on("click", (evt) => {
      $("#transact").empty();
      $("#login").html("User:"+localStorage.getItem("login"));
      let me = {
          "type":"balance",
          "message":{"user": $("#user").val()}
          }
      let message = Buffer.from(JSON.stringify(me));
      client.send(message, options.port, options.ip, (err) => {
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

      const client2 = dgram.createSocket("udp4");
      me = {
        "type":"transactions",
        "message":{"user": $("#user").val()}
      }
      message = Buffer.from(JSON.stringify(me));

      client2.send(message, options.port, options.ip, (err) => {
        if (err) {
          console.log(err);
          $("#warn").html(err);
        }
      });
      client2.on("message", function (message, remote) {
        let resp = message.toString();
        console.log(resp)
        $("#transact").append("<p>"+resp+"</p>")
      });
    });
};