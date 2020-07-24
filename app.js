const vision = require("./src/vision");

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const app = express();
const fs = require("fs");

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/test", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ price: "$1.5" }));
});

app.post("/upload-image", async (req, res) => {
  try {
    if (!req.files) {
      res.setHeader("Content-Type", "application/json");
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "tag_image") to retrieve the uploaded file
      let tag_image = req.files.tag_image;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      tag_image.mv("./uploads/" + tag_image.name);
      console.log("file saved");

      //send response
      //   res.send({
      //     status: true,
      //     message: "File is uploaded",
      //     data: {
      //       name: tag_image.name,
      //       mimetype: tag_image.mimetype,
      //       size: tag_image.size,
      //     },
      //   });
      if (tag_image.mimetype == "image/heic") {
        res.setHeader("Content-Type", "application/json");
        res.send({
          status: false,
          message: "Image format isn't supported",
        });
        return;
      }
      vision.detectText("./uploads/" + tag_image.name).then(function (price) {
        fs.unlinkSync("./uploads/" + tag_image.name);
        console.log("file removed");
        res.setHeader("Content-Type", "application/json");
        res.send(
          JSON.stringify({
            status: true,
            price: price,
          })
        );
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server running"));
