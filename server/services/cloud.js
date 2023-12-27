const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {CLOUD_NAME, API_KEY, API_SECRET} = process.env;
// Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// Storage for user avatar images
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PhoneWeb_B2B_B2C/avatars',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

// Storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PhoneWeb_B2B_B2C/phone_images',
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});

// Multer upload for avatar
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter
});

// Multer upload for product images
const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFileFilter
});

// File filter function
function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Not an image!'), false);
  }
  cb(null, true);
}

module.exports = {
  uploadAvatar,
  uploadProductImage,
};
