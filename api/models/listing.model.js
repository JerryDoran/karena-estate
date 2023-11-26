import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing must be at least one character long.'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a description'],
    },
    address: {
      type: String,
      required: [true, 'Please enter the address'],
    },
    retailPrice: {
      type: Number,
      required: [true, 'Please enter a retail price'],
    },
    discountPrice: {
      type: Number,
      required: [true, 'Please enter a discounted price'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please enter the number of bathrooms'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please enter the number of bedrooms'],
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
