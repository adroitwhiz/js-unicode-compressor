function compressSurrogates(input) {
	const highSurrogate = 0xD8 << 8;
	const lowSurrogate = 0xDC << 8;
	const unicodeChars = [];
	if (input.length % 2 === 1) input += ' ';

	for (let i = 0; i < input.length; i += 2) {
		const a = input.charCodeAt(i);
		const b = input.charCodeAt(i + 1);

		if (a > 255 || b > 255) throw new Error(`Out-of-range character`);

		unicodeChars.push(String.fromCharCode(a | highSurrogate, b | lowSurrogate))
	}

	const unicodeString = unicodeChars.join('');
	return `eval(unescape(escape\`${unicodeString}\`.replace(/u../g, '')))`;
}

function compressBytes(input) {
	const unicodeChars = [];
	if (input.length % 2 === 1) input += ' ';

	for (let i = 0; i < input.length; i += 2) {
		const a = input.charCodeAt(i);
		const b = input.charCodeAt(i + 1);

		if (a > 255 || b > 255) throw new Error(`Out-of-range character`);

		unicodeChars.push(String.fromCharCode((a << 8) | b));
	}

	const unicodeString = unicodeChars.join('');
	return `eval(unescape(escape\`${unicodeString}\`.replace(/u(..)/g,"$1%")))`;
}