export const arrayBuffer2String = (buffer) => {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

export function String2Ab(str) {
	let buffer = new ArrayBuffer(1)
	let dataView = new DataView(buffer)
	dataView.setUint8(0, str.charCodeAt(0))
	return buffer;
}
