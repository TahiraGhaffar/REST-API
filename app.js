//jshint esversion:6

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

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewURLParser : true}); //27017 is DEFAULT PORT mongodb likes to use

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article", articleSchema );//here orange "Article" is collection name, mongodb will automatically convert
// "Article" into "articles", means 1st letter small & PLURAL WORD


///////////////////////////////   REQUESTS TARGETING ALL ARTICLES ///////////////////////////////////
app.route("/articles")

.get(function(req,res){
    Article.find(function(err, foundArticles){
        //console.log(foundArticles);
        if(!err){
            res.send(foundArticles); //showing response to CLIENT SIDE 
        } else{
            res.send(err);
        }
        
    });
}) //not putting ';' here, b/c we want it to move to 'post' as soon as 'get' ends

.post(function(req, res){
    console.log(),
    console.log()

    //creating a Document 
    const newArticle = new Article({ //const constName = new ModelName({ key : value}) ;
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save(function(err){   //constName.save(callbacl function to check if any error)
        if(!err){
            res.send("Successfully saved a new article into database"); //responding back to CLIENT that no error
        }else{
            res.send(err);//responding back to CLIENT if any ERROR
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        }else{
            res.send(err);
        }
    });
});


////////////////////////////// REQUESTS TARGETING A SPECIFIC ARTICLE ////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({ title : req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article matching that title was found !");
        }
    });
})

.put(function(req,res){
    Article.updateOne(
        { title : req.params.articleTitle},
        {title : req.body.title, content : req.body.content},
       // {overwrite : true} , // overwrite will overwrite the previously entered key:value in database
        function(err){// like previously DB had keys: title & content, and POSTMAN also has new values for title&content
            // so those previous values will be overwritten now(UPDATED)
            if(!err){
                res.send("Successfully updated Article");
            }else{
                res.send(err);
            }
        });
})

.patch(function(req,res){
    Article.updateOne(
        {title : req.params.articleTitle}, 
        {$set : req.body}, //set used to specify only 'req.body' , means to Update only what have been specified in
        function(err){ //POSTMAN's body 
            if(!err){
                res.send("Successfully updated Article.");
            }else{
                res.send(err);
            }
        });
})

.delete(function(req,res){
    Article.deleteOne(
        {title : req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted corressponding article.");
            }else{
                res.send(err);
            }
        });
});


//TODO

app.listen(3001, function() {
  console.log("Server started on port 3001");
});