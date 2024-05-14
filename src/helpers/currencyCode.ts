export type ICurrencyCode =
  | 'AED'
  | 'AFN'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'ARS'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'BGN'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BOV'
  | 'BRL'
  | 'BSD'
  | 'BTN'
  | 'BWP'
  | 'BYR'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHE'
  | 'CHF'
  | 'CHW'
  | 'CLF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'COU'
  | 'CRC'
  | 'CUC'
  | 'CUP'
  | 'CVE'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'ERN'
  | 'ETB'
  | 'EUR'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LTL'
  | 'LVL'
  | 'LYD'
  | 'MAD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRO'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MXV'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIO'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'SSP'
  | 'STD'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'USD'
  | 'USN'
  | 'USS'
  | 'UYI'
  | 'UYU'
  | 'UZS'
  | 'VEF'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XAG'
  | 'XAU'
  | 'XBA'
  | 'XBB'
  | 'XBC'
  | 'XBD'
  | 'XCD'
  | 'XDR'
  | 'XFU'
  | 'XOF'
  | 'XPD'
  | 'XPF'
  | 'XPT'
  | 'XTS'
  | 'XXX'
  | 'YER'
  | 'ZAR'
  | 'ZMW';

export enum CurrencySymbol {
  AED = 'د.إ',
  AFN = '؋',
  ALL = 'L',
  AMD = '֏',
  ANG = 'ƒ',
  AOA = 'Kz',
  ARS = '$',
  AUD = '$',
  AWG = 'ƒ',
  AZN = '₼',
  BAM = 'KM',
  BBD = '$',
  BDT = '৳',
  BGN = 'лв',
  BHD = 'د.ب',
  BIF = 'FBu',
  BMD = '$',
  BND = '$',
  BOB = 'Bs.',
  BOV = 'BOV',
  BRL = 'R$',
  BSD = '$',
  BTN = 'Nu.',
  BWP = 'P',
  BYR = 'Br',
  BZD = 'BZ$',
  CAD = '$',
  CDF = 'FC',
  CHE = 'CHE',
  CHF = 'CHF',
  CHW = 'CHW',
  CLF = 'CLF',
  CLP = '$',
  CNY = '¥',
  COP = '$',
  COU = 'COU',
  CRC = '₡',
  CUC = '$',
  CUP = '$',
  CVE = '$',
  CZK = 'Kč',
  DJF = 'Fdj',
  DKK = 'kr',
  DOP = 'RD$',
  DZD = 'دج',
  EGP = '£',
  ERN = 'Nfk',
  ETB = 'Br',
  EUR = '€',
  FJD = '$',
  FKP = '£',
  GBP = '£',
  GEL = '₾',
  GHS = '₵',
  GIP = '£',
  GMD = 'D',
  GNF = 'FG',
  GTQ = 'Q',
  GYD = '$',
  HKD = '$',
  HNL = 'L',
  HRK = 'kn',
  HTG = 'G',
  HUF = 'Ft',
  IDR = 'Rp',
  ILS = '₪',
  INR = '₹',
  IQD = 'ع.د',
  IRR = '﷼',
  ISK = 'kr',
  JMD = '$',
  JOD = 'د.ا',
  JPY = '¥',
  KES = 'Ksh',
  KGS = 'сом',
  KHR = '៛',
  KMF = 'CF',
  KPW = '₩',
  KRW = '₩',
  KWD = 'د.ك',
  KYD = '$',
  KZT = '₸',
  LAK = '₭',
  LBP = '£',
  LKR = 'රු',
  LRD = '$',
  LSL = 'M',
  LTL = 'Lt',
  LVL = 'Ls',
  LYD = 'ل.د',
  MAD = 'MAD',
  MDL = 'L',
  MGA = 'Ar',
  MKD = 'ден',
  MMK = 'K',
  MNT = '₮',
  MOP = 'MOP$',
  MRO = 'UM',
  MUR = '₨',
  MVR = 'ރ.',
  MWK = 'MK',
  MXN = '$',
  MXV = 'MXV',
  MYR = 'RM',
  MZN = 'MT',
  NAD = '$',
  NGN = '₦',
  NIO = 'C$',
  NOK = 'kr',
  NPR = '₨',
  NZD = '$',
  OMR = 'ر.ع.',
  PAB = 'B/.',
  PEN = 'S/',
  PGK = 'K',
  PHP = '₱',
  PKR = '₨',
  PLN = 'zł',
  PYG = '₲',
  QAR = 'ر.ق',
  RON = 'lei',
  RSD = 'дин.',
  RUB = '₽',
  RWF = 'FRw',
  SAR = 'ر.س',
  SBD = '$',
  SCR = '₨',
  SDG = 'ج.س.',
  SEK = 'kr',
  SGD = '$',
  SHP = '£',
  SLL = 'Le',
  SOS = 'S',
  SRD = '$',
  SSP = '£',
  STD = 'Db',
  SYP = '£',
  SZL = 'E',
  THB = '฿',
  TJS = 'ЅМ',
  TMT = 'T',
  TND = 'د.ت',
  TOP = 'T$',
  TRY = '₺',
  TTD = 'TT$',
  TWD = 'NT$',
  TZS = 'TSh',
  UAH = '₴',
  UGX = 'USh',
  USD = '$',
  USN = 'USN',
  USS = 'USS',
  UYI = 'UYI',
  UYU = '$U',
  UZS = 'soʻm',
  VEF = 'Bs.',
  VND = '₫',
  VUV = 'VT',
  WST = 'WS$',
  XAF = 'FCFA',
  XAG = 'XAG',
  XAU = 'XAU',
  XBA = 'XBA',
  XBB = 'XBB',
  XBC = 'XBC',
  XBD = 'XBD',
  XCD = '$',
  XDR = 'XDR',
  XFU = 'XFU',
  XOF = 'CFA',
  XPD = 'XPD',
  XPF = '₣',
  XPT = 'XPT',
  XTS = 'XTS',
  XXX = 'XXX',
  YER = '﷼',
  ZAR = 'R',
  ZMW = 'ZK',
}

export const getCurrencySimbol = (code: ICurrencyCode): string => CurrencySymbol[code];
