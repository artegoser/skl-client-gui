const localStorage = require("../../../modules/localStorage");
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
        $("#info").html("")
        $("#info").append("Цена за "+$("#amount").val()+" SKL "+data+" RUB</br>")
        $.getJSON("https://www.cbr-xml-daily.ru/daily_json.js", (course)=>{
            let EUR = course.Valute.EUR.Value;
            let USD = course.Valute.USD.Value;
            EUR = data/EUR*parseFloat($("#amount").val());
            USD = data/USD*parseFloat($("#amount").val());
            $("#info").append("Цена за "+$("#amount").val()+" SKL "+USD+" USD</br>")
            $("#info").append("Цена за "+$("#amount").val()+" SKL "+EUR+" EUR</br>")
        });
        
    });

    socket.on("skfond", (data)=>{
        $("#allskl").html("Всего в Слингонии "+data.allskl+" склионов");
        $("#allrub").html("Всего в фонде Слингонии "+data.allrub+" рублей");
    });
}