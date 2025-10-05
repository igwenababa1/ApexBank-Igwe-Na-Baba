import { Country, Recipient, Transaction, TransactionStatus, Card, CardTransaction, TransferLimits, Account, AccountType, CryptoAsset, CryptoHolding, SubscriptionService, SubscriptionServiceType, AppleCardDetails, AppleCardTransaction, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile } from './types';
import { BtcIcon, EthIcon, ApxIcon } from './components/Icons';

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
    'Other',
];

export const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: 'rec_1',
    fullName: 'Jane Doe',
    nickname: 'Design Contractor',
    bankName: 'Chase Bank',
    accountNumber: '**** **** **** 1234',
    country: SUPPORTED_COUNTRIES[0],
    deliveryOptions: {
      bankDeposit: true,
      cardDeposit: true,
      cashPickup: false,
    },
    realDetails: {
      accountNumber: '9876543210981234',
      swiftBic: 'CHASUS33',
    }
  },
  {
    id: 'rec_2',
    fullName: 'John Smith',
    nickname: 'London Office Rent',
    bankName: 'Bank of America',
    accountNumber: '**** **** **** 5678',
    country: SUPPORTED_COUNTRIES[1],
    deliveryOptions: {
      bankDeposit: true,
      cardDeposit: false,
      cashPickup: true,
    },
    realDetails: {
      accountNumber: '1234567890125678',
      swiftBic: 'BOFAGB22',
    }
  },
  {
    id: 'rec_3',
    fullName: 'Peter Jones',
    nickname: 'Office Supplies',
    bankName: 'Wells Fargo',
    accountNumber: '**** **** **** 9012',
    country: SUPPORTED_COUNTRIES[0],
    deliveryOptions: {
        bankDeposit: true,
        cardDeposit: true,
        cashPickup: true,
    },
    realDetails: {
        accountNumber: '5432109876549012',
        swiftBic: 'WFBIUS6S',
    }
  }
];

export const SELF_RECIPIENT: Recipient = {
  id: 'self_0',
  fullName: 'Eleanor Vance',
  bankName: 'Card Deposit',
  accountNumber: '**** **** **** 8842', // User's own card/account
  country: SUPPORTED_COUNTRIES[0], // Assuming user is in the US for this
  deliveryOptions: {
    bankDeposit: true,
    cardDeposit: true,
    cashPickup: false,
  },
  realDetails: {
    accountNumber: '4242424242428842',
    swiftBic: 'APEXUS33',
  }
};


export const INITIAL_ACCOUNTS: Account[] = [
    { id: 'acc_checking_1', type: AccountType.CHECKING, nickname: 'Main Checking', accountNumber: '**** 1234', balance: 7500, features: ['International Transfers', 'Debit Card', 'FDIC Insured'] },
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
        front: 'https://placehold.co/600x250/E2E8F0/475569?text=Cheque+Front',
        back: 'https://placehold.co/600x250/E2E8F0/475569?text=Cheque+Back',
      }
    }
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

export const INITIAL_CARD_DETAILS: Card = {
    id: 'card_1',
    lastFour: '8842',
    cardholderName: 'Eleanor Vance',
    expiryDate: '12/28',
    fullNumber: '4242 4242 4242 8842',
    cvc: '123',
    isFrozen: false,
};

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
        id: 'apx',
        name: 'ApexCoin',
        symbol: 'APX',
        icon: ApxIcon,
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
  name: 'Eleanor Vance',
  email: 'eleanor.vance@apexbank.com',
  profilePictureUrl: 'https://i.pravatar.cc/150?u=eleanor-vance',
  lastLogin: {
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    from: 'New York, NY',
  },
};