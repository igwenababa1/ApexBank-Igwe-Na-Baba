

import { Country, Recipient, Transaction, TransactionStatus, Card, CardTransaction, TransferLimits, Account, AccountType, CryptoAsset, CryptoHolding, SubscriptionService, SubscriptionServiceType, AppleCardDetails, AppleCardTransaction, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile, PlatformSettings, PlatformTheme, Task, Airport, FlightBooking, UtilityBiller, UtilityBill, UtilityType, AtmLocation } from './types';
import { BtcIcon, EthIcon, ShellIcon, LightningBoltIcon, FireIcon, WaterDropIcon, WifiIcon } from './components/Icons';

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'FR', name: 'France', currency: 'EUR' },
];

export const TRANSFER_PURPOSES: string[] = [
    'Family Support',
    'Payment for Services',
    'Gift',
    'Investment',
    'Personal Expenses',
    'Loan Repayment',
    'Pay by Check',
    'Other',
];

export const BANKS_BY_COUNTRY: { [countryCode: string]: string[] } = {
  US: ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'PNC Bank'],
  GB: ['Barclays', 'HSBC', 'Lloyds Bank', 'NatWest', 'Santander UK'],
  DE: ['Deutsche Bank', 'Commerzbank', 'DZ Bank', 'KfW', 'HypoVereinsbank'],
  CA: ['Royal Bank of Canada', 'TD Bank', 'Scotiabank', 'Bank of Montreal', 'CIBC'],
  AU: ['Commonwealth Bank', 'Westpac', 'ANZ', 'NAB', 'Macquarie Bank'],
  JP: ['MUFG Bank', 'Sumitomo Mitsui Banking Corporation', 'Mizuho Bank'],
  FR: ['BNP Paribas', 'Crédit Agricole', 'Société Générale', 'Groupe BPCE'],
};

export const CURRENCY_TO_COUNTRY_CODE: { [currency: string]: string } = {
  USD: 'US',
  GBP: 'GB',
  EUR: 'DE', // Representative for Euro
  CAD: 'CA',
  AUD: 'AU',
  JPY: 'JP',
};

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec_1',
    fullName: 'Jane Doe',
    nickname: 'Design Contractor',
    bankName: 'Chase Bank',
    accountNumber: '**** **** **** 1234',
    country: SUPPORTED_COUNTRIES[0],
    streetAddress: '123 Main St',
    city: 'New York',
    stateProvince: 'NY',
    postalCode: '10001',
    deliveryOptions: {
      bankDeposit: true,
      cardDeposit: true,
      cashPickup: false,
    },
    realDetails: {
      accountNumber: '9876543210981234',
      swiftBic: 'CHASUS33',
    },
    recipientType: 'bank',
  },
  {
    id: 'rec_2',
    fullName: 'John Smith',
    nickname: 'London Office Rent',
    bankName: 'HSBC',
    accountNumber: '**** **** **** 5678',
    country: SUPPORTED_COUNTRIES[1],
    streetAddress: '10 Downing Street',
    city: 'London',
    stateProvince: '',
    postalCode: 'SW1A 2AA',
    deliveryOptions: {
      bankDeposit: true,
      cardDeposit: false,
      cashPickup: true,
    },
    realDetails: {
      accountNumber: '1234567890125678',
      swiftBic: 'MIDLGB22',
    },
    recipientType: 'bank',
  },
  {
    id: 'rec_3',
    fullName: 'Peter Jones',
    nickname: 'Office Supplies',
    bankName: 'Wells Fargo',
    accountNumber: '**** **** **** 9012',
    country: SUPPORTED_COUNTRIES[0],
    streetAddress: '456 Market St',
    city: 'San Francisco',
    stateProvince: 'CA',
    postalCode: '94105',
    deliveryOptions: {
        bankDeposit: true,
        cardDeposit: true,
        cashPickup: true,
    },
    realDetails: {
        accountNumber: '5432109876549012',
        swiftBic: 'WFBIUS6S',
    },
    recipientType: 'bank',
  }
];

export const SELF_RECIPIENT: Recipient = {
  id: 'self_0',
  fullName: 'Randy M. Chitwood',
  bankName: 'Card Deposit',
  accountNumber: '**** **** **** 8842', // User's own card/account
  country: SUPPORTED_COUNTRIES[0], // Assuming user is in the US for this
  streetAddress: '3797 Yorkshire Circle',
  city: 'Greenville',
  stateProvince: 'NC',
  postalCode: '27834',
  deliveryOptions: {
    bankDeposit: true,
    cardDeposit: true,
    cashPickup: false,
  },
  realDetails: {
    accountNumber: '4242424242428842',
    swiftBic: 'ICUUS33',
  },
  recipientType: 'bank',
};


