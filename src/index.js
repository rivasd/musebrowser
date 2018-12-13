import { MuseClient } from 'muse-js';
import CanvasJS from './CanvasJS/canvasjs.min.js';
import EegTrace from './eegtrace';

var chart;
var graphTitles;
var canvases;
var canvasCtx;
var traces = {};

async function main() {

  //setup chart
  graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
  canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));

  canvases.forEach((canvas, idx) => {
    canvas.width=1000;
    traces[idx] = new EegTrace(canvas, 1000);
  })

  let client = new MuseClient();
  await client.connect();
  await client.start();
  client.eegReadings.subscribe(reading => {
    traces[reading.electrode].update(reading.samples);
    traces[reading.electrode].plot()
  });
  client.telemetryData.subscribe(telemetry => {
    console.log(telemetry);
  });
}


document.getElementById("muse").addEventListener("click", main);