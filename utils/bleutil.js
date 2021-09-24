export const arrayBuffer2String = (buffer) => {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

