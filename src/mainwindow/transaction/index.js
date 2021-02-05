const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const localStorage = require("../../modules/localStorage");
const options = require("../../modules/options");

window.onload = () => {
  
    let me = {
        type: "autorisation",
        message: { name: localStorage.getItem("login"), password: localStorage.getItem("password") },
    };
    let message = Buffer.from(JSON.stringify(me));
    client.send(message, options.port, options.ip, (err) => {
      if (err) {
        console.log(err);
        $("#info").html(err);
      }
    });
    $("#send").on("click", (evt) => {
        me = {
        type:"transaction",
        message:{sender: localStorage.getItem("login"), 
                 recipient: $("#recipient").val(), 
                 amount: parseFloat($("#amount").val())}
        }

        let message = Buffer.from(JSON.stringify(me));
        client.send(message, options.port, options.ip, (err) => {
            if (err) {
                console.log(err);
                $("#warn").html(err);
              }
        });
    });

    client.on("message", function (message, remote) {
        let resp = message.toString();
        $("#info").html(resp)
    });
};