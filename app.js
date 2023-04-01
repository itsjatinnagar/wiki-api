const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({ title: String, content: String });

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function (req, res) {
    Article.find()
        .then((articles) => res.send(articles))
        .catch((error) => res.send(error));
});

app.post("/articles", function (req, res) {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
    });

    article
        .save()
        .then(() => res.send("Successfully added a new article"))
        .catch((error) => res.send(error));
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
