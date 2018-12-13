import {MuseClient} from 'muse-js';
import EegTrace from './eegtrace';

let electrodes;
const traces = {};


async function main () {
  // Setup chart
  electrodes = Array.from(document.querySelectorAll('.electrode-item'));

  electrodes.forEach((elem, idx) => {
    traces[idx] = new EegTrace(elem);
  })

  const client = new MuseClient();

  await client.connect();
  await client.start();
  client.eegReadings.subscribe((reading) => {
    traces[reading.electrode].update(reading.samples);
    traces[reading.electrode].plot()
  });
  client.telemetryData.subscribe((telemetry) => {
    console.log(telemetry);
  });
}


document.getElementById("muse").addEventListener("click", main);