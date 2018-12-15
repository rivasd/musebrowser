import Tone from 'tone';


function createSoundGenerator (opts) {

    opts = {...opts}
    opts.ampModudulationFreq = opts.ampModudulationFreq || 0;
    opts.type = opts.type || "sine";
    opts.basefreq = opts.basefreq || "A4";

    if (opts.type === "sine") {
        var noisesynth = new Tone.Oscillator(opts.basefreq, "sine");
    }
    else {
        var noisesynth = new Tone.Oscillator(opts.basefreq, "sawtooth");
    }

    if (opts.ampModudulationFreq > 0){
        var ampMod = new Tone.Tremolo(opts.ampModudulationFreq, 0.99).toMaster().start();

        noisesynth.connect(ampMod);
    }
    else {
        noisesynth.toMaster();
    }

    return noisesynth;
}


export default createSoundGenerator;