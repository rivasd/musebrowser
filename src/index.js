import {MuseClient} from 'muse-js';
import EegTrace from './eegtrace';
import runExp from './experiment';

let electrodes;
const traces = {};
const channelName = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX'];
const eegdat = {
  "TP9":[],
  "AF7":[],
  "AF8":[],
  "TP10":[],
  "events":[]
}

const timeStep = 1000 / 256;


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
    const samples = reading.samples.map((sample, idx) => ({"v": sample,
      "t": reading.timestamp + (idx * timeStep)}));

    traces[reading.electrode].update(reading.samples);
    traces[reading.electrode].plot()
    eegdat[channelName[reading.electrode]].push(...samples);
  });
  client.telemetryData.subscribe((telemetry) => {
    console.log(telemetry);
  });
}


document.getElementById("muse").addEventListener("click", () => {
 main();
});

document.getElementById("experiment").addEventListener("click", async () => {
  const client = new MuseClient();

  /*
   * await client.connect();
   * await client.start();
   *
   *
   * client.eegReadings.subscribe((reading) => {
   * const samples = reading.samples.map((sample, idx) => ({"value": sample,
   * "timestamp": reading.timestamp + (idx * timeStep),
   * "electrode": reading.electrode}));
   *
   * eegdat[channelName[reading.electrode]].push(...samples);
   * });
   *
   */
  runExp(eegdat, client);
})