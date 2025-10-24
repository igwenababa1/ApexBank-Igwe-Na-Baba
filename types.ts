// FIX: Import React to make React types like `ComponentType` available in this file.
import React from 'react';

export type View = 'dashboard' | 'send' | 'recipients' | 'history' | 'security' | 'cards' | 'insurance' | 'loans' | 'support' | 'accounts' | 'crypto' | 'services' | 'checkin' | 'platform' | 'tasks' | 'flights' | 'utilities' | 'integrations' | 'advisor' | 'invest' | 'atmLocator';

export type BalanceDisplayMode = 'global' | 'domestic';

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
  TRAVEL = 'travel',
  TASK = 'task',
  INSURANCE = 'insurance',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  linkTo?: View;
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
  accountNumber: string; // Masked account number or service identifier for display
  country: Country;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  deliveryOptions: DeliveryOptions;
  realDetails: RealAccountDetails;
  recipientType?: 'bank' | 'service';
  serviceName?: 'PayPal' | 'CashApp' | 'Zelle' | 'Western Union' | 'MoneyGram' | string;
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
  requiresAuth?: boolean;
  chequeDetails?: {
    chequeNumber?: string;
    images: {
      front: string;
      back: string;
    }
  }
  reviewed?: boolean;
}

export interface Card {
  id: string;
  lastFour: string;
  cardholderName: string;
  expiryDate: string;
  fullNumber?: string;
  cvc?: string;
  isFrozen: boolean;
  network: 'Visa' | 'Mastercard';
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
  LEVEL_1 = 'Level 1: SSN Verified',
  LEVEL_2 = 'Level 2: Document Verified',
  LEVEL_3 = 'Level 3: Liveness Verified',
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

export type SpendingCategory = 'Electronics' | 'Transport' | 'Food & Drink' | 'Groceries' | 'Shopping' | 'Entertainment' | 'Other';

export const SPENDING_CATEGORIES: SpendingCategory[] = ['Electronics', 'Transport', 'Food & Drink', 'Groceries', 'Shopping', 'Entertainment', 'Other'];


export interface SpendingLimit {
    category: SpendingCategory;
    limit: number; // The monthly limit in USD
}

export interface AppleCardDetails {
    lastFour: string;
    balance: number;
    creditLimit: number;
    availableCredit: number;
    spendingLimits: SpendingLimit[];
}

export interface AppleCardTransaction {
    id: string;
    vendor: string;
    category: SpendingCategory;
    amount: number;
    date: Date;
}

// Travel Check-In
export enum TravelPlanStatus {
    UPCOMING = 'Upcoming',
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
}

export interface TravelPlan {
    id: string;
    country: Country;
    startDate: Date;
    endDate: Date;
    status: TravelPlanStatus;
}

// Security
export interface SecuritySettings {
  mfaEnabled: boolean;
  biometricsEnabled: boolean;
}

export interface TrustedDevice {
  id: string;
  deviceType: 'desktop' | 'mobile';
  browser: string;
  location: string;
  lastLogin: Date;
  isCurrent: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  profilePictureUrl: string;
  lastLogin: {
    date: Date;
    from: string; // e.g., 'New York, NY'
  };
}

// Platform-specific features
export type PlatformTheme = 'blue' | 'green' | 'purple';

export interface PlatformSettings {
  hapticsEnabled: boolean;
  theme: PlatformTheme;
}

// Task Management
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  notificationSent?: boolean;
}

// Flight Booking
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departureTime: Date;
  arrivalTime: Date;
  duration: string; // e.g., "8h 30m"
  price: number;
  stops: number;
}

export interface FlightBooking {
    id: string;
    flight: Flight;
    passengers: number;
    totalPrice: number;
    bookingDate: Date;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

// Utilities
export enum UtilityType {
    ELECTRICITY = 'Electricity',
    WATER = 'Water',
    GAS = 'Gas',
    INTERNET = 'Internet',
}

export interface UtilityBiller {
    id: string;
    name: string;
    type: UtilityType;
    icon: React.ComponentType<{ className?: string }>;
    accountNumber: string; // user's account number with the biller
}

export interface UtilityBill {
    id: string;
    billerId: string;
    amount: number;
    dueDate: Date;
    isPaid: boolean;
}

// AI Financial Advisor
export interface FinancialInsight {
    category: string; // e.g., "Spending", "Savings"
    insight: string; // e.g., "Your spending on 'Food & Drink' is 20% higher this month."
    priority: 'high' | 'medium' | 'low';
}

export interface ProductRecommendation {
    productType: 'loan' | 'savings_account' | 'insurance' | 'credit_card';
    reason: string; // e.g., "Your high savings balance could be earning more in a High-Yield Savings account."
    suggestedAction: string; // e.g., "Explore Savings Accounts"
    linkTo: View;
}

export interface AdvisorResponse {
    overallSummary: string;
    financialScore: number; // A score from 0-100
    insights: FinancialInsight[];
    recommendations: ProductRecommendation[];
}

export interface AtmLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  network: 'Allpoint' | 'Visa Plus' | 'Cirrus' | 'ApexBank';
  lat: number;
  lng: number;
}