const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

const storage = multer.memoryStorage ();
const upload = multer({ storage: storage });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

app.post('/upload', upload.single('cv'), (req, res) => {
    const file = req.file;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        res.json({ url: data.Location });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});