
var t = Tone.Time(10);

var player = new Tone.GrainPlayer({
			"url" : "./empath.wav",
			"loop" : true,
			"grainSize" : 0.2,
			"overlap" : 0.001,
			"drift" : 10,
			"playbackRate" : 0.5,
		}).toMaster()

var pingPong = new Tone.PingPongDelay(0.3, 0.4).toMaster();
var connect = player.connect(pingPong);

setInterval(function() {
	player.scrub(Tone.Time(Math.random(10)*3)+1);
}, 400)
