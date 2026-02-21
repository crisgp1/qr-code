export type CodeMode = 'qr' | 'barcode';

export type ContentType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

export type BarcodeFormat = 'CODE128' | 'EAN13' | 'UPC' | 'CODE39';

export type PageSize = 'letter' | 'a4' | 'a5' | 'custom';

export type InterleaveMode = 'off' | 'manual' | 'csv';

export type ViewMode = 'grid' | 'single';

export interface WiFiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
  url: string;
  title: string;
}

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
}

export interface SMSConfig {
  number: string;
  body: string;
}

export interface ContentConfig {
  type: ContentType;
  value: string;
  wifi: WiFiConfig;
  vcard: VCardConfig;
  email: EmailConfig;
  sms: SMSConfig;
  phone: string;
}

export interface AppConfig {
  codeMode: CodeMode;
  barcodeFormat: BarcodeFormat;
  barcodeContent: string;
  content: ContentConfig;
  totalCodes: number;
  cols: number;
  rows: number;
  codeSize: number;
  margin: number;
  spacing: number;
  label: string;
  pageTitle: string;
  titleSize: number;
  labelSize: number;
  fontFamily: string;
  codeColor: string;
  codeBg: string;
  pageBg: string;
  cutLines: boolean;
  showPageNum: boolean;
  roundedCode: boolean;
  logoSize: number;
  logoBgWhite: boolean;
  pageSize: PageSize;
  customPageWidth: number;
  customPageHeight: number;
  templateId: string;
}

export interface InterleaveState {
  mode: InterleaveMode;
  entries: string[];
  csvFileName: string;
  csvColumn: number;
}

export const defaultWifi: WiFiConfig = {
  ssid: '',
  password: '',
  encryption: 'WPA',
  hidden: false,
};

export const defaultVCard: VCardConfig = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  org: '',
  url: '',
  title: '',
};

export const defaultEmail: EmailConfig = {
  to: '',
  subject: '',
  body: '',
};

export const defaultSMS: SMSConfig = {
  number: '',
  body: '',
};

export const defaultContent: ContentConfig = {
  type: 'url',
  value: 'https://example.com',
  wifi: { ...defaultWifi },
  vcard: { ...defaultVCard },
  email: { ...defaultEmail },
  sms: { ...defaultSMS },
  phone: '',
};

export const defaultConfig: AppConfig = {
  codeMode: 'qr',
  barcodeFormat: 'CODE128',
  barcodeContent: '1234567890',
  content: { ...defaultContent },
  totalCodes: 24,
  cols: 3,
  rows: 4,
  codeSize: 4,
  margin: 1.5,
  spacing: 0,
  label: 'Scan here',
  pageTitle: '',
  titleSize: 18,
  labelSize: 9,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  codeColor: '#000000',
  codeBg: '#ffffff',
  pageBg: '#ffffff',
  cutLines: true,
  showPageNum: false,
  roundedCode: false,
  logoSize: 25,
  logoBgWhite: true,
  pageSize: 'letter',
  customPageWidth: 8.5,
  customPageHeight: 11,
  templateId: 'custom',
};

export const defaultInterleave: InterleaveState = {
  mode: 'off',
  entries: [],
  csvFileName: '',
  csvColumn: 0,
};
