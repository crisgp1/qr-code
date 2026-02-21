import type { AppConfig } from '@/types/config';
import { defaultConfig } from '@/types/config';
import { STORAGE_KEY } from './constants';

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage full or unavailable
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateConfig(raw: any): AppConfig {
  // Migrate roundedCode → roundness
  if ('roundedCode' in raw && !('roundness' in raw)) {
    raw.roundness = raw.roundedCode ? 80 : 0;
    delete raw.roundedCode;
  }
  // Add defaults for new fields
  if (!('errorCorrection' in raw)) raw.errorCorrection = defaultConfig.errorCorrection;
  if (!('transparentBg' in raw)) raw.transparentBg = defaultConfig.transparentBg;
  if (!('outputFilename' in raw)) raw.outputFilename = defaultConfig.outputFilename;
  if (!('labelPosition' in raw)) raw.labelPosition = defaultConfig.labelPosition;
  return raw as AppConfig;
}

export function loadConfig(): AppConfig | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const raw = JSON.parse(data);
    return migrateConfig(raw);
  } catch {
    return null;
  }
}

export function clearConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
