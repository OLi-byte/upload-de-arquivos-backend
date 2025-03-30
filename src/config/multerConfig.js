import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("./uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Tipo de arquivo não permitido"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
