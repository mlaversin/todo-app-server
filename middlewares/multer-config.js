const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname;
    const name = originalName
      .split(" ")
      .join("_")
      .slice(0, originalName.lastIndexOf("."));
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Unsupported file type.");
  }
}

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 500000,
  },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");
