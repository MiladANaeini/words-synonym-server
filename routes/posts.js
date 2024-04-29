const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  const { word, synonym } = req.body;
  //check that both synonym and the word are sent
  if (!word || !synonym) {
    return res
      .status(400)
      .json({ error: "Both 'word' and 'synonym' are required" });
  }
  //check if the word and synonym are not the same
  if (word === synonym) {
    return res
      .status(400)
      .json({ error: "Both 'Word' and 'Synonym' can not be the same" });
  }

  const dataPath = path.join(__dirname, "../data.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // the wordsExist variable technically doesnt exist in our UI because we already serach for it
    //but it is only in our UI it might be a seprete create page
    const wordsExist = jsonData.words.find(
      (element) =>
        element.value.toLocaleLowerCase() === word.toLocaleLowerCase()
    );
    const synonymExist = jsonData.words.find(
      (element) =>
        element.value.toLocaleLowerCase() === synonym.toLocaleLowerCase()
    );
    if (wordsExist || synonymExist) {
      return res.status(404).json({
        error:
          "The provided 'word' and/or 'synonym' alredy exists in another group",
      });
    }
    //add the new word and the synonym to the data
    const groupId = uuid();
    jsonData.words.push({ value: word, groupId: groupId });
    jsonData.words.push({ value: synonym, groupId: groupId });
    const newSynonym = [{ value: synonym, groupId: groupId }];
    // Write the updated JSON data back to the file
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      // Respond with the newly created word and synonym
      res.status(201).json({
        message: "Word and Synonym created successfully",
        word,
        groupId,
        newSynonym,
      });
    });
  });
});

module.exports = router;
