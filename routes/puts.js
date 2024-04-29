const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.put("/:groupId", (req, res) => {
  const groupId = req.params.groupId;
  const synonym = req.body.synonym;

  if (!groupId || !synonym) {
    return res.status(400).json({ error: "groupId and synonym are required" });
  }

  // Read the data.json file
  const dataPath = path.join(__dirname, "../data.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    // parse the JSON data
    let jsonData = JSON.parse(data);

    // check if the provided groupId exists
    const groupIdExists = jsonData.words.find(
      (element) => element.groupId == groupId
    );
    if (!groupIdExists) {
      return res
        .status(404)
        .json({ error: "The provided groupId doesn't exist" });
    }

    // check if the provided synonym already exists
    const wordExists = jsonData.words.find(
      (element) => element.value.toLowerCase() === synonym.toLowerCase()
    );
    if (wordExists) {
      return res
        .status(409)
        .json({ error: "The provided synonym already exists" });
    }

    // Add the new synonym to the words array
    jsonData.words.push({ value: synonym, groupId: groupId });

    // Write the updated JSON data back to the file
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      // Respond with success message
      res.status(201).json({
        message: "Synonym was added successfully",
        synonym,
        groupId,
      });
    });
  });
});

module.exports = router;
