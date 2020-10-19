"use strict";

import Fs from "fs";
import Path from "path";
import Axios from "axios";
import sharp from "sharp";
import asyncHandler from "../utils/asyncHandler";

export default asyncHandler(async (req, res, next) => {
  const { url } = req.query;

  if (!url) {
    req.status = 400;
    return next(new Error("Provide a public image url in the query parameter"));
  }

  const pathDir = Path.resolve("./src", "images");

  if (!Fs.existsSync(pathDir)) {
    Fs.mkdirSync(pathDir);
  }

  const path = Path.resolve(pathDir, "download.jpg");
  const thumbnailPath = Path.resolve("./src", "images", "thumbnail.jpg");
  const write = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(write);

  write.on("close", async () => {
    const result = await sharp(path)
      .resize({
        width: 50,
        height: 50
      })
      .toFile(thumbnailPath);

    if (result) {
      return res.status(201).sendFile(thumbnailPath);
    }
  });
});
