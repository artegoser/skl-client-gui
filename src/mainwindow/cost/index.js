const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const localStorage = require("../../modules/localStorage");

window.onload = () => {
    $("#update").on("click", (evt) => {
        let me = {
            type:"cost",
            message:{amount: parseFloat($("#amount").val()) }
        }
        let message = Buffer.from(JSON.stringify(me));
        client.send(message, 9191, "artegoser.tplinkdns.com", (err) => {
        if (err) {
            console.log(err);
            $("#info").html(err);
        }
    });
    client.on("message", function (message, remote) {
        let resp = message.toString();
        resp = resp.replace(new RegExp ("SKL_coin", "g"), "SKL_coin<br>")
        $("#info").html(resp)
    });
    });
}