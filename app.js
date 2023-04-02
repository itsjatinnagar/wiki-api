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

app.route("/articles")
    .get(function (_, res) {
        Article.find()
            .then((articles) => res.send(articles))
            .catch((error) => res.send(error));
    })
    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        article
            .save()
            .then(() => res.send("Successfully added a new article"))
            .catch((error) => res.send(error));
    })
    .delete(function (_, res) {
        Article.deleteMany()
            .then(() => res.send("Successfully deleted all articles"))
            .catch((error) => res.send(error));
    });

app.route("/articles/:title")
    .get(function (req, res) {
        Article.findOne({ title: req.params.title })
            .then(function (result) {
                if (result) {
                    res.send(result);
                } else {
                    res.statusCode = 404;
                    res.send("Article Not Found");
                }
            })
            .catch((error) => res.send(error));
    })
    .put(function (req, res) {
        Article.findOneAndReplace(
            { title: req.params.title },
            { title: req.body.title, content: req.body.content }
        )
            .then(() => res.send("Successfully updated the Article"))
            .catch((error) => res.send(error));
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
