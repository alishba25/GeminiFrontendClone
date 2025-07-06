import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from '../components/CountryCard';

describe('CountryCard', () => {
  const country = {
    cca3: 'IND',
    name: { common: 'India' },
    flags: { svg: 'https://flagcdn.com/in.svg' },
    region: 'Asia',
  };

  it('renders country name, flag, and region', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <CountryCard country={country} />
      </BrowserRouter>
    );
    expect(getByText('India')).toBeInTheDocument();
    expect(getByAltText('India flag')).toBeInTheDocument();
    expect(getByText('Asia')).toBeInTheDocument();
  });
}); 