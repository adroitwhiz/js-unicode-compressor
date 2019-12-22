const compressionOptionSurrogates = document.getElementById('compress-surrogates');
const compressionOptionBytes = document.getElementById('compress-bytes');
const inputArea = document.getElementById('input');
const outputArea = document.getElementById('output');
const charCountUncompressed = document.getElementById('character-count-uncompressed');
const charCountCompressed = document.getElementById('character-count-compressed');

const charCountString = str => {
	return `${str.length} UTF-16 code units / ${[...str].length} characters`;
};

const recompress = () => {
	const uncompressed = inputArea.value;

	let compressed;
	if (compressionOptionSurrogates.checked) {
		compressed = compressSurrogates(uncompressed);
	} else if (compressionOptionBytes.checked) {
		compressed = compressBytes(uncompressed);
	}

	outputArea.innerText = compressed;
	charCountCompressed.innerText = 'Compressed: ' + charCountString(compressed);
}

fetch('compress.js')
	.then(response => response.text())
	.then(responseText => {
		inputArea.value = responseText;
		inputArea.dispatchEvent(new Event('input'));
	});

let timeout = null;

inputArea.addEventListener('input', () => {
	inputArea.style.height = 0;
	inputArea.style.height = inputArea.scrollHeight + 'px';

	charCountUncompressed.innerText = 'Uncompressed: ' + charCountString(inputArea.value);

	if (timeout !== null) clearTimeout(timeout);

	timeout = setTimeout(() => {
		recompress();
		timeout = null;
	}, 500);
});

compressionOptionSurrogates.addEventListener('change', recompress);
compressionOptionBytes.addEventListener('change', recompress);

inputArea.dispatchEvent(new Event('input'));
