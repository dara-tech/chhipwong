import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String, 
    default: "",
    // URL to the logo image (e.g., Cloudinary or static folder)
  },
  about: {
    type: String,
  },
  privacyPolicy: {
    type: String,
  },
  termsConditions: {
    type: String,
  },
  FAQs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  professionals: [
    { 
      _id: String,
      name: String,
      role: String,
      email: String,
      phone: String,
      image: String,
      description: String,
    },
  ],
  aboutImage: {
    type: String,
    default: "",
    // URL to the about section image
  },
  mission: {
    type: String,
  },
  missionImage: {
    type: String,
    default: "",
    // URL to the mission section image
  },
  vision: {
    type: String,
  },
  visionImage: {
    type: String,
    default: "",
    // URL to the vision section image
  },
  heroImage: {
    type: String,
    default: "",
    // URL to the hero section image
  },
  
  contact: {
    address: String,
    phone: String,
    email: String,
    mapLocation: String, // Google Maps embed link or coordinates
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    linkedin: String,
  },
  paymentGateway :{
    type:String,
  },
  paymentQR :{
    type: String,
    default: "",
    // URL to the hero section image
  },

  heroImages: [String], // Homepage carousel images
  programsOffered: [String], // E.g. ['Preschool', 'Primary', 'Secondary']
  testimonials: [
    {
      name: String,
      role: String, // e.g., Parent, Student
      message: String,
      imageUrl: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Company', companySchema);
