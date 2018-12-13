import saveAs from 'file-saver';


function runExp (eegcont, client) {
    const timeline = [];

    timeline.push({
        type:"html-keyboard-response",
        stimulus: "Wait a bit for EEG data..."
    })


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