export const INITIAL_ACCOUNTS: Account[] = [
    { id: 'acc_checking_1', type: AccountType.CHECKING, nickname: 'Main Checking', accountNumber: '**** 1234', balance: 1978620.38, features: ['International Transfers', 'Debit Card', 'FDIC Insured'] },
    { id: 'acc_savings_1', type: AccountType.SAVINGS, nickname: 'Emergency Fund', accountNumber: '**** 5678', balance: 2500, features: ['4.5% APY', 'Goal Setting', 'Automated Savings'] },
    { id: 'acc_business_1', type: AccountType.BUSINESS, accountNumber: '**** 9012', balance: 0, features: ['Multi-user Access', 'Invoicing Tools', 'Expense Tracking'] },
];

const now = new Date();

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: `txn_${now.getTime() - 86400000}`,
    accountId: 'acc_checking_1',
    recipient: INITIAL_RECIPIENTS[1],
    sendAmount: 1000,
    receiveAmount: 785.50,
    fee: 10,
    exchangeRate: 0.7855,
    status: TransactionStatus.FUNDS_ARRIVED,
    estimatedArrival: new Date(now.getTime() - 86400000),
    statusTimestamps: {
        [TransactionStatus.SUBMITTED]: new Date(now.getTime() - 86400000 * 3),
        [TransactionStatus.CONVERTING]: new Date(now.getTime() - 86400000 * 3 + 30000), // 30s later
        [TransactionStatus.IN_TRANSIT]: new Date(now.getTime() - 86400000 * 2),
        [TransactionStatus.FUNDS_ARRIVED]: new Date(now.getTime() - 86400000),
    },
    description: "Payment for services",
    type: 'debit',
    purpose: 'Payment for Services',
    reviewed: true,
  },
  {
    id: `txn_${now.getTime() - 3600000}`,
    accountId: 'acc_checking_1',
    recipient: INITIAL_RECIPIENTS[0],
    sendAmount: 500,
    receiveAmount: 490.00,
    fee: 5,
    exchangeRate: 1,
    status: TransactionStatus.IN_TRANSIT,
    estimatedArrival: new Date(now.getTime() + 86400000),
    statusTimestamps: {
        [TransactionStatus.SUBMITTED]: new Date(now.getTime() - 3600000),
        [TransactionStatus.CONVERTING]: new Date(now.getTime() - 3600000 + 4000), // 4s later
        [TransactionStatus.IN_TRANSIT]: new Date(now.getTime() - 3600000 + 12000), // 12s later
    },
    description: "Family support",
    type: 'debit',
    purpose: 'Family Support',
    reviewed: false,
  },
  {
    id: `txn_${now.getTime() - 86400000 * 5}`,
    accountId: 'acc_savings_1',
    recipient: SELF_RECIPIENT,
    sendAmount: 500,
    receiveAmount: 500,
    fee: 0,
    exchangeRate: 1,
    status: TransactionStatus.FUNDS_ARRIVED,
    estimatedArrival: new Date(now.getTime() - 86400000 * 5),
    statusTimestamps: {
        [TransactionStatus.SUBMITTED]: new Date(now.getTime() - 86400000 * 5),
        [TransactionStatus.FUNDS_ARRIVED]: new Date(now.getTime() - 86400000 * 5),
    },
    description: "Initial Deposit",
    type: 'credit',
    purpose: 'Account Deposit',
    reviewed: false,
  },
  {
    id: `txn_${now.getTime() - 86400000 * 10}`,
    accountId: 'acc_checking_1',
    recipient: SELF_RECIPIENT,
    sendAmount: 1250.75,
    receiveAmount: 1250.75,
    fee: 0,
    exchangeRate: 1,
    status: TransactionStatus.FUNDS_ARRIVED,
    estimatedArrival: new Date(now.getTime() - 86400000 * 10),
    statusTimestamps: {
      [TransactionStatus.SUBMITTED]: new Date(now.getTime() - 86400000 * 12),
      [TransactionStatus.FUNDS_ARRIVED]: new Date(now.getTime() - 86400000 * 10),
    },
    description: "Mobile Cheque Deposit #1234",
    type: 'credit',
    purpose: 'Account Deposit',
    chequeDetails: {
      chequeNumber: '1234',
      images: {
        front: 'https://placehold.co/800x333/E2E8F0/475569?text=Front+of+Check%0A%0APay+to+the+order+of+Randy+M.+Chitwood%0A%0A%241,250.75',
        back: 'https://placehold.co/800x333/E2E8F0/475569?text=Back+of+Check%0A%0AEndorse+Here',
      }
    },
    reviewed: false,
  },
];

