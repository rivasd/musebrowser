import {MuseClient} from 'muse-js';
import EegTrace from './eegtrace';
import runExp from './experiment';
import streamSaver from './StreamSaver';
import style from './static/experiment.css'


let electrodes;
let client;
const traces = {};
const channelName = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX'];
const eegdat = {
  "TP9":[],
  "AF7":[],
  "AF8":[],
  "TP10":[],
  "events":[]
}

let streamWriter;
const encoder = new TextEncoder();

const timeStep = 1000 / 256;

function startStream(){
  const fileStream = streamSaver.createWriteStream("eeg.csv");
  streamWriter = fileStream.getWriter();
  let header = "timestamp,electrode,value\n";

  streamWriter.write(encoder.encode(header));
}

async function main () {
  // Setup chart
  electrodes = Array.from(document.querySelectorAll('.electrode-item'));

  electrodes.forEach((elem, idx) => {
    traces[idx] = new EegTrace(elem);
  })

  client = new MuseClient();

  await client.connect();
  await client.start();
  startStream();
  client.eegReadings.subscribe((reading) => {
    reading.samples.forEach((sample, idx) => {
      streamWriter.write(encoder.encode(`${reading.timestamp + (idx * timeStep)},${reading.electrode},${sample}\n`))
    });

    traces[reading.electrode].update(reading.samples);
    traces[reading.electrode].plot()
    // eegdat[channelName[reading.electrode]].push(...samples);
  });
  client.telemetryData.subscribe((telemetry) => {
    console.log(telemetry);
  });
  client.eventMarkers.subscribe((event) => {
    streamWriter.write(encoder.encode(`${event.timestamp},event,${event.value}\n`))
  });
}


document.getElementById("muse").addEventListener("click", () => {
 main();
});

document.getElementById("experiment").addEventListener("click", () => {
  if (typeof client === "undefined"){
    alert("please first connect your Muse and wait until signal looks good");

    return;
  }

  // Turn off the EegTrace rendering, it wastes precious processing time
  Object.entries(traces).forEach(([name, trace]) => {
    trace.off();
  })

  runExp(eegdat, client, streamWriter);
})