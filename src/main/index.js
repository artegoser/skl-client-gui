const localStorage = require("../modules/localStorage");
const $ = require("Jquery");
window.onload = () => {
    const socket = io("http://artegoser.tplinkdns.com:9191");

    $("#login").val(localStorage.getItem("login"));
    $("#password").val(localStorage.getItem("password"));

    socket.emit("ping");
    socket.on("pong", ()=>{
        $("#check").html("Server online!");
        $("#check").css({color:"green"});
    });
    
    let logmessage = {};
    logmessage.type = "autorisation";
    $("#reg").on("click", () => {
        logmessage.type = "register";
        $("#text").html("registration");
    });

    $("#aut").on("click", () => {
        logmessage.type = "autorisation";
        $("#text").html("autorisation");
    });

    $("#sig").on("click", () => {
        logmessage.name = $("#login").val();
        logmessage.password = $("#password").val();
        localStorage.setItem("login", logmessage.name);
        localStorage.setItem("password", logmessage.password);

        socket.emit(logmessage.type, {name:logmessage.name, password:logmessage.password});
        
    });

    socket.on("logstate", (data)=>{
        if (data.state == true){
            $("#warn").css({color: "green",});
            document.location.replace("./mainwindow/index.html");
        } else{
            $("#warn").css({color: "red",});
        }
        $("#warn").html(data.message);
    
    });
};