export const FIXED_FEE = 5.00; // in USD
export const EXCHANGE_RATES: { [key: string]: number } = {
    USD: 1,
    GBP: 0.79,
    EUR: 0.92,
    CAD: 1.37,
    AUD: 1.51,
    JPY: 157.25,
};

export const INITIAL_CARDS: Card[] = [
    {
        id: 'card_1',
        lastFour: '8842',
        cardholderName: 'Randy M. Chitwood',
        expiryDate: '12/28',
        fullNumber: '4242 4242 4242 8842',
        cvc: '123',
        isFrozen: false,
        network: 'Visa',
    },
    {
        id: 'card_2',
        lastFour: '5555',
        cardholderName: 'Randy M. Chitwood',
        expiryDate: '06/29',
        fullNumber: '5555 5555 5555 5555',
        cvc: '456',
        isFrozen: false,
        network: 'Mastercard',
    }
];

export const INITIAL_CARD_TRANSACTIONS: CardTransaction[] = [
    { id: 'ctx_1', description: 'Amazon Marketplace', amount: 75.50, date: new Date(now.getTime() - 86400000 * 1), category: 'Shopping' },
    { id: 'ctx_2', description: 'Starbucks', amount: 8.30, date: new Date(now.getTime() - 86400000 * 2), category: 'Food & Drink' },
    { id: 'ctx_3', description: 'Netflix Subscription', amount: 15.49, date: new Date(now.getTime() - 86400000 * 3), category: 'Entertainment' },
];

export const INITIAL_TRANSFER_LIMITS: TransferLimits = {
  daily: { amount: 5000, count: 5 },
  weekly: { amount: 20000, count: 20 },
  monthly: { amount: 50000, count: 50 },
};

export const USER_PIN = '1234';
export const USER_PASSWORD = 'password123';
export const NETWORK_AUTH_CODE = '987654';

// --- Crypto Constants ---

const generatePriceHistory = (base: number, points: number, volatility: number): number[] => {
    const history = [base];
    let current = base;
    for (let i = 1; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility * current;
        current = Math.max(current + change, 0); // Ensure price doesn't go below 0
        history.push(current);
    }
    return history;
};


export const INITIAL_CRYPTO_ASSETS: CryptoAsset[] = [
    {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: BtcIcon,
        price: 68530.45,
        change24h: 2.15,
        marketCap: 1350000000000,
        priceHistory: generatePriceHistory(68530.45, 50, 0.01),
    },
    {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        icon: EthIcon,
        price: 3550.12,
        change24h: -1.23,
        marketCap: 426000000000,
        priceHistory: generatePriceHistory(3550.12, 50, 0.015),
    },
    {
        id: 'shl',
        name: 'ShellCoin',
        symbol: 'SHL',
        icon: ShellIcon,
        price: 1.25,
        change24h: 5.78,
        marketCap: 1250000000,
        priceHistory: generatePriceHistory(1.25, 50, 0.02),
    }
];

export const INITIAL_CRYPTO_HOLDINGS: CryptoHolding[] = [
    {
        assetId: 'btc',
        amount: 0.05,
        avgBuyPrice: 65000.00,
    },
    {
        assetId: 'eth',
        amount: 1.5,
        avgBuyPrice: 3200.00,
    }
];

export const CRYPTO_TRADE_FEE_PERCENT = 0.005; // 0.5% trade fee

// --- Services Constants ---

export const INITIAL_SUBSCRIPTIONS: SubscriptionService[] = [
    { id: 'sub_1', provider: 'SpaceX Starlink', plan: 'Residential Standard', amount: 120.00, dueDate: new Date(now.getTime() + 86400000 * 5), type: SubscriptionServiceType.SATELLITE, isPaid: false },
    { id: 'sub_2', provider: 'Comcast Xfinity', plan: 'Gigabit Extra Internet', amount: 85.00, dueDate: new Date(now.getTime() + 86400000 * 10), type: SubscriptionServiceType.INTERNET, isPaid: false },
    { id: 'sub_3', provider: 'YouTube TV', plan: 'Base Plan + 4K Plus', amount: 82.99, dueDate: new Date(now.getTime() + 86400000 * 12), type: SubscriptionServiceType.TV, isPaid: false },
    { id: 'sub_4', provider: 'Netflix', plan: 'Premium', amount: 22.99, dueDate: new Date(now.getTime() - 86400000 * 15), type: SubscriptionServiceType.TV, isPaid: true },
];

