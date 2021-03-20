const mongoose = require("mongoose");

const categoryLinkSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    links: [
      {
        link: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CategoryLink = mongoose.model("CategoryLink", categoryLinkSchema);

module.exports = CategoryLink;
