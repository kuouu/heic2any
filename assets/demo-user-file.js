let numOfFile = 0;

document.getElementById("user-file").addEventListener("change", async (ev) => {
	document.getElementById("error-on-try").innerHTML = "";
	document.getElementById("error-on-try").style.display = "none";
	numOfFile = ev.target.files.length;
	console.log(ev.target.files.length);
	processFile(ev.target.files)
});

function saveFile(blob, filename) {
	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		var a = document.createElement("a");
		document.body.appendChild(a);
		var url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		setTimeout(function () {
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		}, 0);
	}
}

const processFile = async (files) =>
	Array.from(files).forEach(blob => {
		setLoading(true);
		heic2any({
			blob: blob,
			toType: "image/png",
		})
			.then(function (resultBlob) {
				const filename = String(blob.name).split('.')[0];
				numOfFile -= 1;
				updateLoadingText(numOfFile);
				if (!numOfFile) setLoading(false);
				saveFile(resultBlob, filename + ".png");
			})
			.catch(function (x) {
				setLoading(false);
				document.getElementById("error-on-try").style.display = "block";
				document.getElementById("error-on-try").innerHTML =
					"Error code: <code>" + x.code + "</code> " + x.message;
			});
	});

const setLoading = (flag) => {
	const spinner = document.getElementById("modal");
	if (flag) {
		spinner.style.display = "flex";
	}
	else {
		spinner.style.display = "none";
	}
}

const updateLoadingText = (num) => {
	const loadingText = document.getElementById("loading-text");
	loadingText.innerHTML = `processing ${num} files...`;
}
