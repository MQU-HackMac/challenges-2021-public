function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLetter() {
	let alphabet = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	];
	return alphabet[rand(0, alphabet.length - 1)];
}

function getRandomWord(word: HTMLElement) {
	let text = word.innerHTML;

	let finalWord = '';
	for (let i = 0; i < text.length; i++) {
		finalWord += text[i] === ' ' ? ' ' : getRandomLetter();
	}

	return finalWord;
}
export function animateTitle(autoInterval: number) {
	let word = document.querySelector('h1');
	let interv: NodeJS.Timeout;
	let canChange = false;
	let globalCount = 0;
	let count = 0;
	let isGoing = false;
	let leet = true;

	function init() {
		let FINAL_WORD = leet
			? '7R4N5L473 1N70 7H3 5UP3R10R 70N6U3'
			: 'Translate into the superior tongue';

		if (isGoing) return;

		isGoing = true;
		let randomWord = getRandomWord(word);
		word.innerHTML = randomWord;

		interv = setInterval(function () {
			let finalWord = '';
			for (let x = 0; x < FINAL_WORD.length; x++) {
				if (x <= count && canChange) {
					finalWord += FINAL_WORD[x];
				} else {
					finalWord += FINAL_WORD[x] === ' ' ? ' ' : getRandomLetter();
				}
			}
			word.innerHTML = finalWord;
			if (canChange) {
				count++;
			}
			if (globalCount >= 20) {
				canChange = true;
			}
			if (count >= FINAL_WORD.length) {
				clearInterval(interv);
				leet = !leet;
				count = 0;
				canChange = false;
				globalCount = 0;
				isGoing = false;
			}
			globalCount++;
		}, 50);
	}

	word.addEventListener('mouseenter', init);

	setInterval(() => {
		init();
	}, autoInterval * 1000);
}
