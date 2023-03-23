const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");
const accountInfo = require("./config.js");
const _ = require("lodash");

const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// running on cloud
mongoose.connect(
  "mongodb+srv://" +
    accountInfo.userName +
    ":" +
    accountInfo.password +
    "@cluster0.jozc6.mongodb.net/todolistDB"
);

// running on local host
// mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Add /newListName to above address to add new list!",
});

const item2 = new Item({
  name: "Tap + button to add an item!",
});

const item3 = new Item({
  name: "Click checkbox to delete item!",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  const day = date.getDate();
  Item.find({}, function (err, docs) {
    if (docs.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully insert default data");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: docs });
    }
  });
});

app.get("/:newListName", function (req, res) {
  const newListName = _.capitalize(req.params.newListName);
  List.findOne({ name: newListName }, function (err, docs) {
    if (!docs) {
      List.create({ name: newListName, items: defaultItems }, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully added new list");
        }
      });
      setTimeout(() => {
        res.redirect("/" + newListName);
      }, 3000);
    } else {
      res.render("list", { listTitle: docs.name, newListItems: docs.items });
    }
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  if (listName === "Today") {
    Item.create({ name: itemName }, function (err) {});
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $push: { items: { name: itemName } } },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Item added");
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(req.body);

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Checked item deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Checked item deleted");
          res.redirect("/" + listName);
        }
      }
    );
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully.");
});
