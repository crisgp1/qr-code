import type { AppConfig } from './config';

export interface Template {
  id: string;
  labelKey: string;
  descriptionKey: string;
  config: Partial<AppConfig>;
}

export const templates: Template[] = [
  {
    id: 'business-cards',
    labelKey: 'templates.businessCards',
    descriptionKey: 'templates.businessCardsDesc',
    config: {
      cols: 2,
      rows: 5,
      codeSize: 3,
      margin: 1.5,
      spacing: 0.2,
      cutLines: true,
      totalCodes: 10,
      pageSize: 'letter',
    },
  },
  {
    id: 'product-labels',
    labelKey: 'templates.productLabels',
    descriptionKey: 'templates.productLabelsDesc',
    config: {
      cols: 4,
      rows: 5,
      codeSize: 2.5,
      margin: 1,
      spacing: 0.3,
      cutLines: true,
      totalCodes: 20,
      pageSize: 'letter',
    },
  },
  {
    id: 'stickers',
    labelKey: 'templates.stickers',
    descriptionKey: 'templates.stickersDesc',
    config: {
      cols: 5,
      rows: 6,
      codeSize: 2,
      margin: 0.8,
      spacing: 0.2,
      cutLines: true,
      totalCodes: 30,
      pageSize: 'letter',
    },
  },
  {
    id: 'single-large',
    labelKey: 'templates.singleLarge',
    descriptionKey: 'templates.singleLargeDesc',
    config: {
      cols: 1,
      rows: 1,
      codeSize: 8,
      margin: 3,
      spacing: 0,
      cutLines: false,
      totalCodes: 1,
      pageSize: 'letter',
    },
  },
  {
    id: 'custom',
    labelKey: 'templates.custom',
    descriptionKey: 'templates.customDesc',
    config: {},
  },
];
