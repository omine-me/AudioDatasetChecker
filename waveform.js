// const wavesurfer = WaveSurfer.create({
//     container: '#waveform-container',
//     waveColor: '#4F4A85',
//     progressColor: '#383351',
//     autoScroll: true,
//     autoCenter: true,
//     hideScrollbar: false,
//   })

// wavesurfer.zoom(wavesurfer.getCurrentTime()-2, wavesurfer.getCurrentTime()+2)



// load the audio file
var audioElement = document.getElementById('ori_audio');
var max_amplitude_history = [];

// // create a new AudioContext instance
// let audioContext;
// // create a new MediaElementAudioSourceNode
// var sourceNode;


// display the canvas element
var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 100;
var waveformContainer = document.getElementById('waveform-container');
waveformContainer.innerHTML = '';
waveformContainer.appendChild(canvas);

waveform_start = 0;
waveform_end = 0;
waveform_sec = 10;
waveformplaybackRate = 16;
drawn = false;
audioContext = undefined
sourceNode = undefined

loadingElm = document.getElementById("loading")

let analyserNode = undefined;
var waveform_bufferLength = undefined;
var waveform_dataArray = undefined;
let current_playbackRate = 1;

// when the audio file is loaded
audioElement.addEventListener('loadedmetadata', function () {
    console.log("new audio loaded")
    if (!(audioContext)){
        audioContext = new AudioContext();
    }
    if (!(sourceNode)){
        sourceNode = audioContext.createMediaElementSource(audioElement);
    }
    if (!(analyserNode)){
          // create a new AnalyserNode
          analyserNode = audioContext.createAnalyser();
          // analyserNode.fftSize = 2048;;

          // connect the sourceNode to the analyserNode
            sourceNode.connect(analyserNode);

            // connect the analyserNode to the destination (speakers)
            analyserNode.connect(audioContext.destination);
    } 

//   var bufferLength = analyserNode.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);     
//         analyserNode.getByteTimeDomainData(dataArray);
//             console.log(dataArray)

//             audioElement.addEventListener('timeupdate', function() {
//                 var bufferLength = analyserNode.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);     
//         analyserNode.getByteTimeDomainData(dataArray);
//             console.log(dataArray)
//             })
waveform_bufferLength = analyserNode.frequencyBinCount;
    waveform_dataArray = new Uint8Array(waveform_bufferLength); 
});


function get_current_waveform(){
    analyserNode.getByteTimeDomainData(waveform_dataArray);    
    var int8Array = new Int8Array(waveform_dataArray.length);
    for (var j = 0; j < waveform_dataArray.length; j++) {
        int8Array[j] = Math.abs(waveform_dataArray[j]-128);
    }
    max_amplitude_history[max_amplitude_history.length] = (Math.max(...int8Array))
}


function getWaveform() {
    loadingElm.style.display = "block";
    max_amplitude_history = [];
    drawn = false;
    play_n_sec_before = Number(document.getElementById("play_from_n_sec_before").value)

  // get the current playback time
    var currentTime = audioElement.currentTime;
    waveform_start = currentTime - 3 + play_n_sec_before;
    waveform_end = currentTime + (waveform_sec-3) + play_n_sec_before;
    // get the time domain data from the analyserNode

    audioElement.currentTime = waveform_start;
    current_playbackRate = audioElement.playbackRate;
    audioElement.playbackRate = waveformplaybackRate;
    audioElement.play();
    // var bufferLength = analyserNode.frequencyBinCount;
    // var dataArray = new Uint8Array(bufferLength);

    audioElement.addEventListener('timeupdate', get_current_waveform);

    setTimeout(function(){
            audioElement.removeEventListener('timeupdate', get_current_waveform);

            drawWaveform();

            audioElement.pause();
            audioElement.currentTime = currentTime;
            audioElement.playbackRate = current_playbackRate;
            drawn = true;
            loadingElm.style.display = "none";
    }, waveform_sec/waveformplaybackRate*1000);
  
};

