import jwtDecode from 'jwt-decode';

import constants from './constants';

/**
 * Searches for, decodes, and checks the expiration date of the client's token
 * if such expiration date exists. Expiration date is expected to be in millisecond
 * format.
 *
 * @returns {boolean}
 */
export default () => {
  const token = localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME);
  // no token found
  if (token === null) {
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    if (Object.keys(decoded).includes(constants.TOKEN_EXPIRATION_KEY)) {
      // if token date is less than or equal to current date, the token is expired
      return decoded[constants.TOKEN_EXPIRATION_KEY] > (new Date()).getTime();
    } else {

    }
    return true;
  } catch (e) {
    // failed to decode the token
    return false;
  }
};
