const express = require('express');
const fs = require('fs');
const router = express.Router();
const ws281x = require('rpi-ws281x');
const convert = require('color-convert');

config = {};
config.leds = 1;
config.dma = 10;
config.brightness = 255;
config.gpio = 18;
config.strip = 'grb';

ws281x.configure(config);

var pixels = new Uint32Array(config.leds);

ws281x.render(pixels)





const moment = require('moment-timezone');

var color = "#000000";

// setInterval(function(){
//     let date_ob = new Date();
//     console.log("Seconds: " + date_ob.getSeconds());
//     console.log("")
//     console.log("")
//     // spawn('python3', ["./script.py", r, g, b, brightness])
//   }, 5000);

router.get('/', (req, res, next) => {
    let rawdata = fs.readFileSync('settings.json');
    let settings = JSON.parse(rawdata);

    res.status(200).json(settings)
});

router.post('/', (req, res, next) => {

    color = convert.hex.lab(req.body.color.color.substr(1, 6));
    console.log(color)
    color[0] = parseInt(req.body.brightness.brightness);
    console.log(color)
    color = convert.lab.hex(color);
    console.log(color)
    pixels[0] = parseInt(color, 16);
    console.log(pixels[0])

    ws281x.render(pixels);

    console.log(req.body.time.timezone.text + ": " + moment().tz(req.body.time.timezone.utc[0]).format());

    fs.writeFile('settings.json', JSON.stringify(req.body), function (err) {
        if (err) throw err;

        let rawdata = fs.readFileSync('settings.json');
        let settings = JSON.parse(rawdata);

        res.status(200).json(settings)
    });
});

module.exports = router;