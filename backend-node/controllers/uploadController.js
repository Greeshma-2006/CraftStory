const cloudinary = require('../config/cloudinary');

// =========================
// DIRECT IMAGE UPLOAD
// =========================

exports.uploadImage = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          'No image uploaded',
      });
    }

    const base64 =
      `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        'base64'
      )}`;

    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder:
            'craftstory',
        }
      );

    res.status(200).json({

      success: true,

      url:
        result.secure_url,

      publicId:
        result.public_id,
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};

// =========================
// GENERATE SIGNATURE
// =========================

exports.getSignature =
  async (req, res) => {

    try {

      const {
        folder =
          'craftstory',

        resourceType =
          'image',
      } = req.query;

      if (
        !folder.startsWith(
          'craftstory'
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Invalid folder path',
        });
      }

      const timestamp =
        Math.round(
          new Date().getTime() /
          1000
        );

      const paramsToSign = {

        timestamp,

        folder,

        resource_type:
          resourceType,
      };

      const signature =
        cloudinary.utils.api_sign_request(

          paramsToSign,

          process.env
            .CLOUDINARY_API_SECRET
        );

      res.status(200).json({

        success: true,

        data: {

          signature,

          timestamp,

          cloudName:
            process.env
              .CLOUDINARY_CLOUD_NAME,

          apiKey:
            process.env
              .CLOUDINARY_API_KEY,

          folder,

          resourceType,
        },
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// =========================
// DELETE IMAGE
// =========================

exports.deleteImage =
  async (req, res) => {

    try {

      const {
        publicId,
      } = req.body;

      if (!publicId) {

        return res.status(400).json({

          success: false,

          message:
            'Public ID is required',
        });
      }

      await cloudinary.uploader.destroy(

        publicId,

        {
          invalidate: true,
        }
      );

      res.status(200).json({

        success: true,

        message:
          'Image deleted successfully',
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };