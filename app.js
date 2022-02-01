const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const moongose=require("mongoose")

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

moongose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
    name:String
}

const Item=moongose.model("Item",itemsSchema);
const item1=new Item({
    name:"Welcome to your todolist!"
})
const item2=new Item({
    name:"Hit the + button to add an item"
})
const item3=new Item({
    name:"- Hit this to delete an intem"
})
const defaultItems=[item1,item2,item3];


app.get("/", function (req, res) {
    
    Item.find({},function (err,foundItems) {

        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err) {
                if(err){
                    console.log(err)
                }else{
                    console.log("added new datas");
                }
            })
            res.redirect("/");
        }else{
            res.render("list", { listTitle:"Today",newListItems:foundItems });
        }
    })

    
});

app.post("/",function(req,res){
    const itemName=req.body.toDo;
    const item=new Item({
        name:itemName
    });
    item.save();
    res.redirect("/")
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.post("/work",function(req,res){
    let item=req.body.toDo;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});