const Cyton = require('openbci-observable').Cyton;
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


async function init () {
    const cyton = new Cyton({
        verbose: true,
        simulate: true,
        boardType: "daisy"
    });

    await cyton.connect();
    await cyton.start();

    cyton.stream.subscribe((sample) => console.log('sample', sample));
}


http.listen(3000, () => {
    console.log('listening on *:3000');
})