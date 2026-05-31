const Report =
  require('../models/Report');

// CREATE REPORT

exports.createReport =
  async (req, res) => {

    try {

      const {
        subject,
        description,
      } = req.body;

      const report =
        await Report.create({

          customer:
            req.user._id,

          subject,

          description,
        });

      res.status(201).json({

        success: true,

        message:
          'Report submitted successfully',

        data: report,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// CUSTOMER REPORTS

exports.getMyReports =
  async (req, res) => {

    try {

      const reports =
        await Report.find({

          customer:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        count:
          reports.length,

        data:
          reports,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// ADMIN REPORTS

exports.getAllReports =
  async (req, res) => {

    try {

      const reports =
        await Report.find()

          .populate(
            'customer',
            'name email'
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        count:
          reports.length,

        data:
          reports,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

// UPDATE STATUS

exports.updateReportStatus =
  async (req, res) => {

    try {

      const report =
        await Report.findById(
          req.params.id
        );

      if (!report) {

        return res.status(404).json({

          success: false,

          message:
            'Report not found',
        });
      }

      report.status =
        req.body.status;

      await report.save();

      res.status(200).json({

        success: true,

        message:
          'Report updated',

        data: report,
      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };