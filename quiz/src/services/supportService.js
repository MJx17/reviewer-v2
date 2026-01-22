import { apiRequest } from '../utils/api';

const PREFIX = '/support'; // prefix all support routes

export const sendSupportMessage = async ({ name, email, message }) => {
  return apiRequest(`${PREFIX}/email`, {
    method: 'POST',
    body: { name, email, message },
  });
};
