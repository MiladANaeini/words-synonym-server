const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
// ROUTES
// ============== search API ===============
router.get("/:word", (req, res) => {
  const word = req.params.word;
  //check if the word was sent
  if (!word) {
    return res.status(400).json({ error: "Word parameter is required" }); //Bad req
  }
  // Read the data.json file
  const dataPath = path.join(__dirname, "../data.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    //check if the word exists in our data
    const theWord = jsonData.words.find(
      (element) =>
        element.value.toLocaleLowerCase() === word.toLocaleLowerCase()
    );

    if (!theWord) {
      return res.json([]);
    }
    const synonyms = jsonData.words.filter(
      (element) =>
        element.groupId === theWord.groupId &&
        element.value.toLocaleLowerCase() !== word.toLocaleLowerCase()
    );

    res.json(synonyms);
  });
});

router.get("/", (req, res) => {
  return res.status(400).json({ error: "Word parameter is required" });
});

module.exports = router;
