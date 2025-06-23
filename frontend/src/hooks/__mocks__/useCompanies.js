

export default jest.fn(() => ({
  companies: [],
  loading: true,
  error: null,
  getCompanies: jest.fn(),
}));
