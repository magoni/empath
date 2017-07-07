var evanVoices = {
	"evan1" : new Tone.Buffer("./audio/evan/evan1.mp3"),
	"evan2" : new Tone.Buffer("./audio/evan/evan2.mp3"),
	"evan3" : new Tone.Buffer("./audio/evan/evan3.mp3"),
	"evan4" : new Tone.Buffer("./audio/evan/evan4.mp3"),
	"evan5" : new Tone.Buffer("./audio/evan/evan5.mp3"),
	"evan6" : new Tone.Buffer("./audio/evan/evan6.mp3"),
	"evan7" : new Tone.Buffer("./audio/evan/evan7.mp3"),
	"evan8" : new Tone.Buffer("./audio/evan/evan8.mp3"),
	"evan9" : new Tone.Buffer("./audio/evan/evan9.mp3"),
	"evan10" : new Tone.Buffer("./audio/evan/evan10.mp3"),
	"evan11" : new Tone.Buffer("./audio/evan/evan11.mp3"),
	"evan12" : new Tone.Buffer("./audio/evan/evan12.mp3")
};
/*
var evanVoices = {
	"evan1" : new Tone.Buffer("./audio/evan/evan1.mp3"),
	"evan2" : new Tone.Buffer("./audio/evan/evan2.mp3"),
	"evan3" : new Tone.Buffer("./audio/evan/evan3.mp3"),
	"evan4" : new Tone.Buffer("./audio/evan/evan4.mp3"),
	"evan5" : new Tone.Buffer("./audio/evan/evan5.mp3"),
	"evan6" : new Tone.Buffer("./audio/evan/evan6.mp3"),
	"evan7" : new Tone.Buffer("./audio/evan/evan7.mp3"),
	"evan8" : new Tone.Buffer("./audio/evan/evan8.mp3"),
	"evan9" : new Tone.Buffer("./audio/evan/evan9.mp3"),
	"evan10" : new Tone.Buffer("./audio/evan/evan10.mp3"),
	"evan11" : new Tone.Buffer("./audio/evan/evan11.mp3"),
	"evan12" : new Tone.Buffer("./audio/evan/evan12.mp3")
};
*/

var ianVoices = new Tone.Buffers({
	"ian1" : "./audio/ian/ian1.mp3",
	"ian2" : "./audio/ian/ian2.mp3",
	"ian3" : "./audio/ian/ian3.mp3",
	"ian4" : "./audio/ian/ian4.mp3",
	"ian5" : "./audio/ian/ian5.mp3",
	"ian6" : "./audio/ian/ian6.mp3",
	"ian7" : "./audio/ian/ian7.mp3",
	"ian8" : "./audio/ian/ian8.mp3",
	"ian9" : "./audio/ian/ian9.mp3",
	"ian10" : "./audio/ian/ian10.mp3",
	"ian11" : "./audio/ian/ian11.mp3",
	"ian12" : "./audio/ian/ian12.mp3",
	"ian13" : "./audio/ian/ian13.mp3"
});

function updateTimeDisplay() {
	requestAnimationFrame(updateTimeDisplay);
	//the time elapsed in seconds
	document.querySelector('#seconds').textContent = Tone.Transport.seconds.toFixed(2);
	document.querySelector('#beats').textContent = Tone.Transport.position;
}

Tone.Transport.loopEnd = '4m';
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 120.0;

var ch1Grain = {};
var ch2Conv = {};

var ch = [{}, {}, {}, {}];

ch[1].grainSrc = new Tone.GrainPlayer({
	"url" : "./audio/empath.mp3",
	"loop" : true,
	"grainSize" : 0.2,
	"overlap" : 0.001,
	"drift" : 10,
	"playbackRate" : 0.5,
});

//channel 1
ch[1].pingPong = new Tone.PingPongDelay(0.3, 0.4);
ch[1].vol = new Tone.Volume(-10);
ch[1].grainSrc.chain(ch[1].pingPong, ch[1].vol, Tone.Master);

//channel 2
ch[2].playerSrc = new Tone.Player({
			"url" : "./audio/evan/evan2.mp3",
			"retrigger" : true,
			"playbackRate" : 1
		});
ch[2].vol = new Tone.Volume(-20);
ch[2].convolver = new Tone.Convolver("./audio/impulse.wav");

ch[2].playerSrc.chain(ch[2].vol, ch[2].convolver, Tone.Master);
ch[2].convolver.wet = 1;

//channel 3
ch[3].textureSrc = new Tone.Player({
			"url" : "./audio/ocean.mp3",
			"playbackRate" : 1.2

		});
ch[3].vol = new Tone.Volume(-4);
ch[3].textureSrc.chain(ch[3].vol, Tone.Master);
//ch[3].vol.mute = true;

//function reBuffer(){
//	  ch[2].playerSrc.buffer = evanVoices.get("evan" + evanVoxNum);
//}

var voxNum;
function playVoice(time){
	ch[3].textureSrc.stop(time);
	voxNum = Math.floor(Math.random()*12)+1;
	ch[2].playerSrc.buffer = evanVoices["evan" + voxNum];
	ch[2].playerSrc.start(time);
	ch[3].textureSrc.start(time, voxNum);
}

var loop = new Tone.Loop(function(time){
	ch[1].grainSrc.scrub(Tone.Time(Math.random()*3)+1);
}, 0.4 ).start(0);

var loop2 = new Tone.Loop(function(time){
	playVoice("+0.3");
}, 0.9 ).start(0);

var ambientSynth = new Tone.PolySynth(6, Tone.Synth, {
	"oscillator" : {
		"type": "sine"
	},
	"envelope": {
		"attack": 4,
		"decay": 1,
		"sustain": 0.5,
		"release": 5
	}
});

var lfo = new Tone.LFO("1m", -30, 30);
lfo.connect(ambientSynth.detune);
lfo.start();

var pitchShift = new Tone.PitchShift(7).toMaster();
pitchShift.wet = 0.3;
pitchShift.feedback = 0.5;

var synthPingPong = new Tone.PingPongDelay(.4, 0.7).toMaster();

ambientSynth.chain(pitchShift, synthPingPong, Tone.Master);

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

getJSON('seq1.json',
function(err, data) {
  if (err != null) {
  	throw err;
  } else {
    var midi = data;
    var midiPart = new Tone.Part(function(time, note) {
	    //use the events to play the synth
	    ambientSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
	}, midi.tracks[0].notes).start();
  }
});

var loop = new Tone.Loop(function(time){
	player.scrub(Tone.Time(Math.random(10)*3));
}, .4);

// loop.start(0);

Tone.Transport.start('+1');
updateTimeDisplay();
