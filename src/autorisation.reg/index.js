const dgram = require("dgram");
const $ = require("Jquery");
const client = dgram.createSocket("udp4");
const checker = dgram.createSocket("udp4");
const localStorage = require("../modules/localStorage");
const options = require("../modules/options");

window.onload = () => {
  //localStorage.removeItem("login")
  //localStorage.removeItem("password")
  //localStorage.removeItem("autorisation")

  $("#login").val(localStorage.getItem("login"));
  $("#password").val(localStorage.getItem("password"));
  let me = {
    type: "autorisation",
    message: { name: $("#login").val(), password: $("#password").val() },
  };

  $("#reg").on("click", (evt) => {
    me.type = "register";
    $("#text").html("registration");
  });

  $("#aut").on("click", (evt) => {
    me.type = "autorisation";
    $("#text").html("autorisation");
  });

  $("#sig").on("click", (evt) => {
    me.message.name = $("#login").val();
    me.message.password = $("#password").val();
    
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
      if (resp === "Вы вошли!") {
        $("#warn").css({
          color: "green",
        });

        if ($("#autoin").is(":checked")) {
          localStorage.setItem("autorisation", "1");
        }

        localStorage.setItem("login", $("#login").val());
        localStorage.setItem("password", $("#password").val());

        $("#warn").html(resp);
        document.location.replace("../mainwindow/index.html");
      } else {
        $("#warn").html(resp);
      }
    });
  });

  let mes = {
    type: "check",
    message: ""
  };

  let check = Buffer.from(JSON.stringify(mes));
  
  checker.send(check, options.port, options.ip, (err) => {
    if (err) {
      console.log(err);
      $("#warn").html(err);
    }
  });

  checker.on("message", function (check, remote) {
    console.log(check.toString());
    let resp = check.toString();

    $("#check").css({
      color: "green",
    });
    $("#check").html(resp);
    
  });

};
