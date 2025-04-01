import multer from "multer";

const storage = multer.memoryStorage();

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
