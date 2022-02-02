const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const moongose = require("mongoose")

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

moongose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
}

const Item = moongose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Welcome to your todolist!"
})
const item2 = new Item({
    name: "Hit the + button to add an item"
})
const item3 = new Item({
    name: "- Hit this to delete an intem"
})
const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = moongose.model("List", listSchema)

app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("added new datas");
                }
            })
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    })


});

app.post("/", function (req, res) {
    const itemName = req.body.toDo;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/")
})

app.post("/delete", function (req, res) {
    const itemId = req.body.checkbox
    Item.findByIdAndRemove(itemId, function (err) {
        if (!err) {
            console.log("Successfully deleted item");
            res.redirect("/")
        }
    })
})

app.get("/:listName", function (req, res) {
    const listName = req.params.listName

    List.findOne({ name: listName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: listName,
                    items: defaultItems
                })

                list.save()
                res.redirect("/"+listName)
            } else {
                res.render("list", { listTitle:foundList.name, newListItems: foundList.items});
            }
        }
    })
})

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});