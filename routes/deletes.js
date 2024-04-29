const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.delete("/:groupId/:word", (req, res) => {
  const groupId = req.params.groupId;
  const word = req.params.word;

  if (!word || !groupId) {
    return res.status(400).json({ error: "word and groupId are required" });
  }
  if (word == groupId) {
    return res.status(400).json({ error: "word and groupId must be unique" });
  }
  router.delete("/", (req, res) => {
    return res.status(400).json({ error: "groupId is required" });
  });

  // Read the data.json file
  const dataPath = path.join(__dirname, "../data.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    const wordExists = jsonData.words.find(
      (element) =>
        element.value.toLocaleLowerCase() === word.toLocaleLowerCase() &&
        element.groupId === groupId
    );
    if (!wordExists && !groupId) {
      return res.status(404).json({ error: "The provided word doesn't exist" });
    }
    //check to see if there is only one synonym for one word
    const removeGroup = jsonData.words.filter(
      (element) => element.groupId === groupId
    );
    if (removeGroup.length < 3) {
      jsonData.words = jsonData.words.filter(
        (element) => element.groupId !== groupId
      );
    } else {
      console.log("word", word);

      jsonData.words = jsonData.words.filter(
        (element) =>
          element.value.toLocaleLowerCase() !== word.toLocaleLowerCase()
      );
    }

    // Write the updated JSON data back to the file
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (removeGroup.length < 3) {
        res.status(200).json({
          message: "The Group was removed successfully",
        });
      } else {
        res.status(200).json({
          message: "Word was removed successfully",
        });
      }
    });
  });
});

module.exports = router;
