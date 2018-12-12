import { MuseClient } from 'muse-js';

async function main() {
  let client = new MuseClient();
  await client.connect();
  await client.start();
  client.eegReadings.subscribe(reading => {
    console.log(reading);
  });
  client.telemetryData.subscribe(telemetry => {
    console.log(telemetry);
  });
}

document.getElementById("muse").addEventListener("click", main)