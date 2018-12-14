import saveAs from 'file-saver';
import './jspsych-audio-keyboard-response';
import createSoundGenerator from './sounds';

function runExp (eegcont, client) {
    const timeline = [];

    var sound1 = createSoundGenerator("Ab3", 1.21, "sine");
    var sound2 = createSoundGenerator("D3", 3, "sine");

    timeline.push({
        type:"html-keyboard-response",
        stimulus: "Wait a bit for EEG data..."
    })

    for (let i = 0; i < 20; i++) {
        timeline.push({
            type:"call-function",
            async: true,
            func: function (promise) {
                sound1.start();
                sound2.start();
                client.injectMarker("test");
                setTimeout(() => {
                    sound1.stop();
                    sound2.stop();
                    promise();
                }, 5000);
            }

        })
    }


    jsPsych.init({
        timeline: timeline,
        display_element:"jspsych-container",
        on_finish: function (data) {
            saveAs(new Blob([data.csv()], {type:"text/plain;charset=utf-8"}), "behavioral.csv");
            saveAs(new Blob([JSON.stringify(eegcont)], {type:"text/plain;charset=utf-8"}, "eeg.csv"))
        }
    })
}

export default runExp