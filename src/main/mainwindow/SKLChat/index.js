const localStorage = require("../../../modules/localStorage");
const $ = require("Jquery");
const toastr = require("toastr");

function htmlspecialchars(html) {
    html = html.replace(/&/g, "&amp;");
    html = html.replace(/</g, "&lt;");
    html = html.replace(/>/g, "&gt;");
    html = html.replace(/"/g, "&quot;");
    return html;
}

function replacespec(text){
  let urlspec = new RegExp(/url\(.+\)/g);
  let imgspec = new RegExp(/img\(.*?\)/g);

  try{
    let img = text.match(imgspec);
    for(let i = 0; i<img.length; i++){
        text = text.replace(img[i], `</br><img src=${img[i].slice(4, -1)}></br>`);
    }
  } catch{}

  try{
    let url = text.match(urlspec);
    for(let i = 0; i<url.length; i++){
        text = text.replace(url[i], `<a href=${url[i].slice(4, -1)} title=${url[i].slice(4, -1)}>${url[i].slice(4, -1).slice(0, 50)}...</a>`)
    }
  } catch{}

  return text;
}

function addmessage(sender, message){
  $("#chat").append(`<div id="block"><p style="color:#bdbdbd">[${strftime()}] ${sender}</p><p>${message}</p>`);
  if ($("#scroll").prop("checked")) {
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;     
  }
}

function addmessages(array){
  for(let i = 0; i<array.length; i++){
    $("#chat").append(`<div id="block"><p style="color:#bdbdbd">[${array[i].time}] ${array[i].user}</p><p>${array[i].message}</p>`);
  }
  document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
}

function sendNotification(title, options={}) {
  options.icon = "http://artegoser.tplinkdns.com:9191/icon.jpg"
  if (!("Notification" in window)) {
    toastr.error('Ваш браузер не поддерживает HTML Notifications.');
  } else if (Notification.permission === "granted") {
    var notification = new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(title, options);
      } else {
        toastr.error('Вы запретили показывать уведомления');
      }
      });
  } else {
    toastr.error('Браузер запретил уведомления.</br>Чтобы включить вставьте http://artegoser.tplinkdns.com:9191</br><a href=chrome://flags/#unsafely-treat-insecure-origin-as-secure>Сюда(скопируйте ссылку)</a> и переключите кнопку в состояние enabled(эти действия нужны из-за того что у нас нет ssl сертификата)');
  }
}

function strftime(){
  let timestamp = Date.now();
  timestamp = String(timestamp).slice(0, 10)
  let date = new Date(timestamp * 1000),
      y = date.getFullYear(),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      d = ('0' + date.getDate()).slice(-2),
      h = date.getHours(),
      m = ('0' + date.getMinutes()).slice(-2),
      s = ('0' + date.getSeconds()).slice(-2)
  return `${d}.${month}.${y} ${h}:${m}:${s}`
}

window.onload = () => {
    toastr.options = {
      "progressBar": true,
    }

    let login = localStorage.getItem("login");
    let val = $("#message").val();
    let room = $("#room").val();
    let notify = false;

    const socket = io("http://artegoser.tplinkdns.com:9191");
    socket.emit("autorisation", {name:localStorage.getItem("login"), password:localStorage.getItem("password")});
    socket.emit("joinchat", room);

    socket.emit(`${room}chat`);

    $("#send").on("click", ()=>{
      val = $("#message").val();
      if(val==""){
        return;
      }
      $("#message").val("");
      val = htmlspecialchars(val);
      val = replacespec(val);

      socket.emit(`${$("#room").val()}message`, {user:login, message:val});
    });

    socket.on("chatstate", data=>{
      if(data==true){
        addmessage(login, val);
      } else{
        toastr.error(`Сообщение в ${$("#room").val()} не отправлено. Сессия закончилась, перезайдите!`);
      }
    });

    $("#delete").on("click", ()=>{
      socket.emit("deletemessage", {type:$("#room").val(), user:localStorage.getItem("login")});
      $("#chat").html("");
      socket.emit(`${$("#room").val()}chat`);
    });

    socket.on("plreload", data=>{
      $("#chat").html("");
      socket.emit(`${$("#room").val()}chat`);
    });

    socket.on("logstate", data=>{
      if(data.state!=true){
        toastr.error(`Произошла ошибка в авторизации. <a href="http://artegoser.tplinkdns.com:9191/">Страница авторизации</a>`);
      }
    });

    socket.on("deleteerror", ()=>{
      toastr.error(`Сообщение не может быть удалено. <a href="http://artegoser.tplinkdns.com:9191/">Страница авторизации</a>`);
    });

    socket.on("chatmessage", data=>{
      addmessage(data.user, data.message);
      if(notify) sendNotification(data.user, {body:data.message})
    });

    socket.on("chatmessages", data=>{
        addmessages(data);
    });

    $("#room").change(()=>{
      socket.emit("leavechat", room);
      room = $("#room").val();
      socket.emit("joinchat", room);
      $("#chat").html("");
      socket.emit(`${room}chat`);

      $("#chat").append(`<div id="block"><p style="color:cyan">[${strftime()}] Система</p><p>${localStorage.getItem("login")} Вы перешли в комнату ${$("#room").val()}</p>`);
      if ($("#scroll").prop("checked")) {
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;     
      }
    });

    $("#notify").change(()=>{
      if ($("#notify").prop("checked")) {
        notify = true;
        sendNotification("Вы включили уведомления о сообщениях");
      } else{
        notify = false;
        sendNotification("Вы выключили уведомления о сообщениях");
      }
    });

};