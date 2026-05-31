const Product = require('../models/Product');

// CREATE PRODUCT

exports.createProduct = async (
  req,
  res
) => {

  try {

    const {
      image,
      name,
      description,
      price,
      category,
      stock,
      materials,
      dimensions,
      weight,
      customizable,
    } = req.body;

    const product =
      await Product.create({

        image,

        name,

        description,

        price,

        category,

        stock,

        materials:
          materials || [],

        dimensions,

        weight,

        customizable:
          customizable || false,

        artisan:
          req.user._id,
      });

    res.status(201).json({

      success: true,

      message:
        'Product created successfully',

      data: product,
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};

// GET ALL PRODUCTS

exports.getAllProducts =
  async (req, res) => {

    try {

      const {
        category,
        search,
        minPrice,
        maxPrice,
        artisan,
        page = 1,
        limit = 12,
      } = req.query;

      const query = {
        isActive: true,
      };

      if (category) {

        query.category =
          category;
      }

      if (search) {

        query.$text = {
          $search: search,
        };
      }

      if (
        minPrice ||
        maxPrice
      ) {

        query.price = {};

        if (minPrice)
          query.price.$gte =
            Number(minPrice);

        if (maxPrice)
          query.price.$lte =
            Number(maxPrice);
      }

      if (artisan) {

        query.artisan =
          artisan;
      }

      const skip =
        (page - 1) *
        Number(limit);

      const products =
        await Product.find(query)

          .populate(
            'artisan',
            'name email'
          )

          .skip(skip)

          .limit(
            Number(limit)
          )

          .sort({
            createdAt: -1,
          });

      const total =
        await Product.countDocuments(
          query
        );

      res.status(200).json({

        success: true,

        count:
          products.length,

        total,

        page:
          Number(page),

        pages:
          Math.ceil(
            total / limit
          ),

        data: products,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// GET SINGLE PRODUCT

exports.getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        ).populate(
          'artisan',
          'name email profileImage'
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            'Product not found',
        });
      }

      res.status(200).json({

        success: true,

        data: product,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// UPDATE PRODUCT

exports.updateProduct =
  async (req, res) => {

    try {

      let product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            'Product not found',
        });
      }

      if (

        product.artisan.toString() !==
        req.user._id.toString() &&

        req.user.role !==
          'admin'

      ) {

        return res.status(403).json({

          success: false,

          message:
            'Not authorized to update this product',
        });
      }

      product =
        await Product.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
            runValidators: true,
          }
        );

      res.status(200).json({

        success: true,

        message:
          'Product updated successfully',

        data: product,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// DELETE PRODUCT

exports.deleteProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            'Product not found',
        });
      }

      if (

        product.artisan.toString() !==
        req.user._id.toString() &&

        req.user.role !==
          'admin'

      ) {

        return res.status(403).json({

          success: false,

          message:
            'Not authorized to delete this product',
        });
      }

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({

        success: true,

        message:
          'Product deleted successfully',
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// MY PRODUCTS

exports.getArtisanProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          artisan:
            req.user._id,
        })

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          products.length,

        data: products,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };
// GET PRODUCTS BY ARTISAN ID (public)

exports.getProductsByArtisan =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          artisan:
            req.params.artisanId,
        })

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          products.length,

        data: products,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };
