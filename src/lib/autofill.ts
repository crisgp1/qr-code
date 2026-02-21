import type { ContentType, ContentConfig } from '@/types/config';

export function getAutoFillData(type: ContentType): Partial<ContentConfig> {
  switch (type) {
    case 'url':
      return { value: 'https://www.example.com/my-page' };
    case 'text':
      return { value: 'Hello! This is a sample QR code text.' };
    case 'email':
      return {
        email: {
          to: 'contact@example.com',
          subject: 'Hello from QR',
          body: 'I scanned your QR code!',
        },
      };
    case 'phone':
      return { phone: '+1 (555) 123-4567' };
    case 'sms':
      return {
        sms: {
          number: '+1 (555) 987-6543',
          body: 'Hi! I scanned your QR code.',
        },
      };
    case 'wifi':
      return {
        wifi: {
          ssid: 'MyNetwork',
          password: 'SecurePass123',
          encryption: 'WPA',
          hidden: false,
        },
      };
    case 'vcard':
      return {
        vcard: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1 (555) 000-1234',
          email: 'john.doe@example.com',
          org: 'Acme Corp',
          url: 'https://johndoe.example.com',
          title: 'Software Engineer',
        },
      };
    default:
      return { value: 'Sample content' };
  }
}
