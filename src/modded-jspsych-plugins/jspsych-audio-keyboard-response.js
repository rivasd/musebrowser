/**
 * Jspsych-audio-keyboard-response
 * Josh de Leeuw
 *
 * plugin for playing an audio file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 *
 */

jsPsych.plugins["audio-keyboard-response"] = (function () {
    const plugin = {};

    jsPsych.pluginAPI.registerPreload('audio-keyboard-response', 'stimulus', 'audio');

    plugin.info = {
      name: 'audio-keyboard-response',
      description: '',
      parameters: {
        stimulus: {
          type: jsPsych.plugins.parameterType.AUDIO,
          pretty_name: 'Stimulus',
          default: undefined,
          description: 'The audio to be played.'
        },
        choices: {
          type: jsPsych.plugins.parameterType.KEYCODE,
          pretty_name: 'Choices',
          array: true,
          default: jsPsych.ALL_KEYS,
          description: 'The keys the subject is allowed to press to respond to the stimulus.'
        },
        prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Prompt',
          default: null,
          description: 'Any content here will be displayed below the stimulus.'
        },
        trial_duration: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Trial duration',
          default: null,
          description: 'The maximum duration to wait for a response.'
        },
        response_ends_trial: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Response ends trial',
          default: true,
          description: 'If true, the trial will end when user makes a response.'
        },
        trial_ends_after_audio: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Trial ends after audio',
          default: false,
          description: 'If true, then the trial will end as soon as the audio file finishes playing.'
        },
        muse_client: {
            type: jsPsych.plugins.parameterType.OBJECT,
            default:null,
            pretty: 'an instance of MuseClient to send events to'
        }
      }
    }

    plugin.trial = function (display_element, trial) {
      // Setup stimulus
      const context = jsPsych.pluginAPI.audioContext();

      if (context !== null) {
        var source = context.createBufferSource();

        source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
        source.connect(context.destination);
      }
 else {
        var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);

        audio.currentTime = 0;
      }

      // Set up end event if trial needs it

      if (trial.trial_ends_after_audio) {
        if (context !== null) {
          source.onended = function () {
            end_trial();
          }
        }
 else {
          audio.addEventListener('ended', end_trial);
        }
      }

      // Show prompt if there is one
      if (trial.prompt !== null) {
        display_element.innerHTML = trial.prompt;
      }

      // Store response
      let response = {
        rt: null,
        key: null
      };

      // Function to end trial when it is time
      function end_trial () {
        // Kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        /*
         * stop the audio file if it is playing
         * remove end event listeners if they exist
         */
        if (context !== null) {
          source.stop();
          source.onended = function () { }
        }
 else {
          audio.pause();
          audio.removeEventListener('ended', end_trial);
        }

        // Kill keyboard listeners
        jsPsych.pluginAPI.cancelAllKeyboardResponses();

        // Gather the data to store for the trial
        if (context !== null && response.rt !== null) {
          response.rt = Math.round(response.rt * 1000);
        }
        const trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "key_press": response.key
        };

        // Clear the display
        display_element.innerHTML = '';

        // Move on to the next trial
        jsPsych.finishTrial(trial_data);
      }

      // function to handle responses by the subject
      var after_response = function (info) {
        // Only record the first response
        if (response.key == null) {
          response = info;
        }

        if (trial.response_ends_trial) {
          end_trial();
        }
      };

      // Start audio
      if (context !== null) {
        startTime = context.currentTime;
        source.start(startTime);
      }
 else {
        audio.play();
      }
      // Send a Muse event if we have a client
      if (trial.muse_client) {
          trial.muse_client.injectMarkers(trial.stimulus);
      }

      // Start the response listener
      if (context !== null) {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'audio',
          persist: false,
          allow_held_key: false,
          audio_context: context,
          audio_context_start_time: startTime
        });
      }
 else {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'performance',
          persist: false,
          allow_held_key: false
        });
      }

      // End trial if time limit is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }
    };

    return plugin;
  }());