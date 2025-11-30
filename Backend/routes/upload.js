const router = require('express').Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const rekognition = new AWS.Rekognition();

// Upload image/video
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const params = {
      CollectionId: 'mycollection', // créer une collection sur AWS Rekognition
      Image: { Bytes: req.file.buffer }
    };

    rekognition.searchFacesByImage(params, async (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.FaceMatches.length > 0) {
        const faceId = data.FaceMatches[0].Face.FaceId;
        const user = await User.findOne({ 'faceData.faceId': faceId });
        return res.json({ message: 'User found', user });
      } else {
        return res.json({ message: 'No match found' });
      }
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
