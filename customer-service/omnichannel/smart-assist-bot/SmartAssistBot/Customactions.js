// This will open the KB - Should match with the adaptive card action button definition
window.top.OpenURL = function (params) {
	return new Promise(function (resolve, reject) {
		window.open(params.kbLink);
		resolve("Applied!");
	});
}
