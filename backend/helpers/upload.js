const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3Password = process.env.AWS_KEY;
const s3Id = process.env.AWS_ID;
const bucket = process.env.BUCKET;

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

aws.config.update({
  secretAccessKey: s3Password,
  accessKeyId: s3Id
});

const s3 = new aws.S3();

module.exports = multer({
  storage: multerS3({
    s3: s3,
    size: 2 * 1024 *1024,
    bucket: bucket,
    acl: "public-read",
    metadata: function(req, file, cb) {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Mauvais format de fichier");
      if (isValid) {
        error = null;
      }
      cb(error, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const name = file.originalname
        .toLocaleLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  }),
  limits: {fileSize : 2 * 1024 *1024}
});
