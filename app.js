const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");
const mime = require("mime");

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

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
	} else if (no) {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
	else {
		res.status(400).json({
			message: "'no'(body) is the essential value as Number!"
		});
	}
});

app.post("/images", async (req, res) => {
	const no = req.body.no;
	const image = req.body.image;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (!filename) {
			if (image) {
				let file = req.body.image.match(/^data:([A-Za-z]+)\/([A-Za-z]+);base64,(.+)$/);
				if (file.index === 0) {
					if (file[1] === "image") {
						if (file.length === 4 && (file[2] === "jpeg" || file[2] === "gif" || file[2] === "png")) {
							let data = new Buffer.from(file[3], "base64");
							let type = mime.getExtension(file[1] + '/' + file[2]);
							try {
								fs.writeFileSync(path.resolve("./images/" + no + '.' + type), data);
								res.status(201).send();
							} catch (e) {
								res.status(409).json({
									message: "File upload error! Please try later."
								})
							}
						} else {
							res.status(400).json({
								message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload"
							})
						}
					} else {
						res.status(400).json({
							message: "'image'(body) is not image type!"
						})
					}
				} else {
					res.status(400).json({
						message: "'image'(body) is not valid on Base64"
					})
				}
			} else {
				res.status(400).json({
					message: "'image'(body) is the essential value as Base64"
				})
			}
		} else {
			res.status(409).json({
				message: "The Image is already exist, input 'no': " + no + ", You can use PUT Method!",
			});
		}
	} else if (no) {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	} else {
		res.status(400).json({
			message: "'no'(body) is the essential value as Number!"
		});
	}
});

app.put("/images/:no", async (req, res) => {
	const no = req.params.no;
	const image = req.body.image;
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (image) {
			let file = req.body.image.match(/^data:([A-Za-z]+)\/([A-Za-z]+);base64,(.+)$/);
			if (file.index === 0) {
				if (file[1] === "image") {
					if (file.length === 4 && (file[2] === "jpeg" || file[2] === "gif" || file[2] === "png")) {
						let data = new Buffer.from(file[3], "base64");
						let type = mime.getExtension(file[1] + '/' + file[2]);
						try {
							fs.writeFileSync(path.resolve("./images/" + no + '.' + type), data);
							res.status(201).send();
						} catch (e) {
							res.status(409).json({
								message: "File upload error! Please try later."
							})
						}
					} else {
						res.status(400).json({
							message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload"
						})
					}
				} else {
					res.status(400).json({
						message: "'image'(body) is not image type!"
					})
				}
			} else {
				res.status(400).json({
					message: "'image'(body) is not valid on Base64"
				})
			}
		} else {
			res.status(400).json({
				message: "'image'(body) is the essential value as Base64"
			})
		}
	} else if (no) {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	} else {
		res.status(400).json({
			message: "'no'(body) is the essential value as Number!"
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
