const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

app.use(express.static("public"));
app.use(express.json());

function checkfileexist(no) {
	if (!fs.existsSync("./images")) fs.mkdirSync("./images");
	return new Promise((resolve) => {
		fs.readdir("./images", (error, file) => {
			for (let value of file) {
				if (path.basename(value, path.extname(value)) === no) resolve(value);
			}
			resolve(false);
		});
	});
}

app.get("/images/:no", async (req, res) => {
	const no = req.params.no;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			res.status(200).sendFile(path.resolve("./images/" + filename));
		} else {
			res.status(404).json({
				message: "The Image is not exist, input 'no': " + no,
			});
		}
	} else {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
});

app.post("/images", async (req, res) => {
	console.log(req);
	res.send();
});

app.put("/images/:no", async (req, res) => {
	const no = req.params.no;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			res.status(200).sendFile(path.resolve("./images/" + filename));
		} else {
			res.status(404).json({
				message:
					"The Image is not exist, input 'no': " +
					no +
					" , You can use POST request instead of PUT.",
			});
		}
	} else {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
});

app.delete("/images/:no", async (req, res) => {
	const no = req.params.no;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			fs.unlinkSync(path.resolve("./images", filename));
			res.status(204).send();
		} else {
			res.status(404).json({
				message: "The Image is not exist, input 'no': " + no,
			});
		}
	} else {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
});

app.head("/images/:no", async (req, res) => {
	const no = req.params.no;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			res.status(200).sendFile("images/" + no);
		} else {
			res.status(404).json({
				message: "The Image is not exist, input 'no': " + no,
			});
		}
	} else {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
});

app.options("/images/:no", async (req, res) => {
	const no = req.params.no;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			res.setHeader("Allow", "GET, PUT, DELETE, HEAD, OPTIONS");
			res.status(204).send();
		} else {
			res.setHeader("Allow", "PUT, HEAD, OPTIONS");
			res.status(204).send();
		}
	} else {
		res.setHeader("Allow", "HEAD, OPTIONS");
		res.status(204).send();
	}
});
app.options("/images", (req, res) => {
	res.setHeader("Allow", "POST, OPTIONS");
	res.status(204).send();
});

app.listen(8080, () => {
	console.log("server start!");
});
