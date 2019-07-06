import { getLoginUrl, getProductsUrl, getProductUrl } from '@root/app/shared/utils/api.utils';

describe('API utils', () => {
  it('should create proper login URL', () => {
    const expectedUrl: string = 'https://siennrecruits.azurewebsites.net/apiJwt';
    expect(getLoginUrl()).toEqual(expectedUrl);
  });

  it('should create proper products URL', () => {
    const expectedUrl: string = 'https://siennrecruits.azurewebsites.net/api/Products';
    expect(getProductsUrl()).toEqual(expectedUrl);
  });

  it('should create proper product URL', () => {
    const productId: string = '5';
    const expectedUrl: string = `https://siennrecruits.azurewebsites.net/api/Products/${productId}`;
    expect(getProductUrl(productId)).toEqual(expectedUrl);
  });
});
