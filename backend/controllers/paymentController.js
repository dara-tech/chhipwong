import Company from '../models/Company.js';

export const getPaymentInfo = async (req, res) => {
  try {
    
    // Get the first company (or modify as needed)
    const company = await Company.findOne({}).select('paymentGateway paymentQR');
    
    if (!company) {
      return res.status(404).json({ 
        success: false,
        message: 'Company not found' 
      });
    }

    res.json({
      success: true,
      paymentGateway: company.paymentGateway,
      paymentQR: company.paymentQR
    });
  } catch (error) {
    console.error('Error in getPaymentInfo:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
