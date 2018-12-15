import saveAs from 'file-saver';
import './jspsych-audio-keyboard-response';
import createSoundGenerator from './sounds';


function runExp (eegcont, client, stream) {
    const timeline = [];

    var sound1 = createSoundGenerator({
        ampMoulationFreq : 2,
        type: "sine",
        basefre: "Ab3"
    });
    var sound2 = createSoundGenerator({
        ampMoulationFreq : 3.1,
        type: "sine",
        basefre: "C4"
    });

    let cue = createSoundGenerator();
    let endCue = createSoundGenerator({
        type:"dirty",
        basefreq: "F4"
    })

    let instructions = {
        type:"instructions",
        show_clickable_nav: true,
        pages: [
            "Welcome to this jsPsych experiment that will collect EEG data right here in the browser!",
            "We will be trying to ellicit occipital alpha waves. "
        ]
    }

    let cueTrial = {
        type:"call-function",
        async: true,
        func: function (endTrial){
            cue.start();
            setTimeout(() => {
                cue.stop();
                client.injectMarker("relax");
                setTimeout(() => {
                    endCue.start();
                    setTimeout(() => {
                        endCue.stop();
                        endTrial();
                    }, 500)
                }, 30 * 1000)
            }, 500);
        }
    }

    let instruction = {
        type: "html-keyboard-response",
        stimulus : "Now relax and close your eyes until the next sound cue, press any key to continue"
    }

    let normalTrial = {
        type: "html-keyboard-response",
        stimulus: '<p> Now enjoy some of that sweet music </p><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ZTidn2dBYbY?controls=0&amp;start=23" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    }

    let test_procedure = {
        timeline:[instruction, cueTrial, normalTrial],
        timeline_variables : [],
        repeat: 10
    }


    jsPsych.init({
        timeline: [instructions, test_procedure],
        display_element:"jspsych-container",
        on_finish: function (data) {
            client.disconnect();
            stream.close();
        }
    })
}

export default runExp