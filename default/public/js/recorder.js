var stream;
var harkMicrophone;
var speech;
var recorder;

function clearStreams(stopRecoder = false) {
  if (recorder) {
    recorder.stop();
    if (stopRecoder)
      recorder = null;
  }
  if (stream) {
    stream.stop();
    stream = null;
  }
  if (speech) {
    speech.stop();
    speech = null;
  }
  if (harkMicrophone) {
    harkMicrophone.stop();
    harkMicrophone = null;
  }
}

let target2Flag = true;
let target3Flag = true;
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (!mutation.addedNodes) return;

    const target = document.getElementById("sq_117_ariaTitle");
    if (target) {
      const attrObserver = new MutationObserver(function (mutations) {
        $("h4.sv-title.sv-panel__title")
          .first()
          .css("background-color", "rgba(26, 179, 148, 0.2)");
      });
      attrObserver.observe(target, { attributes: true });
    }

    const target2 = document.getElementById("sp_100");
    if (target2 && target2Flag) {
      $("#sp_100")
        .find("div.sv-page.sv-body__page")
        .removeClass("sv-body__page")
        .addClass("sv-body__footer");
        target2Flag = false;
    }

    const target3 = document.getElementsByClassName(
      "sv-progress sv-body__progress"
    ).length;
    if (target3 && target3Flag) {
      $("div.sv-progress.sv-body__progress")
        .first()
        .css("background-color", "rgba(26, 179, 148, 0.2)");
      $("div.sv-progress.sv-body__progress")
        .find("span")
        .css("color", "rgb(26, 179, 148)");
        target3Flag = false;
    }

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      let node = mutation.addedNodes[i];
      let c = node.childNodes;

      for (i = 0; i < c.length; i++) {
        if (c[i].title == "Record") {
          var btnStartRecording;
          var btnStopRecording;
          var btnReleaseMicrophone;
          var inputFileUpload;

          var otherParentNode = document.querySelector('[title="Record"]').parentNode;
          var audio = document.querySelector('audio');
          var heardCough;
          var timeout;
          var recordBlob;
          var recordBlobUrl;
          var uploadBlob;
          var uploadBlobUrl;
          var uploadFileName;
          var BASE64_MARKER = ";base64,";

          var uploadOrRecordContent = document.createElement("DIV");
          var newAudio = document.createElement("AUDIO");
          var sliderParent = document.createElement("DIV");
          var sliderLabel = document.createElement("LABEL");
          var sliderInput = document.createElement("INPUT");
          var sliderSpan = document.createElement("SPAN");
          var sliderOptionsText = document.createElement("P");
          var audioParent = document.createElement("DIV");
          var notPlayableMessage = (notPlayableMessage = document.createElement(
            "P"
          ));
          var audioPlayable = true;

          newAudio.style.borderRadius = "15px";
          otherParentNode.innerHTML = "";
          otherParentNode.style.height = "350px";
          sliderParent.style.textAlign = "center";
          sliderParent.style.marginTop = "50px";
          sliderLabel.className = "switch";
          sliderInput.type = "checkbox";
          sliderSpan.className = "slider";
          audioParent.style.textAlign = "center";
          audioParent.style.marginTop = "100px";
          notPlayableMessage.innerText =
            "This file type is not playable but can still be submitted";

          sliderLabel.appendChild(sliderInput);
          sliderLabel.appendChild(sliderSpan);
          sliderOptionsText.innerText = "Record   ";
          sliderOptionsText.style.display = "inline";
          sliderParent.appendChild(sliderOptionsText);
          sliderParent.appendChild(sliderLabel);
          sliderOptionsText = document.createElement("P");
          sliderOptionsText.innerText = "   Upload";
          sliderOptionsText.style.display = "inline";
          sliderParent.appendChild(sliderOptionsText);

          otherParentNode.appendChild(sliderParent);
          otherParentNode.appendChild(uploadOrRecordContent);

          sliderInput.addEventListener("click", function () {
            if (!sliderInput.checked) replaceRecordingElements();
            else replaceUploadElements();
          });

          function convertDataURIToBinary(dataURI) {
            var base64Index =
              dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));

            for (i = 0; i < rawLength; i++) {
              array[i] = raw.charCodeAt(i);
            }
            return array;
          }

          function playableAudioFile(audioFileType) {
            return audioFileType === "audio/amr" ||
              audioFileType === "audio/amr-wb" ||
              audioFileType === "audio/amr-wb+" ||
              audioFileType === "audio/3gpp" ||
              audioFileType === "audio/3gpp2" ||
              audioFileType === "audio/3gp2"
              ? false
              : true;
          }

          function addBlobToResult(blob, originalFileName) {
            uploadBlob = blob;
            recorderResult = uploadBlob;
            uploadFileName = originalFileName;

            if (!!uploadFileName) {
              inputFileUpload.nextElementSibling.querySelector(
                "span"
              ).innerHTML = originalFileName;
            }

            fileName = uploadFileName;
            uploadBlobUrl = URL.createObjectURL(uploadBlob);

            audioPlayable
              ? replaceAudio(uploadBlobUrl)
              : replaceAudio(uploadBlobUrl, false);
          }

          function readFile(e) {
            const originalFileName = e.target.value.split("\\").pop();
            const audioFile = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", function (e) {
              const audioFileType = audioFile.type.toLowerCase();

              if (!audioFileType.startsWith("audio/")) {
                inputFileUpload.nextElementSibling.querySelector(
                  "span"
                ).innerHTML = "Choose a file";

                inputFileUpload.value = null;
                alert("Please upload an audio file.");
                return;
              }

              const fileSize = audioFile.size / 1024 / 1024;

              if (fileSize > 5) {
                inputFileUpload.nextElementSibling.querySelector(
                  "span"
                ).innerHTML = "Choose a file";

                inputFileUpload.value = null;
                alert("Please upload an audio file smaller than 5MB.");
                return;
              }

              var binary = convertDataURIToBinary(e.target.result);
              var blob = new Blob([binary], { type: audioFile.type });
              var blobUrl = URL.createObjectURL(blob);
              var testAudio = document.createElement("AUDIO");
              if (playableAudioFile(audioFileType)) {
                audioPlayable = true;
                testAudio.src = blobUrl;
                testAudio.addEventListener(
                  "loadedmetadata",
                  function () {
                    var duration = testAudio.duration;

                    if (duration > 15) {
                      inputFileUpload.nextElementSibling.querySelector(
                        "span"
                      ).innerHTML = "Choose a file";

                      inputFileUpload.value = null;
                      alert(
                        "Please upload an audio file that has a duration of 15 seconds or less."
                      );
                      return;
                    }
                    addBlobToResult(blob, originalFileName);
                  },
                  false
                );
              } else {
                audioPlayable = false;
                addBlobToResult(blob, originalFileName);
              }
            });
            reader.readAsDataURL(audioFile);
          }

          function recordBtnHandlers() {
            btnStartRecording.addEventListener("click", () => {
              navigator.mediaDevices
                .getUserMedia({ audio: { echoCancellation: true } })
                .then((stream) => {
                  btnStartRecording.disabled = true;
                  btnStartRecording.style.border = "";
                  btnStartRecording.style.fontSize = "";
                  heardCough = false;

                  recorder = new MediaRecorder(stream);

                  recorder.addEventListener("dataavailable", (e) => {
                    recordBlob = e.data;
                    recordBlobUrl = URL.createObjectURL(recordBlob);
                    replaceAudio(recordBlobUrl);
                    if (heardCough) {
                      recorderResult = e.data;
                      fileName = "file.wav";
                      $("#sq_122_ariaTitle").css(
                        "background-color",
                        "rgba(26, 179, 148, 0.2)"
                      );
                    } else {
                      recorderResult = -1;
                      fileName = null;
                    }
                  });

                  recorder.start();

                  var harkOptions = {
                    threshold: -40,
                  };
                  harkMicrophone = stream.clone();
                  speech = hark(harkMicrophone, harkOptions);

                  speech.on("speaking", function () {
                    console.log("cough detected");
                    heardCough = true;
                  });

                  btnStopRecording.disabled = false;
                  btnStopRecording.className = "Rec";
                  btnStartRecording.hidden = true;
                  btnStopRecording.hidden = false;
                  timeout = setTimeout(function () {
                    btnStopRecording.click();
                  }, 15000);
                });
            });

            btnStopRecording.addEventListener("click", () => {
              clearTimeout(timeout);
              clearStreams();
              this.disabled = true;
              btnStopRecording.className = "notRec";
              btnStopRecording.hidden = true;
              btnStartRecording.hidden = false;
              btnStartRecording.disabled = false;
              // Remove “recording” icon from browser tab
              recorder.stream.getTracks().forEach((i) => i.stop());
            });
          }

          function replaceUploadElements() {
            inputFileUpload = document.createElement("INPUT");
            var uploadLabel = document.createElement("LABEL");
            var uploadSVG = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg"
            );
            var svgpath1 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            var svgpath2 = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            var uploadSpan = document.createElement("SPAN");

            uploadOrRecordContent.innerHTML = "";
            uploadOrRecordContent.style.textAlign = "center";
            uploadOrRecordContent.style.marginTop = "50px";

            inputFileUpload.type = "file";
            inputFileUpload.accept = "application/octet-stream";
            inputFileUpload.className = "inputfile";
            inputFileUpload.id = "inputfile";

            uploadLabel.htmlFor = "inputfile";
            uploadSVG.setAttribute("viewbox", "0 0 24 24");
            uploadSVG.setAttribute("height", "24");
            uploadSVG.setAttribute("width", "24");
            svgpath1.setAttribute("d", "M0 0h24v24H0z");
            svgpath1.setAttribute("fill", "none");
            svgpath2.setAttribute(
              "d",
              "M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"
            );
            uploadSpan.innerHTML = "Choose a file";

            inputFileUpload.addEventListener("change", readFile);

            uploadSVG.appendChild(svgpath1);
            uploadSVG.appendChild(svgpath2);
            uploadLabel.appendChild(uploadSVG);
            uploadLabel.appendChild(uploadSpan);
            uploadOrRecordContent.appendChild(inputFileUpload);
            uploadOrRecordContent.appendChild(uploadLabel);

            if (uploadBlob) {
              recorderResult = uploadBlob;
              fileName = uploadFileName;

              if (!!uploadFileName) {
                uploadSpan.innerHTML = uploadFileName;
              }

              replaceAudio(uploadBlobUrl, audioPlayable);
            } else {
              recorderResult = null;
              fileName = null;
              replaceAudio();
            }
          }

          function replaceRecordingElements() {
            uploadOrRecordContent.innerHTML = "";
            uploadOrRecordContent.style.textAlign = "center";
            uploadOrRecordContent.style.height = "50px";
            uploadOrRecordContent.style.marginTop = "50px";

            btnStartRecording = document.createElement("BUTTON");
            btnStopRecording = document.createElement("BUTTON");
            btnReleaseMicrophone = document.createElement("BUTTON");

            btnStopRecording.className = "Rec";
            btnStartRecording.className = "notRec";
            btnStopRecording.hidden = true;

            btnReleaseMicrophone.hidden = true;

            btnStartRecording.id = "record";
            btnStopRecording.id = "save";

            uploadOrRecordContent.appendChild(btnStartRecording);
            uploadOrRecordContent.appendChild(btnStopRecording);
            uploadOrRecordContent.appendChild(btnReleaseMicrophone);

            $(".sv-description").css("color", "rgb(64, 64, 64)");

            if (recordBlob) {
              if (heardCough) {
                recorderResult = recordBlob;
                fileName = "file.wav";
              } else {
                recorderResult = -1;
                fileName = null;
              }

              replaceAudio(recordBlobUrl);
            } else {
              recorderResult = null;
              fileName = null;
              replaceAudio();
            }

            recordBtnHandlers();
          }

          function replaceAudio(src = null, playable = true) {
            if (!!src) {
              newAudio.src = src;
              newAudio.controls = true;
            } else {
              newAudio.src = null;
              newAudio.controls = false;
            }

            var parentNode = audio.parentNode;

            if (!parentNode) {
              audioParent.appendChild(newAudio);
              otherParentNode.appendChild(audioParent);
            } else {
              parentNode.innerHTML = "";
              parentNode.appendChild(newAudio);
              playable
                ? parentNode.contains(notPlayableMessage)
                  ? parentNode.removeChild(notPlayableMessage)
                  : null
                : parentNode.appendChild(notPlayableMessage);
            }

            audio = newAudio;
          }

          replaceRecordingElements();
        } else {
          clearStreams(true);
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
