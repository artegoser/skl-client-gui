const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const client2 = dgram.createSocket("udp4");
const client3 = dgram.createSocket("udp4");
const localStorage = require("../../modules/localStorage");
const options = require("../../modules/options");

window.onload = () => {
    $("#update").on("click", (evt) => {
        if ($("#amount").val() !== ""){
            
            let me = {
                "type":"allskl",
                "message":{}
            }

            let message = Buffer.from(JSON.stringify(me));

            client2.send(message, options.port, options.ip, (err) => {
                if (err) {
                    console.log(err);
                    $("#info").html(err);
                }
            });

            me = {
                "type":"allrub",
                "message":{}
            }

            message = Buffer.from(JSON.stringify(me));

            client3.send(message, options.port, options.ip, (err) => {
                if (err) {
                    console.log(err);
                    $("#info").html(err);
                }
            });


            me = {
                type:"cost",
                message:{amount: parseFloat($("#amount").val()) }
            }
            message = Buffer.from(JSON.stringify(me));
            client.send(message, options.port, options.ip, (err) => {
            if (err) {
                console.log(err);
                $("#info").html(err);
            }
        
            });
        }
    });

    client.on("message", function (message, remote) {
        let resp = message.toString();
        resp = resp.replace(new RegExp ("SKL_coin", "g"), "SKL_coin<br>")
        $("#info").html(resp)
    });

    client2.on("message", function (message, remote) {
        let resp = message.toString();
        $("#allskl").html(resp)
    });

    client3.on("message", function (message, remote) {
        let resp = message.toString();
        $("#allrub").html(resp)
    });

}