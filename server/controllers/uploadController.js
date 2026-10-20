// @desc    Upload a single product image to Cloudinary
// @route   POST /api/upload/image
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (error) {
    next(error);
  }
};