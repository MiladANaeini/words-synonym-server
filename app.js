const express = require("express"); //import the package into the file
const cors = require("cors");
const app = express();

//Import Routes
const getRoutes = require("./routes/gets");
const postRoutes = require("./routes/posts");
const putRoutes = require("./routes/puts");
const deleteRoutes = require("./routes/deletes");
const corsOption = {
  origin: "*",
  optionsSuccessStatus: 200,
};
//Middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use("/words", getRoutes);
app.use("/add", postRoutes);
app.use("/add", putRoutes);
app.use("/words", deleteRoutes);
app.get("/test", (req, res) => {
  res.send("Hello World!");
});
//CORS allows you to load resources from different origins
//ROUTES

//Start listening to the server
app.listen(5000, () => {
  console.log("Server is running on port 3000");
});
