import multer from "multer";

const multerUpload = multer({
  limits: 5 * 1024 * 1024, // 5 MB file size limit
});

const singleAvatarUpload = multerUpload.single("avatar");

export { multerUpload, singleAvatarUpload };
