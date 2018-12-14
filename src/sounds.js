import Tone from 'tone';


function createSoundGenerator (basefreq, ampModudulationFreq, type) {
    ampModudulationFreq = ampModudulationFreq || 4;
    if (type === "sine") {
        var noisesynth = new Tone.Oscillator(basefreq, "sine");
    }
    else {
        var noisesynth = new Tone.Oscillator(basefreq, "sine");
    }


    var ampMod = new Tone.Tremolo(ampModudulationFreq, 0.99).toMaster().start();

    noisesynth.connect(ampMod);

    return noisesynth;
}


export default createSoundGenerator;