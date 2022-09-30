export function isEllipsisActive(element) {
	if (!element) return false;
	return (element.scrollHeight > element.clientHeight);
}
