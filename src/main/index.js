const localStorage = require("../modules/localStorage");
const toastr = require("toastr");
const $ = require("Jquery");

window.onload = () => {
    const socket = io("http://artegoser.tplinkdns.com:9191");
	toastr.options = {
		"progressBar": true,
        "positionClass": "toast-bottom-center"
	}
	toastr.success("SKL_Client_Gui v1.2.2!")
	
    $("#login").val(localStorage.getItem("login"));
    $("#password").val(localStorage.getItem("password"));
    
    /*socket.emit("ping");
    socket.on("pong", ()=>{
        $("#check").html("Сервер работает!");
        $("#check").css({color:"green"});
    });*/
    
    let logmessage = {};
    logmessage.type = "autorisation";
    $("#reg").on("click", () => {
        logmessage.type = "register";
        $("#text").html("Регистрация");
        $("#sig").val("Зарегистрироваться");
    });

    $("#aut").on("click", () => {
        logmessage.type = "autorisation";
        $("#text").html("Авторизация");
        $("#sig").val("Войти");
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
            $("#warn").css({color: "green"});
            document.location.replace("./mainwindow/index.html");
        } else{
            $("#warn").css({color: "red",});
        }
        $("#warn").html(data.message);
    
    });
};