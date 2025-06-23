import Company from '../models/Company.js';
import cloudinary from '../lib/cloudinary.js';

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      about,
      mission,
      vision,
      privacyPolicy,
      contact,
      socialMedia,
      programsOffered
    } = req.body;

    const company = new Company({
      name,
      about,
      mission,
      vision,
      privacyPolicy,
      contact,
      socialMedia,
      programsOffered
    });

    // Handle logo upload if present
    if (req.files?.logo) {
      const logoResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'company_logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.files.logo[0].buffer);
      });
      company.logo = logoResult.secure_url;
    }

    // Handle hero images upload if present
    if (req.files?.heroImages) {
      const heroImagePromises = req.files.heroImages.map(image => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'company_hero_images' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(image.buffer);
        });
      });
      company.heroImages = await Promise.all(heroImagePromises);
    }

    // Handle testimonial images if present
    if (req.body.testimonials) {
      const testimonials = JSON.parse(req.body.testimonials);
      if (req.files?.testimonialImages) {
        const testimonialImagePromises = req.files.testimonialImages.map(image => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'company_testimonial_images' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            uploadStream.end(image.buffer);
          });
        });
        const testimonialImageUrls = await Promise.all(testimonialImagePromises);
        
        company.testimonials = testimonials.map((testimonial, index) => ({
          ...testimonial,
          imageUrl: testimonialImageUrls[index]
        }));
      } else {
        company.testimonials = testimonials;
      }
    }

    await company.save();
    res.status(201).json({ message: 'Company created successfully', company });
  } catch (err) {
    console.error('Create company error:', err);
    res.status(500).json({ message: 'Server error while creating company' });
  }
};

// Get company details
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error('Get company error:', err);
    res.status(500).json({ message: 'Server error while fetching company' });
  }
};

// Update company details
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Handle text fields
    const textFields = ['name', 'about', 'mission', 'vision', 'privacyPolicy', 'termsConditions', 'paymentGateway'];
    textFields.forEach(field => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    // Handle fields that are sent as JSON strings
    const jsonFields = ['contact', 'socialMedia', 'programsOffered', 'FAQs', 'testimonials'];
    jsonFields.forEach(field => {
      if (req.body[field]) {
        try {
          let parsedData;
          if (typeof req.body[field] === 'string') {
            parsedData = JSON.parse(req.body[field]);
          } else {
            parsedData = req.body[field]; // Already an object
          }
          company[field] = parsedData;
          // For arrays of objects, it's safer to mark them as modified.
          if (Array.isArray(parsedData)) {
            company.markModified(field);
          }
        } catch (e) {
          console.error(`Error parsing JSON for field ${field}:`, e);
        }
      }
    });

    // --- Handle all image uploads ---
    const uploadToCloudinary = (buffer, folder) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        uploadStream.end(buffer);
      });
    };

    // Handle single image fields
    const singleImageFields = ['logo', 'aboutImage', 'missionImage', 'visionImage', 'heroImage', 'paymentQR'];
    for (const field of singleImageFields) {
      if (req.files?.[field]?.[0]) {
        try {
          company[field] = await uploadToCloudinary(req.files[field][0].buffer, `company_${field.toLowerCase()}`);
        } catch (e) {
          console.error(`Error uploading ${field}:`, e);
        }
      }
    }

    // Handle multiple hero images
    if (req.files?.heroImages) {
      if (!Array.isArray(company.heroImages)) company.heroImages = [];
      const heroImageUploads = req.files.heroImages.map(file => uploadToCloudinary(file.buffer, 'company_hero_images'));
      const newHeroUrls = await Promise.all(heroImageUploads);
      company.heroImages.push(...newHeroUrls);
    }

    // --- Handle Professionals Update with Logging ---
    if (req.body.professionals) {
      try {
        let professionals;
        if (typeof req.body.professionals === 'string') {
          try {
            professionals = JSON.parse(req.body.professionals);
          } catch (e) {
            console.error('Error parsing professionals JSON:', e);
            return res.status(400).json({ message: 'Invalid professionals JSON format.' });
          }
        } else {
          professionals = req.body.professionals; // Already an object
        }

        if (req.files?.professionalImages) {
          const professionalImageUrls = await Promise.all(
            req.files.professionalImages.map(image => uploadToCloudinary(image.buffer, 'company_professionals'))
          );

          // Get image indices from request
          let imageIndices = [];
          if (req.body.professionalImageIndices) {
            try {
              // Split the comma-separated string into an array of numbers
              imageIndices = req.body.professionalImageIndices.split(',').map(Number);
              
              // Validate that all indices are valid numbers
              if (imageIndices.some(isNaN)) {
                console.error('Invalid indices found:', imageIndices);
                return res.status(400).json({ 
                  message: 'Invalid professional image indices: contains non-numeric values',
                  received: imageIndices
                });
              }
            } catch (e) {
              console.error('Error parsing image indices:', e);
              return res.status(400).json({ 
                message: 'Invalid professional image indices format',
                error: e.message
              });
            }
          }

          // If we have images but no indices, assign them sequentially
          if (professionalImageUrls.length > 0 && imageIndices.length === 0) {
            imageIndices = Array.from({ length: professionalImageUrls.length }, (_, i) => i);
          }

          // Validate number of images matches indices
          if (professionalImageUrls.length !== imageIndices.length) {
            console.error('Image count mismatch:', {
              images: professionalImageUrls.length,
              indices: imageIndices.length
            });
            return res.status(400).json({ 
              message: 'Number of images does not match number of image indices',
              received: professionalImageUrls.length,
              expected: imageIndices.length
            });
          }

          // Update professionals with new images using indices
          imageIndices.forEach((profIndex, imageIndex) => {
            if (professionals[profIndex]) {
              professionals[profIndex].image = professionalImageUrls[imageIndex];
            }
          });
        }
        
        company.professionals = professionals;
        company.markModified('professionals');
      } catch (error) {
        console.error('Error processing professionals update:', error);

      }
    }

    const updatedCompany = await company.save();
    res.status(200).json({ 
      message: 'Company updated successfully', 
      company: updatedCompany 
    });

  } catch (err) {
    console.error('Update company error:', err);
    res.status(500).json({ message: 'Server error while updating company' });
  }
};

// Delete company
// @desc    Get public company data by ID
// @route   GET /api/companies/public/:id
// @access  Public
export const getPublicCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select('name logo FAQs');

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    console.error(`Error fetching public company data: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Delete company error:', err);
    res.status(500).json({ message: 'Server error while deleting company' });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    console.error('Get all companies error:', err);
    res.status(500).json({ message: 'Server error while fetching companies' });
  }
};
