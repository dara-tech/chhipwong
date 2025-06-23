import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Mission from '../../../components/clientPage/Mission';
import useCompanies from '../../../hooks/useCompanies';

// Mock the custom hook
jest.mock('../../../hooks/useCompanies');

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'error.occurred') return 'An Error Occurred';
      return key;
    },
  }),
}));

const mockCompany = {
  _id: '1',
  name: 'Test Co',
  logo: 'logo.png',
  mission: 'Our test mission.',
  missionImage: 'mission.png',
  about: 'About our test company.',
  aboutImage: 'about.png',
  heroImages: ['hero.png'],
};

describe('Mission Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state skeleton correctly', () => {
    useCompanies.mockReturnValue({
      companies: [],
      loading: true,
      error: null,
      getCompanies: jest.fn(),
    });

    const { container } = render(<Mission />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch data';
    useCompanies.mockReturnValue({
      companies: [],
      loading: false,
      error: errorMessage,
      getCompanies: jest.fn(),
    });

    render(<Mission />);

    expect(screen.getByText('An Error Occurred')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders success state with company data', () => {
    useCompanies.mockReturnValue({
      companies: [mockCompany],
      loading: false,
      error: null,
      getCompanies: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Mission />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /our mission/i })).toBeInTheDocument();
    expect(screen.getByText(mockCompany.mission)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /about us/i })).toBeInTheDocument();
    expect(screen.getByText(mockCompany.about)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about');
  });

  test('calls getCompanies on component mount', () => {
    const getCompaniesMock = jest.fn();
    useCompanies.mockReturnValue({
      companies: [],
      loading: true,
      error: null,
      getCompanies: getCompaniesMock,
    });

    render(<Mission />);

    expect(getCompaniesMock).toHaveBeenCalledTimes(1);
  });
});
