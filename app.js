const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/practice2",{
    useNewUrlParser:true
});
const articleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",articleSchema);
app.get("/articles",function(req,res){
    Article.find(function(err,articles){
        if(articles){
            const jsonArticles=JSON.stringify(articles);
            res.send(jsonArticles);
        }else{
            res.send("No articles currently in the practice2");
        }
    });
})
app.post("/articles",function(req,res){
    const newArticle=Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
        
    })
app.delete("/articles",function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all the articles in the practice2")
        }else{
            res.send(err);
        }

    });
})
app.get("/articles/:articleTitle",function(req,res){
    const articleTitle=req.params.articleTitle;
    Article.findOne({title:articleTitle},function(err,article){
        if(article){
            const jsonArticle=JSON.stringify(article);
            res.send(jsonArticle);
        }else{
            res.send("No article with that title found");
        }
    });
})
app.put("/articles/:articleTitle",function(req,res){
    Article.update(
        {title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{overwrite:true},function(err){
        if(!err){
            res.send("Successfully updated the content of the selected article");
        }else{
            res.send(err);
        }
    });

})
app.delete("/articles/:articleTitle",function(req,res){
    const articleTitle=req.params.articleTitle;
    Article.findOneAndDelete({title:articleTitle},function(err){
        if(!err){
            res.send("article deleted successfully");
        }else{
            res.send(err);
        }
    });
})
app.patch("/articles/:articleTitle",function(req,res){
    Article.findOneAndUpdate({title:req.params.articleTitle},{$set:req.body},function(err){
        if(!err){
            res.send("Successfully upadated the article");
        }else{
            res.send(err);
        }
    });
})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});