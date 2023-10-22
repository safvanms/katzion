import * as Yup from 'yup';

const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#][^\s]*\/?$/;

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, 'Name must be at least 6 characters')
    .required('Name is required'),
  country: Yup.string()
    .required('Country is required')
    .matches(/^[A-Z\s]*$/, 'Country should be in uppercase')
    .trim(), 
  web_pages: Yup.string()
    .matches(urlPattern, 'Invalid URL, check the URL')
    .required('At least one URL is required')
    .min(1, 'At least one URL is required'),
});
