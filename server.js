require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { Role } = require("./models/role.model");

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use("/products", require("./routes/productRoutes.js"));
require("./routes/authRoutes")(app);

// app.use("/api/auth", require("./routes/authRoutes.js"));


app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  initial();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        new Role({
          name: "user",
        })
          .save()
          .then((_) => {
            console.log("added 'user' to roles collection");
          })
          .catch((error) => {
            console.log("error", error);
          });

        new Role({
          name: "moderator",
        })
          .save()
          .then((_) => {
            console.log("added 'moderator' to roles collection");
          })
          .catch((error) => {
            console.log("error", error);
          });

        new Role({
          name: "admin",
        })
          .save()
          .then((_) => {
            console.log("added 'admin' to roles collection");
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    })
    .catch((error) => {
      console.log("Error when counting roles");
    });

  // Role.estimatedDocumentCount((err, count) => {
  //   if (!err && count === 0) {
  //     new Role({
  //       name: "user"
  //     }).save(err => {
  //       if (err) {
  //         console.log("error", err);
  //       }

  //       console.log("added 'user' to roles collection");
  //     });

  //     new Role({
  //       name: "moderator"
  //     }).save(err => {
  //       if (err) {
  //         console.log("error", err);
  //       }

  //       console.log("added 'moderator' to roles collection");
  //     });

  //     new Role({
  //       name: "admin"
  //     }).save(err => {
  //       if (err) {
  //         console.log("error", err);
  //       }

  //       console.log("added 'admin' to roles collection");
  //     });
  //   }
  // });
}
