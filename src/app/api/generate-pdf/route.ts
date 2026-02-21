import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 60;

let browser: Browser | null = null;
const isLocal = process.env.NODE_ENV === 'development';

const chromeArgs = [
  '--font-render-hinting=none',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-animations',
  '--disable-background-timer-throttling',
  '--disable-restore-session-state',
  '--single-process',
];

async function getBrowser(): Promise<Browser> {
  if (browser?.connected) return browser;

  if (isLocal) {
    browser = await puppeteer.launch({
      executablePath:
        process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : process.platform === 'win32'
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : '/usr/bin/google-chrome',
      headless: true,
    });
  } else {
    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;
    browser = await puppeteer.launch({
      args: chromeArgs,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  return browser;
}

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();
    if (!html) {
      return NextResponse.json({ error: 'No HTML provided' }, { status: 400 });
    }

    const b = await getBrowser();
    const page = await b.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.emulateMediaType('print');

    const pdf = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await page.close();

    if (isLocal && browser) {
      await browser.close();
      browser = null;
    }

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="QR_Plantilla.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