export const INITIAL_APPLE_CARD_DETAILS: AppleCardDetails = {
    lastFour: '1005',
    balance: 1479.36,
    creditLimit: 10000,
    availableCredit: 8520.64,
    spendingLimits: [
        { category: 'Food & Drink', limit: 200 },
        { category: 'Transport', limit: 150 },
        { category: 'Shopping', limit: 750 },
        { category: 'Groceries', limit: 400 },
        { category: 'Entertainment', limit: 100 },
        { category: 'Other', limit: 250 },
    ]
};

export const INITIAL_APPLE_CARD_TRANSACTIONS: AppleCardTransaction[] = [
    { id: 'act_1', vendor: 'Apple Store', category: 'Electronics', amount: 1199.00, date: new Date(now.getTime() - 86400000 * 3) },
    { id: 'act_2', vendor: 'Uber', category: 'Transport', amount: 24.50, date: new Date(now.getTime() - 86400000 * 4) },
    { id: 'act_3', vendor: 'Starbucks', category: 'Food & Drink', amount: 12.75, date: new Date(now.getTime() - 86400000 * 4) },
    { id: 'act_4', vendor: 'Whole Foods', category: 'Groceries', amount: 153.21, date: new Date(now.getTime() - 86400000 * 6) },
    { id: 'act_5', vendor: 'Zara', category: 'Shopping', amount: 89.90, date: new Date(now.getTime() - 86400000 * 10) },
];

// --- Travel Check-in Constants ---

export const INITIAL_TRAVEL_PLANS: TravelPlan[] = [
    { 
        id: 'travel_1', 
        country: SUPPORTED_COUNTRIES[5], // Japan
        startDate: new Date(now.getTime() - (86400000 * 2)), // 2 days ago
        endDate: new Date(now.getTime() + (86400000 * 5)), // 5 days from now
        status: TravelPlanStatus.ACTIVE 
    },
    { 
        id: 'travel_2', 
        country: SUPPORTED_COUNTRIES[1], // UK
        startDate: new Date(now.getTime() + (86400000 * 10)), // 10 days from now
        endDate: new Date(now.getTime() + (86400000 * 20)), // 20 days from now
        status: TravelPlanStatus.UPCOMING 
    },
    { 
        id: 'travel_3', 
        country: SUPPORTED_COUNTRIES[2], // Germany
        startDate: new Date(now.getTime() - (86400000 * 30)), // 30 days ago
        endDate: new Date(now.getTime() - (86400000 * 25)), // 25 days ago
        status: TravelPlanStatus.COMPLETED 
    },
];

// --- Security Constants ---
export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  mfaEnabled: false,
  biometricsEnabled: true,
};

export const INITIAL_TRUSTED_DEVICES: TrustedDevice[] = [
  { id: 'dev_1', deviceType: 'desktop', browser: 'Chrome on macOS', location: 'New York, NY', lastLogin: new Date(), isCurrent: true },
  { id: 'dev_2', deviceType: 'mobile', browser: 'Safari on iOS', location: 'New York, NY', lastLogin: new Date(Date.now() - 86400000 * 2), isCurrent: false },
  { id: 'dev_3', deviceType: 'desktop', browser: 'Firefox on Windows', location: 'Chicago, IL', lastLogin: new Date(Date.now() - 86400000 * 7), isCurrent: false },
];

// --- User Profile ---
export const USER_PROFILE: UserProfile = {
  name: 'Randy M. Chitwood',
// FIX: Replaced "ishellcu.com" with "apexbank.com" for brand consistency.
  email: 'randy.m.chitwood@apexbank.com',
  profilePictureUrl: 'data:image/jpeg;base64,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';,
  lastLogin: {
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    from: 'New York, NY',
  },
};

// --- Platform Features ---
export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  hapticsEnabled: true,
  theme: 'blue',
};

export const THEME_COLORS: { [key in PlatformTheme]: { [key: string]: string } } = {
  blue: {
    '50': '230 238 255',
    '100': '204 222 255',
    '200': '153 189 255',
    '300': '102 155 255',
    '400': '51 122 255',
    '500': '0 82 255',
    '600': '0 66 204',
    '700': '0 49 153',
    '800': '0 33 102',
    '900': '0 16 51',
  },
  green: {
    '50': '240 253 244',
    '100': '220 252 231',
    '200': '187 247 208',
    '300': '134 239 172',
    '400': '74 222 128',
    '500': '34 197 94',
    '600': '22 163 74',
    '700': '21 128 61',
    '800': '22 101 52',
    '900': '20 83 45',
  },
  purple: {
    '50': '245 243 255',
    '100': '237 233 254',
    '200': '221 214 254',
    '300': '196 181 253',
    '400': '167 139 250',
    '500': '139 92 246',
    '600': '124 58 237',
    '700': '109 40 217',
    '800': '91 33 182',
    '900': '76 29 149',
  }
};

