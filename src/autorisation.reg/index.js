const dgram = require('dgram');

let me = {
        "type":"autorisation",
        "message":{"name":"name", "password":"name"}
        }

const message = Buffer.from(JSON.stringify(me));
const client = dgram.createSocket('udp4');

client.send(message, 9191, 'artegoser.tplinkdns.com', (err) => {
  //client.close();
});

client.on('message', function(message, remote) {
 console.log(message.toString());
});