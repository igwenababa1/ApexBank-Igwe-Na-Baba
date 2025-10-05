// FIX: Import React to make React types like `ComponentType` available in this file.
import React from 'react';

export enum TransactionStatus {
  SUBMITTED = 'Submitted',
  CONVERTING = 'Converting & Sending',
  IN_TRANSIT = 'In Transit',
  FUNDS_ARRIVED = 'Funds Arrived',
}

export enum CustomerGroup {
  ALL = 'all',
  NEW_USERS = 'new_users',
  FREQUENT_SENDERS = 'frequent_senders',
}

export enum NotificationType {
  TRANSACTION = 'transaction',
  SECURITY = 'security',
  CARD = 'card',
  LOAN = 'loan',
  CRYPTO = 'crypto',
  SUBSCRIPTION = 'subscription',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
}

export interface DeliveryOptions {
  bankDeposit: boolean;
  cardDeposit: boolean;
  cashPickup: boolean;
}

export interface RealAccountDetails {
  accountNumber: string;
  swiftBic: string;
}

export interface Recipient {
  id: string;
  fullName: string;
  nickname?: string;
  bankName: string;
  accountNumber: string; // Masked account number for display
  country: Country;
  deliveryOptions: DeliveryOptions;
  realDetails: RealAccountDetails;
}


export interface Transaction {
  id:string;
  accountId: string; // The ID of the source/destination account
  recipient: Recipient;
  sendAmount: number;
  receiveAmount: number;
  fee: number;
  exchangeRate: number;
  status: TransactionStatus;
  estimatedArrival: Date;
  statusTimestamps: {
    [TransactionStatus.SUBMITTED]: Date;
    [TransactionStatus.CONVERTING]?: Date;
    [TransactionStatus.IN_TRANSIT]?: Date;
    [TransactionStatus.FUNDS_ARRIVED]?: Date;
  };
  description: string;
  type: 'debit' | 'credit';
  purpose?: string;
  chequeDetails?: {
    chequeNumber?: string;
    images: {
      front: string;
      back: string;
    }
  }
}

export interface Card {
  id: string;
  lastFour: string;
  cardholderName: string;
  expiryDate: string;
  fullNumber?: string;
  cvc?: string;
  isFrozen: boolean;
}

export interface CardTransaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
}

export interface TransferLimit {
  amount: number;
  count: number;
}

export interface TransferLimits {
  daily: TransferLimit;
  weekly: TransferLimit;
  monthly: TransferLimit;
}

export interface NewsArticle {
  title: string;
  summary: string;
  category: string;
}

export interface InsuranceProduct {
  name: string;
  description: string;
  benefits: string[];
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  interestRate: {
    min: number;
    max: number;
  };
}

export enum LoanApplicationStatus {
  PENDING = 'Pending Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface LoanApplication {
  id: string;
  loanProduct: LoanProduct;
  amount: number;
  term: number; // in months
  status: LoanApplicationStatus;
  submittedDate: Date;
}

export interface SupportTopic {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SystemUpdate {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'New Feature' | 'Improvement' | 'Maintenance';
}

export enum AccountType {
  CHECKING = 'Global Checking',
  SAVINGS = 'High-Yield Savings',
  BUSINESS = 'Business Pro',
}

export enum VerificationLevel {
  UNVERIFIED = 'Unverified',
  LEVEL_1 = 'Level 1: Verified',
  LEVEL_2 = 'Level 2: Verified+',
}

export interface Account {
  id: string;
  type: AccountType;
  nickname?: string;
  accountNumber: string; // Masked
  balance: number;
  features: string[];
}

// Crypto-specific types
export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  price: number;
  change24h: number;
  marketCap: number;
  priceHistory: number[];
}

export interface CryptoHolding {
  assetId: string;
  amount: number;
  avgBuyPrice: number;
}

export interface Order {
    price: number;
    size: number;
}

export interface Trade {
    id: string;
    price: number;
    size: number;
    time: string;
    type: 'buy' | 'sell';
}

// Services and Subscriptions
export enum SubscriptionServiceType {
    INTERNET = 'Internet',
    TV = 'TV',
    SATELLITE = 'Satellite',
}

export interface SubscriptionService {
    id: string;
    provider: string;
    plan: string;
    amount: number;
    dueDate: Date;
    type: SubscriptionServiceType;
    isPaid: boolean;
}

export interface AppleCardDetails {
    lastFour: string;
    balance: number;
    creditLimit: number;
    availableCredit: number;
}

export interface AppleCardTransaction {
    id: string;
    vendor: string;
    category: string;
    amount: number;
    date: Date;
}