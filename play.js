
var t = Tone.Time(10);
var ch1Grain = {};
var ch2Conv = {};

var ch = [{}, {}, {}];

ch[1].grainSrc = new Tone.GrainPlayer({
			"url" : "./audio/empath.wav",
			"loop" : true,
			"grainSize" : 0.2,
			"overlap" : 0.001,
			"drift" : 10,
			"playbackRate" : 0.5,
		});
ch[1].pingPong = new Tone.PingPongDelay(0.3, 0.4);
ch[1].vol = new Tone.Volume(0);
ch[1].grainSrc.chain(ch[1].pingPong, ch[1].vol, Tone.Master);

ch[2].samplerSrc = new Tone.Sampler("./audio/evan/2_12.wav").toMaster();
ch[2].convolver = new Tone.Convolver("./audio/desert.wav");

ch[1].vol.mute = true;
ch[2].convolver.wet = 100;

var loop = new Tone.Loop(function(time){
	ch[1].grainSrc.scrub(Tone.Time(Math.random(10)*3)+1);
	ch[2].samplerSrc.triggerAttack(-5);
}, 0.4 ).start(0);

Tone.Transport.start("+1");




/*
setInterval(function() {
	player.scrub(Tone.Time(Math.random(10)*3)+1);
}, 400);
*/
