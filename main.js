document.addEventListener("click", () => { initAudio() }, {once: true})

document.querySelector("#play-button").addEventListener("click", () => {
	let freqs = []
	notes.forEach((n) => {
		if (n.cb.checked) {
			freqs.push(n.freq)
		}
	})
	if (freqs.length > 0) {
		playNotes(freqs)
	}
})

var ctx = new AudioContext()
var attackTime = 0.01
var decayTime = 0.02
var sustainLevel = 0.5
var sustainTime = 0.2
var releaseTime = 0.5

const notes = [
	createNote("C", 40),
	createNote("C#", 41),
	createNote("D", 42),
	createNote("D#", 43),
	createNote("E", 44),
	createNote("F", 45),
	createNote("F#", 46),
	createNote("G", 47),
	createNote("G#", 48),
	createNote("A", 49),
	createNote("A#", 50),
	createNote("B", 51),
	//createNote("C2", 52),
]

function initAudio() {
	ctx.resume()

	notes.forEach((n, index) => {
		let el = document.querySelector(`#${CSS.escape(n.note)}`)
		el.addEventListener("click", (e) => {
			if (e.target == el) {
				playNotes([n.freq])
			}
		})

		let cb = document.createElement("input")
		cb.type = "checkbox"
		el.appendChild(cb)

		n.cb = cb
	})
}

function playNotes(freqs) {
	let gain = ctx.createGain()
	gain.connect(ctx.destination)

	freqs.forEach((f) => {
		let oscillator = ctx.createOscillator()
		oscillator.type = "sine"
		oscillator.frequency.setValueAtTime(f, ctx.currentTime)
		oscillator.connect(gain)
		oscillator.start()
	})

	gain.gain.setValueAtTime(0, ctx.currentTime)
	gain.gain.setTargetAtTime(0.5, ctx.currentTime, attackTime / 3)
	gain.gain.setTargetAtTime(0.5 * sustainLevel, ctx.currentTime + attackTime, decayTime / 3)
	gain.gain.setTargetAtTime(0, ctx.currentTime + attackTime + decayTime + sustainTime, releaseTime / 3)
}

function getKeyFrequency(n) {
	return Math.pow(2, (n - 49) / 12) * 440
}

function createNote(note, keyNumber) {
	return {
		note: note,
		freq: getKeyFrequency(keyNumber),
	}
}
