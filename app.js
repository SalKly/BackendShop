var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
const ejs = require("ejs");
var app = express();
var alert = require("alert");
const mongoose = require("mongoose");
const e = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// INITIALIZE SESSIONS
app.use(
  session({
    secret: "the app secrete.",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 900000 },
  })
);
// INITIALAIZE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin:admin@cluster0.yfdad.mongodb.net/appDB");

const accountsSchema = mongoose.Schema({
  username: String,
  pass: String,
  cart: [String],
});

var options = {
  errorMessages: {
    MissingPasswordError: "No password was given",
    AttemptTooSoonError: "Account is currently locked. Try again later",
    TooManyAttemptsError: "Account locked due to too many failed login attempts",
    NoSaltValueStoredError: "Authentication not possible. No salt value stored",
    IncorrectPasswordError: "Password or username are incorrect",
    IncorrectUsernameError: "Password or username are incorrect",
    MissingUsernameError: "No username was given",
    UserExistsError: "A user with the given username is already registered",
  },
};

accountsSchema.plugin(passportLocalMongoose, options);

const Account = mongoose.model("account", accountsSchema);
passport.use(Account.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Account.findById(id, function (err, user) {
    done(err, user);
  });
});

const cartSchema = mongoose.Schema({
  item: String,
});
// const Cart = mongoose.model("item", cartSchema);

const searchSchema = mongoose.Schema({
  page: String,
});

const searcha = [
  {
    page: "The Sun and Her Flowers",
  },
  {
    page: "Leaves of Grasses",
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

if (Search.findOne({}, function (err, found) {
  if (err) {
    console.log(err);
    console.log("error first  in find");
  }
  else {
    if (found == null) {
      console.log("reached the if condition");

      Search.insertMany(searcha, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("done adding");

        }
      });

    }
    else {
      console.log("already added");


    }
  }
}));


app.get("/", function (req, res) {
  res.render("login");
});
app.get("/galaxy", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("galaxy");
  } else {
    res.redirect("/");
  }
});
app.get("/iphone", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("iphone");
  } else {
    res.redirect("/");
  }
});
app.get("/leaves", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("leaves");
  } else {
    res.redirect("/");
  }
});
app.get("/sun", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("sun");
  } else {
    res.redirect("/");
  }
});
app.get("/home", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});
app.get("/boxing", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("boxing");
  } else {
    res.redirect("/");
  }
});
app.get("/tennis", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("tennis");
  } else {
    res.redirect("/");
  }
});
app.get("/phones", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("phones");
  } else {
    res.redirect("/");
  }
});
app.get("/books", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("books");
  } else {
    res.redirect("/");
  }
});
app.get("/sports", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("sports");
  } else {
    res.redirect("/");
  }
});
app.get("/cart", function (req, res) {
  if (req.isAuthenticated()) {
    Account.findById(req.user.id, function (err, found) {
      if (err) {
        console.log(err);
      } else {
        if (found) {
          if (found.cart !== null) {
            console.log(found.cart);
            res.render("cart", { cart: found.cart });
          }
        }
      }
    });
  } else {
    res.redirect("/");
  }
});
app.post("/cart", function (req, res) {
  let flag = true;
  const cartitem = req.body.b;
  Account.findById(req.user.id, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      if (found) {
        for (let i = 0; i < found.cart.length; i++) {
          if (found.cart[i] == cartitem) {
            flag = false;

          }
        }
        if (flag == false) {
          alert("item already added to the cart");
          res.redirect("/" + req.body.b);

        }
        else {
          found.cart.push(cartitem);

          found.save(function () {
            res.redirect("/" + req.body.b);
          });
          alert("item is successfully  added to your cart ");

        }

      }
    }
  });
});

app.get("/registration", function (req, res) {
  res.render("registration");
});

app.post("/login", function (req, res) {

  if (!req.body.username) {

    alert("please insert a username")
    res.redirect("/")
  };
  if (!req.body.password) {
    alert("please insert a password")
    res.redirect("/")
  };

  const account = new Account({
    username: req.body.username,
    pass: req.body.password,
  });


  req.login(account, function (err) {

    if (err) {
      res.send(err)

    } else {
      passport.authenticate("local")(req, res, function () {

        res.redirect("home");
      });
    }
  });
});

app.post("/register", function (req, res) {
  let flage = false;
  Account.register(
    { username: req.body.username },
    req.body.password,
    function (err, result) {
      if (err) {
        alert("" + err.message);
        res.redirect("/registration")
      } else {
        passport.authenticate("local")(req, res, function () {

          res.redirect("home");
        });
      }
    }
  );
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

// app.get("/search", function (req, res) {
//   if (req.isAuthenticated()) {
//     res.render("searchresults")
//   }
//   else {
//     res.redirect("/")
//   }

// })

app.get("/itemsF/:ToGo", function (req, res) {
  res.redirect("/" + req.params.ToGo);
});

app.post("/search", function (req, res) {
  Search.find(
    { page: { $regex: req.body.Search, $options: "i" } },
    function (err, found) {
      if (err) {
        console.log(err);
      } else {
        // if (found) {
        if (req.isAuthenticated) {
          for (let i = 0; i < found.length; i++) {
            if (found[i].page == "The Sun and Her Flowers") {
              found[i].page = "sun";
              console.log("edited the sun");
            }
            else {
              if (found[i].page == "Leaves of Grasses") {
                found[i].page = "leaves";
                console.log("edited the leaves");
              }


            }
          }

          res.render("searchresults", { items: found });
        } else {
          res.redirect("/");
        }

        // }
      }
    }
  );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
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
