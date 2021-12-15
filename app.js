var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const ejs = require("ejs");
var app = express();
var alert = require("alert");
const mongoose = require("mongoose");
const e = require("express");
mongoose.connect("mongodb+srv://admin:admin@cluster0.yfdad.mongodb.net/appDB");
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const searchSchema = mongoose.Schema({
  page: String,
});

const searcha = [
  {
    page: "sun",
  },
  {
    page: "leaves",
  },
  {
    page: "tennis",
  },
  {
    page: "boxing",
  },
  {
    page: "galaxy",
  },
  {
    page: "iphone",
  },
];

const Search = mongoose.model("page", searchSchema);
// Search.insertMany(searcha, function (err) {
//   if (err) {
//     console.log(err);
//   }
// });
const accountsSchema = mongoose.Schema({
  username: String,
  pass: String,
});
const cartSchema = mongoose.Schema({
  item: String,
});
const Cart = mongoose.model("item", cartSchema);
const Account = mongoose.model("account", accountsSchema);

app.get("/", function (req, res) {
  res.render("login");
});
app.get("/galaxy", function (req, res) {
  res.render("galaxy");
});
app.get("/iphone", function (req, res) {
  res.render("iphone");
});
app.get("/leaves", function (req, res) {
  res.render("leaves");
});
app.get("/sun", function (req, res) {
  res.render("sun");
});

app.get("/boxing", function (req, res) {
  res.render("boxing");
});
app.get("/tennis", function (req, res) {
  res.render("tennis");
});
app.get("/phones", function (req, res) {
  res.render("phones");
});
app.get("/books", function (req, res) {
  res.render("books");
});
app.get("/sports", function (req, res) {
  res.render("sports");
});
app.get("/cart", function (req, res) {
  Cart.find({}, function (err, c) {
    if (err) {
      console.log(err);
    } else {
      res.render("cart", { cart: c });
    }
  });
});

app.get("/registration", function (req, res) {
  res.render("registration");
});

app.post("/login", function (req, res) {
  let flag = false;
  Account.find({}, function (err, account) {
    if (err) {
      console.log(err);
    } else {
      account.forEach(function (a) {
        if (a.username == req.body.username && a.pass == req.body.password) {
          flag = true;
        }
      });
      if (flag == false) {
        alert("wrong username or password");
      } else {
        res.render("home");
      }
    }
  });
});

app.post("/register", function (req, res) {
  Account.find({}, function (err, account) {
    let flag = true;
    if (err) {
      console.log(err);
    } else {
      account.forEach(function (a) {
        if (a.username === req.body.username) {
          flag = false;
        }
      });
      if (flag == false) {
        alert("Username is already taken");
      } else {
        const a1 = new Account({
          username: req.body.username,
          pass: req.body.password,
        });
        a1.save();
        res.redirect("/");
      }
    }
  });
});

app.post("/cart", function (req, res) {
  const c1 = new Cart({
    item: req.body.b,
  });
  c1.save();
});

app.post("/removeC", function (req, res) {
  x = req.body.delete;
  Cart.findOneAndRemove({ id: x }, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/cart");
  });
});

app.post("/search", function (req, res) {
  Search.findOne({ page: req.body.Search }, function (err, f) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/" + f.page);
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log("server is running");
});

// async function main() {
//   var { MongoClient } = require("mongodb");
//   var url =
//     "mongodb+srv://admin:admin@cluster0.yfdad.mongodb.net/firstdb?retryWrites=true&w=majority";
//   var client = new MongoClient(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   await client.connect();
// }
