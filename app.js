const express = require("express");
const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/images/:no", (req, res) => {
	const no = req.params.no;
});

app.post("/images", (req, res) => {});

app.put("/images/:no", (req, res) => {
	const no = req.params.no;
});

app.delete("/images/:no", (req, res) => {
	const no = req.params.no;
});

app.listen(8080, () => {
	console.log("server start!");
});
