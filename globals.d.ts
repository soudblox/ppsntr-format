declare var DOMPurify: {
	sanitize: (dirty: string) => string;
};

type FormatInput = {
	text: string;
}