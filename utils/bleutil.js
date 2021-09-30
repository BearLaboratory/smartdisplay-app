export const arrayBuffer2String = (buffer) => {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

export function String2Ab(str) {
	let buffer = new ArrayBuffer(str.length)
	let dataView = new DataView(buffer)
	for (var i = 0; i < str.length; i++) {
		dataView.setUint8(i, str.charCodeAt(i))
	}

	return buffer;
}

export function isChinese(s) {
	return /[\u4e00-\u9fa5]/.test(s);
}

export function ch2Unicdoe(str) {
	if (!str) {
		return;
	}
	var unicode = '';
	for (var i = 0; i < str.length; i++) {
		var temp = str.charAt(i);
		if (isChinese(temp)) {
			unicode += String.raw`\u${temp.charCodeAt(0).toString(16)}`
			// unicode += '\\u' + temp.charCodeAt(0).toString(16);
		} else {
			unicode += temp;
		}
	}
	return unicode;
}
