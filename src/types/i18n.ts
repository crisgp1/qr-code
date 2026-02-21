export interface Translations {
  app: {
    title: string;
    subtitle: string;
    free: string;
    developedBy: string;
  };
  stats: {
    total: string;
    perSheet: string;
    sheets: string;
  };
  codeType: {
    title: string;
    qr: string;
    barcode: string;
  };
  barcodeFormat: {
    title: string;
    code128Hint: string;
    code128Desc: string;
    ean13Hint: string;
    ean13Desc: string;
    upcHint: string;
    upcDesc: string;
    code39Hint: string;
    code39Desc: string;
    invalidInput: string;
    learnMore: string;
    errEmpty: string;
    errDigitsOnly: string;
    errNeedDigits: string;
    errTooLong: string;
    errInvalidChars: string;
  };
  contentType: {
    title: string;
    url: string;
    text: string;
    email: string;
    phone: string;
    sms: string;
    wifi: string;
    vcard: string;
  };
  content: {
    title: string;
    placeholder: string;
    urlPlaceholder: string;
    textPlaceholder: string;
    emailTo: string;
    emailSubject: string;
    emailBody: string;
    phoneNumber: string;
    smsNumber: string;
    smsBody: string;
    wifiSSID: string;
    wifiPassword: string;
    wifiEncryption: string;
    wifiHidden: string;
    wifiEncNone: string;
    autoFill: string;
    vcardFirstName: string;
    vcardLastName: string;
    vcardPhone: string;
    vcardEmail: string;
    vcardOrg: string;
    vcardUrl: string;
    vcardTitle: string;
  };
  layout: {
    title: string;
    totalCodes: string;
    columns: string;
    rowsLabel: string;
  };
  size: {
    title: string;
    codeSize: string;
    marginLabel: string;
    spacing: string;
    pageSize: string;
    customWidth: string;
    customHeight: string;
    pageLetter: string;
    pageA4: string;
    pageA5: string;
    pageCustom: string;
    pixelSize: string;
  };
  text: {
    title: string;
    label: string;
    labelPlaceholder: string;
    labelPosition: string;
    labelBottom: string;
    labelTop: string;
    labelBoth: string;
    labelAll: string;
    pageTitle: string;
    pageTitlePlaceholder: string;
    titleSizeLabel: string;
    labelSizeLabel: string;
    font: string;
  };
  logo: {
    title: string;
    upload: string;
    change: string;
    remove: string;
    sizeLabel: string;
    whiteBg: string;
    warningHigh: string;
    warningMax: string;
    disabledBarcode: string;
  };
  colors: {
    title: string;
    code: string;
    codeBg: string;
    pageBg: string;
    transparentBg: string;
  };
  style: {
    title: string;
    cutLines: string;
    pageNumbers: string;
    roundness: string;
    errorCorrection: string;
    ecL: string;
    ecM: string;
    ecQ: string;
    ecH: string;
  };
  interleave: {
    title: string;
    off: string;
    manual: string;
    csv: string;
    manualPlaceholder: string;
    csvUpload: string;
    csvColumn: string;
    entriesCount: string;
  };
  templates: {
    title: string;
    businessCards: string;
    businessCardsDesc: string;
    productLabels: string;
    productLabelsDesc: string;
    stickers: string;
    stickersDesc: string;
    singleLarge: string;
    singleLargeDesc: string;
    custom: string;
    customDesc: string;
    apply: string;
  };
  export: {
    title: string;
    pdf: string;
    word: string;
    png: string;
    singleQR: string;
    singlePNG: string;
    singleSVG: string;
    filename: string;
  };
  view: {
    grid: string;
    singlePage: string;
    singleCode: string;
    page: string;
    of: string;
    downloadPNG: string;
    downloadSVG: string;
  };
  save: {
    save: string;
    load: string;
    saved: string;
    loaded: string;
    noData: string;
    reset: string;
  };
  theme: {
    light: string;
    dark: string;
  };
}
