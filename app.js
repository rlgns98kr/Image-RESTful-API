require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

function checkfileexist(no) {
	if (!fs.existsSync("./images")) fs.mkdirSync("./images");

	let filenames = fs.readdirSync("./images");
	for (let filename of filenames)
		if (filename.replace(path.extname(filename), "") === no) return filename;
	return false;
}

app.get("/images/:no", cors(), async (req, res) => {
	const no = req.params.no;
	if (/^[0-9]+$/.test(no)) {
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

app.post("/images", cors(), async (req, res) => {
	const no = req.body.no;
	const image = req.body.image;
	if (/^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (!filename) {
			if (image) {
				let file = req.body.image.match(/^data:([A-Za-z]+)\/([A-Za-z]+);base64,(.+)$/);
				if (
					file &&
					file.index === 0 &&
					file[1] === "image" &&
					file.length === 4 &&
					(file[2] === "jpeg" || file[2] === "gif" || file[2] === "png")
				) {
					let data = new Buffer.from(file[3], "base64");
					try {
						fs.writeFileSync(path.resolve("./images/" + no + "." + file[2]), data);
						res.status(201).send();
					} catch (e) {
						res.status(409).json({
							message: "File upload error! Please try later.",
						});
					}
				} else {
					res.status(400).json({
						message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload",
					});
				}
			} else {
				res.status(400).json({
					message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload",
				});
			}
		} else {
			res.status(409).json({
				message:
					"The Image is already exist, input 'no': " + no + ", You can use PUT Method!",
			});
		}
	} else if (no) {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	} else {
		res.status(400).json({
			message: "'no'(body) is the essential value as Number!",
		});
	}
});

app.put("/images/:no", cors(), async (req, res) => {
	const no = req.params.no;
	const image = req.body.image;
	if (/^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (image) {
			let file = req.body.image.match(/^data:([A-Za-z]+)\/([A-Za-z]+);base64,(.+)$/);
			if (
				file &&
				file.index === 0 &&
				file[1] === "image" &&
				file.length === 4 &&
				(file[2] === "jpeg" || file[2] === "gif" || file[2] === "png")
			) {
				let data = new Buffer.from(file[3], "base64");
				try {
					if (filename) fs.unlinkSync(path.resolve("./images/" + filename));
					fs.writeFileSync(path.resolve("./images/" + no + "." + file[2]), data);
					res.status(201).send();
				} catch (e) {
					res.status(409).json({
						message: "File upload error! Please try later.",
					});
				}
			} else {
				res.status(400).json({
					message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload",
				});
			}
		} else {
			res.status(400).json({
				message: "Invalid 'image'(body)! JPEG,PNG,GIF is only possible to upload",
			});
		}
	} else {
		res.status(400).json({
			message: "'no'(body) must be Number, input 'no': " + no,
		});
	}
});

app.delete("/images/:no", cors(), async (req, res) => {
	const no = req.params.no;
	if (/^[0-9]+$/.test(no)) {
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

app.head("/images/:no", cors(), async (req, res) => {
	const no = req.params.no;
	if (/^[0-9]+$/.test(no)) {
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
	res.setHeader("Access-Control-Allow-Origin", "*");
	if (no && /^[0-9]+$/.test(no)) {
		const filename = await checkfileexist(no);
		if (filename) {
			cors({ methods: "GET, PUT, DELETE, HEAD, OPTIONS" });
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
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Allow", "HEAD, POST, OPTIONS");
	res.status(204).send();
});

app.get("/images", cors(), (req, res) => {
	res.status(400).json({
		message: "'no'(body) is the essential value as Number!",
	});
});
app.put("/images", cors(), (req, res) => {
	res.status(400).json({
		message: "'no'(body) is the essential value as Number!",
	});
});
app.delete("/images", cors(), (req, res) => {
	res.status(400).json({
		message: "'no'(body) is the essential value as Number!",
	});
});

app.listen(process.env.PORT, () => {
	console.log("server start!");
});
