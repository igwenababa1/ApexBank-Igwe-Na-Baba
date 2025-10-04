

import { Country, Recipient, Transaction, TransactionStatus, Card, CardTransaction, TransferLimits } from './types';

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
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
    bankName: 'HSBC UK',
    accountNumber: '**** **** **** 5678',
    country: SUPPORTED_COUNTRIES[1],
    deliveryOptions: {
      bankDeposit: true,
      cardDeposit: false,
      cashPickup: true,
    },
    realDetails: {
      accountNumber: '1234567890125678',
      swiftBic: 'HBUKGB4B',
    }
  },
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


const now = Date.now();

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: `txn_${now - 86400000}`,
    recipient: INITIAL_RECIPIENTS[1],
    sendAmount: 1000,
    receiveAmount: 785.50,
    fee: 10,
    exchangeRate: 0.7855,
    status: TransactionStatus.FUNDS_ARRIVED,
    estimatedArrival: new Date(now - 86400000),
    statusTimestamps: {
        [TransactionStatus.SUBMITTED]: new Date(now - 86400000 * 3),
        [TransactionStatus.CONVERTING]: new Date(now - 86400000 * 3 + 30000), // 30s later
        [TransactionStatus.IN_TRANSIT]: new Date(now - 86400000 * 2),
        [TransactionStatus.FUNDS_ARRIVED]: new Date(now - 86400000),
    },
    description: "Payment for services",
    type: 'debit',
    purpose: 'Payment for Services',
  },
  {
    id: `txn_${now - 3600000}`,
    recipient: INITIAL_RECIPIENTS[0],
    sendAmount: 500,
    receiveAmount: 490.00,
    fee: 5,
    exchangeRate: 1,
    status: TransactionStatus.IN_TRANSIT,
    estimatedArrival: new Date(now + 86400000),
    statusTimestamps: {
        [TransactionStatus.SUBMITTED]: new Date(now - 3600000),
        [TransactionStatus.CONVERTING]: new Date(now - 3600000 + 4000), // 4s later
        [TransactionStatus.IN_TRANSIT]: new Date(now - 3600000 + 12000), // 12s later
    },
    description: "Family support",
    type: 'debit',
    purpose: 'Family Support',
  },
];

export const FIXED_FEE = 5.00; // in USD
export const EXCHANGE_RATES: { [key: string]: number } = {
    USD: 1,
    GBP: 0.79,
    EUR: 0.92,
    CAD: 1.37,
    AUD: 1.51,
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
    { id: 'ctx_1', description: 'Amazon Marketplace', amount: 75.50, date: new Date(now - 86400000 * 1), category: 'Shopping' },
    { id: 'ctx_2', description: 'Starbucks', amount: 8.30, date: new Date(now - 86400000 * 2), category: 'Food & Drink' },
    { id: 'ctx_3', description: 'Netflix Subscription', amount: 15.49, date: new Date(now - 86400000 * 3), category: 'Entertainment' },
];

export const INITIAL_TRANSFER_LIMITS: TransferLimits = {
  daily: { amount: 5000, count: 5 },
  weekly: { amount: 20000, count: 20 },
  monthly: { amount: 50000, count: 50 },
};

export const USER_PIN = '1234';