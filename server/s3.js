const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("Error @upload: multer fail");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(function () {
            next();
            fs.unlink(path, () => {}); // not keep uploads locally in /uploads
        })
        .catch(function (err) {
            console.log("Error @upload to S3:", err.message);
            res.sendStatus(500);
        });
};

module.exports.delete = (delFile) => {
    console.log("File to delete in S3 after new upload:", delFile);

    s3.deleteObject(
        {
            Bucket: "spicedling",
            Key: delFile,
        },
        (err, data) => {
            if (err) {
                console.log("Error in S3 delete:", err.message);
            } else {
                console.log("Success with S3 delete!", data);
            }
        }
    );
};