function drawWaveform(current_time=0, mouseX=undefined) {
    var context = canvas.getContext('2d');
    context.fillStyle = '#ddd';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw the waveform
    context.beginPath();
    var sliceWidth = 800/max_amplitude_history.length;
    var x = 0;

    // console.log(max_amplitude_history)
    for (var i = 0; i < max_amplitude_history.length; i++) {
    //   var v = dataArray[i] / 128.0;
    //   var y = v * canvas.height / 2;
    var y = max_amplitude_history[i];
        if (i === waveform_start) {
        context.moveTo(x, canvas.height-y);
        } else {
        context.lineTo(x, canvas.height-y);
        }
        x += sliceWidth;
    }
    context.strokeStyle = 'blue';
    context.lineWidth = 1;
    context.stroke();

    if (waveform_start < current_time && current_time < waveform_end){
        x = (current_time-waveform_start)/waveform_sec*800;
        context.beginPath();
        context.moveTo(x, canvas.height);
        context.lineTo(x, 0);
        context.strokeStyle = 'green';
        context.lineWidth = 1;
        context.stroke();
    }
    if (mouseX != undefined){
        context.beginPath();
        context.moveTo(mouseX, canvas.height);
        context.lineTo(mouseX, 0);
        context.strokeStyle = 'grey';
        context.lineWidth = 1;
        context.stroke();
    }

    // draw scale by 0.1
    for (var i = 0; i < waveform_sec*10; i++) {
        x = i*8;
        y = canvas.height*.9;
        if (i%10 == 0){
            y = canvas.height*.8;
        }
        context.beginPath();
        context.moveTo(x, canvas.height);
        context.lineTo(x, y);
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.stroke();
    }
    

    curr_laugh = laughters[current_laughter]
    context.fillStyle = 'rgba(0, 0, 255, 0.5)';

    context.fillRect((curr_laugh[start_sec_attr_name]-waveform_start)/waveform_sec*800,
                     0, 
                     (curr_laugh["end_sec"]-curr_laugh[start_sec_attr_name])/waveform_sec*800, 
                     canvas.height);
}


function show_current_bar_in_waveform(){
    if (drawn){
    drawWaveform(audioElement.currentTime);
    }
}
    
canvas.addEventListener('mousemove', function(event) {
  // get the relative cursor location within the canvas
  drawWaveform(audioElement.currentTime, event.offsetX);
  if (event.ctrlKey || event.metaKey){
        message = "set start"
    }else if (event.shiftKey){
        message = "set end"
    }else{
        message = "set current"
    }
    canvas.getContext('2d').font = "35px Arial";
    canvas.getContext('2d').fillText(message, event.offsetX, event.offsetY);
});
// canvas.setAttribute('tabindex', 0);
// canvas.addEventListener('keydown', function(event) {
//     if (event.ctrlKey || event.metaKey){
//         message = "set start time"
//     }else if (event.shiftKey){
//         message = "set end time"
//     }else{
//         message = "set current time"
//     }
//     canvas.getContext('2d').fontsize = "2rem";
//     canvas.getContext('2d').fillText(message, event.offsetX, event.offsetY);
// },false);
// canvas.addEventListener('keyup', function(event) {
//     if (event.ctrlKey || event.metaKey){
//         message = "set start time"
//     }else if (event.shiftKey){
//         message = "set end time"
//     }else{
//         message = "set current time"
//     }
//     canvas.getContext('2d').fontsize = "2rem";
//     canvas.getContext('2d').fillText(message, event.offsetX, event.offsetY);
// },false);

canvas.addEventListener('click', function(event) {
    // get the cursor location within the canvas
    var x = event.offsetX;
    if (event.ctrlKey || event.metaKey){
        update_state(start_sec_attr_name, undefined, value=waveform_start + x/800*waveform_sec);
    }else if (event.shiftKey){
        update_state('end_sec', undefined, value=waveform_start + x/800*waveform_sec);
        event.preventDefault();
    }else{
        ori_audioElm.currentTime = waveform_start + x/800*waveform_sec;
    }
    drawWaveform(audioElement.currentTime, event.offsetX);
    audioElement.play();
  });