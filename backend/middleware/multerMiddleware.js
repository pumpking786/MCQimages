// middleware/multerMiddleware.js
const multer = require("multer");

const myStorage = multer.diskStorage({
  destination: (req, file, next) => {
    let path = "upload/";
    next(null, path);
  },
  filename: (req, file, next) => {
    let filename = Date.now() + "-" + file.originalname;
    next(null, filename);
  },
});

const imagefilter = (req, file, next) => {
  let allowed = ["jpg", "jpeg", "png", "bmp", "webp", "svg", "gif"];
  let fileparts = file.originalname.split(".");
  let ext = fileparts.pop();

  if (allowed.includes(ext.toLowerCase())) {
    next(null, true);
  } else {
    next({ status: 400, msg: "Image file format not supported" });
  }
};

const uploader = multer({
  storage: myStorage,
  fileFilter: imagefilter, // Fix typo: filefilter → fileFilter
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = { uploader };
