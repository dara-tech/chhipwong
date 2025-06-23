// Mock implementation of usePaymentGateways
const mockGateways = [
  { id: 'paypal', name: 'PayPal', isActive: true, config: { clientId: 'test' } },
  { id: 'stripe', name: 'Stripe', isActive: true, config: { publishableKey: 'test' } },
];

const usePaymentGateways = jest.fn().mockImplementation(() => ({
  gateways: [...mockGateways],
  loading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue({ data: [...mockGateways] })
}));

export default usePaymentGateways;
