const $ = require("Jquery");
window.onload = () => {
    const socket = io("http://artegoser.tplinkdns.com:9191");
    socket.emit("fond");
    $("#update").on("click", () => {
        if ($("#amount").val() !== ""){
            socket.emit("cost", parseFloat($("#amount").val()));
        }
    });
    socket.on("sklcost", (data)=>{
        $("#info").html("Цена за "+parseFloat($("#amount").val())+" SKL "+parseFloat(data))
    });

    socket.on("skfond", (data)=>{
        $("#allskl").html("Всего в Слингонии "+data.allskl+" склионов");
        $("#allrub").html("Всего в фонде Слингонии "+data.allrub+" рублей");
    });
}