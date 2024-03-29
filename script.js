const recordBtn = document.querySelector('.record'),
result = document. querySelector('.result'),
downloadBtn = document.querySelector('.download'),
inputlanguage = document.querySelector('#language'),
clearBtn = document.querySelector('.clear');


let SpeechRecognition = 
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function populatelanguages(){
    languages.forEach((lang) => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.innerHTML = lang.name;
        inputlanguage.appendChild(option);
    });
}

populatelanguages()

function speechToText(){
    try{
        recognition = new SpeechRecognition();
        recognition.lang = inputlanguage.value;
        recognition.interimResults = true;
        recordBtn.classList.add('recording');
        recordBtn.querySelector('p').innerHTML = "Listening...";
        recognition.start();
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;

            // detect when interim results
            if (event.results[0].isFinal) {
                result.innerHTML += ' ' + speechResult;
                result.querySelector('p').remove();
            } else {
                // create p with class interim if not existing
                if (!document.querySelector('.interim')) {
                    const interim = document.createElement('p');
                    interim.classList.add('interim');
                    result.appendChild(interim);
                }

                // updates interim p with speech result
                document.querySelector('.interim').innerHTML = " " + speechResult;
            }
            downloadBtn.disabled = false;         
        };
        recognition.onspeechend = () => {
            speechToText();
        };

        recognition.onerror = (event) => {
            stopRecording();
            if(event.error === "no-speech"){
                alert('No speech detected. stopping...');                
            } else if (event.error === "audio-capture") {
                alert(
                    "No microphone was found. Ensure that a microphone is installed."
                );
            } else if (event.error === "not-allowed") {
                alert("Permission to use microphone is blocked.");
            } else if (event.error === "aborted") {
                alert("Listening stopped.");
            } else {
                alert("Error occured in recognnition: " + event.error);
            }
        };
    } catch(error) {
        recording = false;

        console.log(error);
    }
}

recordBtn.addEventListener("click", () => {
    if (!recording) {
        speechToText();
        recording = true;
    } else {
        stopRecording();
    }
});


function stopRecording(){
    recognition.stop();
    recordBtn.querySelector('p').innerHTML = "Start listening";
    recordBtn.classList.remove("recording");
    recording = false;
}

function download() {
    const text = result.innerText;
    const filename = "speech.txt";
  
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  
  downloadBtn.addEventListener("click", download);
  
  clearBtn.addEventListener("click", () => {
    result.innerHTML = "";
    downloadBtn.disabled = true;
  });