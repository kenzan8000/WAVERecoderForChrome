chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.message == "MP3Recoder-Google-Chrome-Extension") {

        /**
         * show/hidden MP3Recorder
         */
        var toggleMP3Recorder = function() {
            var recorderDivision = document.getElementById("MP3Recoder-Google-Chrome-Extension");

            // show
            if (recorderDivision == null) {
                recorderDivision = document.createElement("div");
                recorderDivision.id = "MP3Recoder-Google-Chrome-Extension";
                recorderDivision.style.position = "fixed";
                recorderDivision.style.bottom = "0px";
                recorderDivision.style.width = "100%";
                recorderDivision.style.height = "64px";
                recorderDivision.style.textAlign = "center";
                recorderDivision.style.backgroundColor = "#fff";
                recorderDivision.style.borderTop = "solid #aaa 1px";
                recorderDivision.innerHTML = '\
                    <a id="recording-button-MP3Recoder-Google-Chrome-Extension"><img id="recording-button-image-MP3Recoder-Google-Chrome-Extension" src="" width="64px" height="64px" /></a>\
                    <audio id="audio-MP3Recoder-Google-Chrome-Extension" autoplay="" controls=""></audio>\
                    <a id="download-button-MP3Recoder-Google-Chrome-Extension"><img id="download-button-image-MP3Recoder-Google-Chrome-Extension" src="" width="64px" height="64px" /></a>\
                ';
                document.body.appendChild(recorderDivision);

                var recordingButton = document.getElementById("recording-button-MP3Recoder-Google-Chrome-Extension");
                recordingButton.isNowRecording = false;
                var recordingButtonImage = document.getElementById("recording-button-image-MP3Recoder-Google-Chrome-Extension");
                recordingButtonImage.src = chrome.extension.getURL("img/recording_button_off.png");
                var downloadButton = document.getElementById('download-button-MP3Recoder-Google-Chrome-Extension');
                var downloadButtonImage = document.getElementById('download-button-image-MP3Recoder-Google-Chrome-Extension');
                downloadButtonImage.src = chrome.extension.getURL("img/download_button.png");
                downloadButtonImage.style.opacity = "0.25";

                var audio = document.getElementById("audio-MP3Recoder-Google-Chrome-Extension");
                var audioStream;
                var recorder;

                navigator.getUserMedia({audio: true, video: false}, function(stream) {
                    if (window.IsChrome) { stream = new window.MediaStream(stream.getAudioTracks()); }
                    audioStream = stream;

                    audio.src = URL.createObjectURL(audioStream);
                    audio.muted = true;

                    recorder = window.RecordRTC(stream, {type: 'audio'});
                }, function() { });

                // button event
                recordingButton.onclick = function() {
                    this.isNowRecording = !(this.isNowRecording);
                    // begin recording
                    if (this.isNowRecording) {
                        recordingButton.class = "recording-button-on-MP3Recoder-Google-Chrome-Extension";
                        audio.src = URL.createObjectURL(audioStream);
                        audio.muted = true;
                        if (recorder) { recorder.startRecording(); }
                        window.isAudio = true;
                        recordingButtonImage.src = chrome.extension.getURL("img/recording_button_on.png");
                    }
                    // end recording
                    else {
                        audio.src = '';
                        recorder.stopRecording(function(url) {
                            audio.src = url;
                            audio.muted = false;

                            downloadButton.href = url;
                            downloadButton.download = new Date().getTime() + '.wav';
                            downloadButtonImage.style.opacity = "1.0";
                            recordingButtonImage.src = chrome.extension.getURL("img/recording_button_off.png");
                        });

                    }
                };
            }
            // hidden
            else {
                (recorderDivision.parentNode).removeChild(recorderDivision);
            }
        };

        toggleMP3Recorder();

        sendResponse({message: "MP3Recoder-Google-Chrome-Extension"});
    }
});