// --- Task Management Constants ---
export const INITIAL_TASKS: Task[] = [
  { id: 'task_1', text: 'Pay Q3 estimated taxes', completed: false, dueDate: new Date(new Date().setDate(new Date().getDate() + 10)), notificationSent: false },
  { id: 'task_2', text: 'Review monthly budget with financial advisor', completed: false, dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), notificationSent: false },
  { id: 'task_3', text: 'Set up recurring transfer for rent', completed: false, notificationSent: false },
  { id: 'task_4', text: 'File expense reports for June', completed: true, dueDate: new Date(new Date().setDate(new Date().getDate() - 15)), notificationSent: false },
  { id: 'task_5', text: 'Submit weekly expense report', completed: false, dueDate: new Date(), notificationSent: false },
];

// --- Flight Booking Constants ---
export const AIRPORTS: Airport[] = [
    { code: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'USA' },
    { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
    { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
];

export const INITIAL_FLIGHT_BOOKINGS: FlightBooking[] = [];


// --- Utilities Constants ---
export const UTILITY_BILLERS: UtilityBiller[] = [
    { id: 'util_1', name: 'Con Edison', type: UtilityType.ELECTRICITY, icon: LightningBoltIcon, accountNumber: '****-1122' },
    { id: 'util_2', name: 'National Grid', type: UtilityType.GAS, icon: FireIcon, accountNumber: '****-3344' },
    { id: 'util_3', name: 'NYC Water', type: UtilityType.WATER, icon: WaterDropIcon, accountNumber: '****-5566' },
    { id: 'util_4', name: 'Verizon Fios', type: UtilityType.INTERNET, icon: WifiIcon, accountNumber: '****-7788' },
];

export const INITIAL_UTILITY_BILLS: UtilityBill[] = [
    { id: 'bill_1', billerId: 'util_1', amount: 125.50, dueDate: new Date(now.getTime() + 86400000 * 10), isPaid: false },
    { id: 'bill_2', billerId: 'util_2', amount: 78.20, dueDate: new Date(now.getTime() + 86400000 * 12), isPaid: false },
    { id: 'bill_3', billerId: 'util_3', amount: 65.00, dueDate: new Date(now.getTime() - 86400000 * 5), isPaid: true },
    { id: 'bill_4', billerId: 'util_4', amount: 89.99, dueDate: new Date(now.getTime() + 86400000 * 15), isPaid: false },
];

export const ATM_LOCATIONS: AtmLocation[] = [
  { id: 'atm1', name: 'ApexBank - Main Branch', address: '123 Wall Street', city: 'New York', state: 'NY', zip: '10005', network: 'ApexBank', lat: 40.7061, lng: -74.0089 },
  { id: 'atm2', name: 'Allpoint at CVS', address: '500 Broadway', city: 'New York', state: 'NY', zip: '10012', network: 'Allpoint', lat: 40.7225, lng: -73.9984 },
  { id: 'atm3', name: 'Visa Plus at 7-Eleven', address: '711 Times Square', city: 'New York', state: 'NY', zip: '10036', network: 'Visa Plus', lat: 40.7580, lng: -73.9855 },
  { id: 'atm4', name: 'Cirrus ATM', address: 'Grand Central Terminal', city: 'New York', state: 'NY', zip: '10017', network: 'Cirrus', lat: 40.7527, lng: -73.9772 },
  { id: 'atm5', name: 'ApexBank - Financial District', address: '555 California Street', city: 'San Francisco', state: 'CA', zip: '94104', network: 'ApexBank', lat: 37.7923, lng: -122.4042 },
  { id: 'atm6', name: 'Allpoint at Target', address: '789 Mission Street', city: 'San Francisco', state: 'CA', zip: '94103', network: 'Allpoint', lat: 37.7808, lng: -122.4069 },
  { id: 'atm7', name: 'Visa Plus ATM', address: 'Fisherman\'s Wharf, Pier 39', city: 'San Francisco', state: 'CA', zip: '94133', network: 'Visa Plus', lat: 37.8087, lng: -122.4098 },
];