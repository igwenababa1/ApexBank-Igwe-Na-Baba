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
  bankName: string;
  accountNumber: string; // Masked account number for display
  country: Country;
  deliveryOptions: DeliveryOptions;
  realDetails: RealAccountDetails;
}


export interface Transaction {
  id: string;
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