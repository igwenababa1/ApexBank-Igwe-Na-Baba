// FIX: Import `useMemo` from React to resolve 'Cannot find name' error.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { Recipients } from './components/Recipients';
import { Transaction, Recipient, TransactionStatus, Card, Notification, NotificationType, TransferLimits, Country, InsuranceProduct, LoanApplication, LoanApplicationStatus, Account, VerificationLevel, CryptoHolding, CryptoAsset, SubscriptionService, AppleCardDetails, AppleCardTransaction, SpendingLimit, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile, PlatformSettings, PlatformTheme, View, Task, FlightBooking, UtilityBill, UtilityBiller } from './types';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_CARD_TRANSACTIONS, INITIAL_TRANSFER_LIMITS, SELF_RECIPIENT, INITIAL_ACCOUNTS, INITIAL_CRYPTO_HOLDINGS, INITIAL_CRYPTO_ASSETS, CRYPTO_TRADE_FEE_PERCENT, INITIAL_SUBSCRIPTIONS, INITIAL_APPLE_CARD_DETAILS, INITIAL_APPLE_CARD_TRANSACTIONS, INITIAL_TRAVEL_PLANS, INITIAL_SECURITY_SETTINGS, INITIAL_TRUSTED_DEVICES, USER_PROFILE, INITIAL_PLATFORM_SETTINGS, THEME_COLORS, INITIAL_TASKS, INITIAL_FLIGHT_BOOKINGS, INITIAL_UTILITY_BILLS, UTILITY_BILLERS } from './constants';
import { Welcome } from './components/Welcome';
import { ProfileSignIn } from './components/ProfileSignIn';
import { ActivityLog } from './components/ActivityLog';
import { Security } from './components/Settings';
import { CardManagement } from './components/CardManagement';
import { Loans } from './components/Loans';
import { Support } from './components/Support';
import { Accounts } from './components/Accounts';
import { CryptoDashboard } from './components/CryptoDashboard';
import { ServicesDashboard } from './components/ServicesDashboard';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal';
import { InactivityModal } from './components/InactivityModal';
import { TravelCheckIn } from './components/TravelCheckIn';
import { PlatformFeatures } from './components/PlatformFeatures';
import { DynamicIslandSimulator } from './components/DynamicIslandSimulator';
import { BankingChat } from './components/BankingChat';
import { Tasks } from './components/Tasks';
import { Flights } from './components/Flights';
import { Utilities } from './components/Utilities';
import {
  sendTransactionalEmail,
  generateTransactionReceiptEmail,
  generateNewRecipientEmail,
  generateCardStatusEmail,
  generateFundsArrivedEmail,
  sendSmsNotification,
  generateLoginAlertEmail,
  generateLoginAlertSms,
  generateNewRecipientSms,
  generateTransactionReceiptSms,
  generateWelcomeEmail,
  generateWelcomeSms,
  generateDepositConfirmationEmail,
  generateDepositConfirmationSms
} from './services/notificationService';
import { getInsuranceProductDetails } from './services/geminiService';
import { DevicePhoneMobileIcon, GlobeAltIcon, ShieldCheckIcon, SpinnerIcon, InfoIcon, CheckCircleIcon } from './components/Icons';
import { OpeningSequence } from './components/OpeningSequence';
import { LoggingOut } from './components/LoggingOut';
import { IntroSequence } from './components/IntroSequence';


const InsuranceProductCard: React.FC<{ product: InsuranceProduct }> = ({ product }) => {
    const getIcon = (name: string) => {
        if (name.includes('Transfer')) return <ShieldCheckIcon className="w-6 h-6 text-primary" />;
        if (name.includes('Travel')) return <GlobeAltIcon className="w-6 h-6 text-primary" />;
        if (name.includes('Device')) return <DevicePhoneMobileIcon className="w-6 h-6 text-primary" />;
        return <ShieldCheckIcon className="w-6 h-6 text-primary" />;
    };
    return (
        <div className="bg-slate-200 rounded-2xl shadow-digital p-6 flex flex-col">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center shadow-digital">
                    {getIcon(product.name)}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                </div>
            </div>
            <p className="text-sm text-slate-600 my-4 flex-grow">{product.description}</p>
            <div className="space-y-3 pt-4 border-t border-slate-300">
                {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700">{benefit}</p>
                    </div>
                ))}
            </div>
            <button className="mt-6 w-full py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow">
                Get a Quote
            </button>
        </div>
    );
};

const InsuranceSkeletonLoader: React.FC = () => (
    <div className="bg-slate-200 rounded-2xl shadow-digital p-6 animate-pulse">
        <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-slate-300 rounded-lg"></div>
            <div className="flex-1 space-y-2">
                 <div className="h-5 bg-slate-300 rounded w-3/4"></div>
            </div>
        </div>
        <div className="h-4 bg-slate-300 rounded w-full mt-4"></div>
        <div className="h-4 bg-slate-300 rounded w-5/6 mt-2"></div>
        <div className="h-10 bg-slate-300 rounded-lg w-full mt-6"></div>
    </div>
);


const Insurance: React.FC = () => {
    const [products, setProducts] = useState<InsuranceProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchInsuranceProducts = async () => {
            const productNames = ['Transfer Protection', 'Global Travel Insurance', 'Device Protection'];
            try {
                const results = await Promise.all(
                    productNames.map(name => getInsuranceProductDetails(name))
                );
                const fetchedProducts = results.map(r => r.product).filter((p): p is InsuranceProduct => p !== null);

                if (results.some(r => r.isError) && fetchedProducts.length === 0) {
                    setIsError(true);
                } else {
                    setProducts(fetchedProducts);
                }
            } catch (error) {
                console.error("Failed to fetch insurance products:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsuranceProducts();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Insurance & Protection</h2>
                <p className="text-sm text-slate-500 mt-1">Enhance your financial security with tailored protection plans from our trusted partners.</p>
            </div>
            <div className="bg-slate-200 rounded-2xl shadow-digital p-6 text-center">
                 <h3 className="text-xl font-bold text-slate-800">Peace of Mind, Powered by Apex Assurance</h3>
                 <p className="mt-2 text-slate-600 max-w-3xl mx-auto">
                    We've partnered with industry-leading insurer Apex Assurance to offer you exclusive protection products. Whether you're sending money, traveling, or just going about your day, we've got you covered.
                 </p>
            </div>
            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InsuranceSkeletonLoader />
                    <InsuranceSkeletonLoader />
                    <InsuranceSkeletonLoader />
                 </div>
            ) : isError ? (
                <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-100 p-4 rounded-lg shadow-digital-inset">
                    <InfoIcon className="w-6 h-6" />
                    <p>Could not load insurance products at this time. Please try again later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => <InsuranceProductCard key={product.name} product={product} />)}
                </div>
            )}
        </div>
    );
};


type AuthStatus = 'initializing' | 'intro' | 'loggedOut' | 'profileSignIn' | 'loggedIn';

const INACTIVITY_WARNING_TIMEOUT = 9 * 60 * 1000; // 9 minutes
const INACTIVITY_MODAL_COUNTDOWN = 60; // 60 seconds

const USER_EMAIL = "eleanor.vance@apexbank.com";
const USER_NAME = "Eleanor Vance";
const USER_PHONE = "+1-555-012-1234";

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loggedOut');
  const [isNewAccountLogin, setIsNewAccountLogin] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transferLimits, setTransferLimits] = useState<TransferLimits>(INITIAL_TRANSFER_LIMITS);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>(VerificationLevel.UNVERIFIED);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>(INITIAL_CRYPTO_HOLDINGS);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionService[]>(INITIAL_SUBSCRIPTIONS);
  const [appleCardDetails, setAppleCardDetails] = useState<AppleCardDetails>(INITIAL_APPLE_CARD_DETAILS);
  const [appleCardTransactions, setAppleCardTransactions] = useState<AppleCardTransaction[]>(INITIAL_APPLE_CARD_TRANSACTIONS);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(INITIAL_TRAVEL_PLANS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(INITIAL_PLATFORM_SETTINGS);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(INITIAL_TRUSTED_DEVICES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>(INITIAL_FLIGHT_BOOKINGS);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>(INITIAL_UTILITY_BILLS);
  const utilityBillers = UTILITY_BILLERS; // This is constant for now
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const inactivityTimerRef = React.useRef<number>();
  
  const handleCredentialsSuccess = (isNewAccount = false) => {
    setIsNewAccountLogin(isNewAccount);
    setAuthStatus('profileSignIn');
  };

  const handleEnterDashboard = () => {
    setAuthStatus('initializing');
  };
  
  const handleInitiateLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleFinalizeLogout = useCallback(() => {
    setAuthStatus('loggedOut');
    setActiveView('dashboard');
    setNotifications([]); // Clear notifications on logout
    setIsLoggingOut(false); // Hide logging out screen
  }, []);

  const handleConfirmLogout = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    setShowInactivityModal(false);
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true); // Show logging out screen
  }, []);

  const addNotification = useCallback((type: NotificationType, title: string, message: string, linkTo?: View) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      linkTo,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);
  
  useEffect(() => {
    if (authStatus === 'loggedIn') {
      if (isNewAccountLogin) {
          addNotification(
              NotificationType.SECURITY,
              'Welcome to ApexBank!',
              'Your account has been successfully created. We\'re glad to have you.',
              'dashboard'
          );
          const { subject, body } = generateWelcomeEmail(USER_NAME);
          sendTransactionalEmail(USER_EMAIL, subject, body);
          sendSmsNotification(USER_PHONE, generateWelcomeSms(USER_NAME));
      } else {
          addNotification(
              NotificationType.SECURITY,
              'Successful Sign In',
              'Your account was accessed from a new device. If this was not you, please contact support.',
              'security'
          );
          const { subject, body } = generateLoginAlertEmail(USER_NAME);
          sendTransactionalEmail(USER_EMAIL, subject, body);
          sendSmsNotification(USER_PHONE, generateLoginAlertSms());
      }
    }
  }, [authStatus, isNewAccountLogin, addNotification]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addRecipient = (data: { fullName: string; bankName: string; accountNumber: string; swiftBic: string; country: Country; cashPickupEnabled: boolean; nickname?: string; }) => {
    const maskedAccountNumber = `**** **** **** ${data.accountNumber.slice(-4)}`;
    
    const newRecipient: Recipient = {
      id: `rec_${Date.now()}`,
      fullName: data.fullName,
      nickname: data.nickname,
      bankName: data.bankName,
      accountNumber: maskedAccountNumber,
      country: data.country,
      deliveryOptions: {
        bankDeposit: true,
        cardDeposit: Math.random() > 0.5, // Randomize for demo
        cashPickup: data.cashPickupEnabled,
      },
      realDetails: {
        accountNumber: data.accountNumber,
        swiftBic: data.swiftBic,
      }
    };
    setRecipients(prev => [...prev, newRecipient]);
    addNotification(
        NotificationType.SECURITY,
        'New Recipient Added',
        `"${newRecipient.fullName}" was added to your recipients list.`,
        'recipients'
    );

    const { subject, body } = generateNewRecipientEmail(USER_NAME, newRecipient.fullName);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateNewRecipientSms(newRecipient.fullName));
  };
  
  const handleUpdateRecipientNickname = (recipientId: string, nickname: string) => {
    setRecipients(prev =>
      prev.map(r => (r.id === recipientId ? { ...r, nickname } : r))
    );
     addNotification(
        NotificationType.SECURITY,
        'Recipient Updated',
        `A nickname was updated for one of your recipients.`,
        'recipients'
    );
  };
  
  const handleUpdateAccountNickname = (accountId: string, nickname: string) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(acc =>
        acc.id === accountId ? { ...acc, nickname } : acc
      )
    );
    addNotification(
      NotificationType.SECURITY,
      'Account Nickname Updated',
      `Your account nickname has been successfully updated.`,
      'accounts'
    );
  };

  const addLoanApplication = (appData: Omit<LoanApplication, 'id' | 'status' | 'submittedDate'>) => {
      const newApplication: LoanApplication = {
          ...appData,
          id: `loan_${Date.now()}`,
          status: LoanApplicationStatus.PENDING,
          submittedDate: new Date(),
      };
      setLoanApplications(prev => [newApplication, ...prev]);
      
      // Simulate review process
      setTimeout(() => {
          setLoanApplications(prev => prev.map(app => {
              if (app.id === newApplication.id) {
                  const isApproved = Math.random() > 0.3; // 70% chance of approval
                  const newStatus = isApproved ? LoanApplicationStatus.APPROVED : LoanApplicationStatus.REJECTED;
                  addNotification(
                      NotificationType.LOAN,
                      `Loan Application ${newStatus}`,
                      `Your application for a ${app.loanProduct.name} of ${app.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been ${newStatus.toLowerCase()}.`,
                      'loans'
                  );
                  if (newStatus === LoanApplicationStatus.APPROVED) {
                    // Find checking account to deposit funds
                    setAccounts(prevAccounts => prevAccounts.map(acc => {
                        if (acc.type === 'Global Checking') {
                            return { ...acc, balance: acc.balance + app.amount };
                        }
                        return acc;
                    }));
                    addNotification(
                        NotificationType.TRANSACTION,
                        'Funds Disbursed',
                        `${app.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been disbursed to your account.`,
                        'accounts'
                    );
                  }
                  return { ...app, status: newStatus };
              }
              return app;
          }));
      }, 5000); // 5 second review
  };

  const createTransaction = (txData: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>): Transaction | null => {
    const now = new Date();
    const totalCost = txData.sendAmount + txData.fee;
    
    const sourceAccount = accounts.find(acc => acc.id === txData.accountId);
    if (!sourceAccount || sourceAccount.balance < totalCost) {
        addNotification(NotificationType.TRANSACTION, 'Transaction Failed', 'Insufficient funds for this transfer.', 'send');
        return null;
    }

    // --- Limit Checking ---
    const today = new Date();
    today.setHours(0,0,0,0);
    const dailyTx = transactions.filter(t => t.statusTimestamps[TransactionStatus.SUBMITTED].getTime() >= today.getTime());
    if (dailyTx.length >= transferLimits.daily.count) {
      addNotification(NotificationType.TRANSACTION, 'Transaction Failed', 'You have exceeded your daily transaction limit.', 'security');
      return null;
    }

    const newTransaction: Transaction = {
      ...txData,
      id: `txn_${now.getTime()}`,
      status: TransactionStatus.SUBMITTED,
      estimatedArrival: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      requiresAuth: true,
      statusTimestamps: {
        [TransactionStatus.SUBMITTED]: now,
      },
      description: `Transfer to ${txData.recipient.fullName}`,
      type: 'debit',
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAccounts(prevAccounts => prevAccounts.map(acc => 
        acc.id === txData.accountId ? { ...acc, balance: acc.balance - totalCost } : acc
    ));
    addNotification(
        NotificationType.TRANSACTION,
        'Transfer Submitted',
        `Your transfer of ${txData.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${txData.recipient.fullName} has been submitted.`,
        'history'
    );

    const { subject, body } = generateTransactionReceiptEmail(newTransaction, USER_NAME);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateTransactionReceiptSms(newTransaction));


    return newTransaction;
  };
  
  const addFunds = (amount: number, cardLastFour: string, cardNetwork: 'Visa' | 'Mastercard') => {
    const now = new Date();
    const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');
    if (!checkingAccount) return;
    
    const newDeposit: Transaction = {
      id: `txn_${now.getTime()}`,
      accountId: checkingAccount.id,
      recipient: SELF_RECIPIENT,
      sendAmount: amount,
      receiveAmount: amount,
      fee: 0,
      exchangeRate: 1,
      status: TransactionStatus.FUNDS_ARRIVED,
      estimatedArrival: now,
      statusTimestamps: {
        [TransactionStatus.SUBMITTED]: now,
        [TransactionStatus.FUNDS_ARRIVED]: now,
      },
      description: `Deposit from ${cardNetwork} **** ${cardLastFour}`,
      type: 'credit',
      purpose: 'Account Deposit',
    };

    setTransactions(prev => [newDeposit, ...prev]);
    setAccounts(prevAccounts => prevAccounts.map(acc => 
        acc.id === checkingAccount.id ? { ...acc, balance: acc.balance + amount } : acc
    ));
    addNotification(
        NotificationType.TRANSACTION,
        'Funds Added',
        `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been added to your account.`,
        'accounts'
    );

    const { subject, body } = generateDepositConfirmationEmail(USER_NAME, amount, cardLastFour);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateDepositConfirmationSms(amount, cardLastFour));
  };

  const addCard = (cardData: Omit<Card, 'id' | 'isFrozen'>) => {
    const newCard: Card = {
        ...cardData,
        id: `card_${Date.now()}`,
        isFrozen: false,
    };
    setCards(prev => [...prev, newCard]);
    addNotification(
        NotificationType.CARD,
        'New Card Added',
        `A new ${cardData.network} card ending in ${cardData.lastFour} has been added to your account.`,
        'cards'
    );
  };

  const handleToggleFreeze = (cardId: string) => {
    let updatedCard: Card | undefined;
    setCards(prev => prev.map(c => {
        if (c.id === cardId) {
            updatedCard = { ...c, isFrozen: !c.isFrozen };
            return updatedCard;
        }
        return c;
    }));

    if (updatedCard) {
        const isNowFrozen = updatedCard.isFrozen;
        addNotification(
            NotificationType.CARD,
            isNowFrozen ? 'Card Frozen' : 'Card Unfrozen',
            `Your ${updatedCard.network} card ending in ${updatedCard.lastFour} has been ${isNowFrozen ? 'frozen' : 'unfrozen'}.`,
            'cards'
        );

        const { subject, body } = generateCardStatusEmail(USER_NAME, isNowFrozen, updatedCard.lastFour);
        sendTransactionalEmail(USER_EMAIL, subject, body);
    }
  };
  
  const handlePaySubscription = (subscriptionId: string) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');

    if (!sub || !checkingAccount || checkingAccount.balance < sub.amount) {
      addNotification(NotificationType.SUBSCRIPTION, 'Payment Failed', `Insufficient funds to pay for ${sub?.provider}.`, 'accounts');
      return false;
    }

    // Deduct from account
    setAccounts(prev => prev.map(acc => 
      acc.id === checkingAccount.id ? { ...acc, balance: acc.balance - sub.amount } : acc
    ));

    // Create a transaction record
    const now = new Date();
    const newTransaction: Transaction = {
      id: `txn_sub_${now.getTime()}`,
      accountId: checkingAccount.id,
      recipient: { ...SELF_RECIPIENT, fullName: sub.provider, bankName: 'Bill Payment' },
      sendAmount: sub.amount,
      receiveAmount: sub.amount,
      fee: 0,
      exchangeRate: 1,
      status: TransactionStatus.FUNDS_ARRIVED,
      estimatedArrival: now,
      statusTimestamps: { [TransactionStatus.SUBMITTED]: now, [TransactionStatus.FUNDS_ARRIVED]: now },
      description: `Payment for ${sub.provider} - ${sub.plan}`,
      type: 'debit',
      purpose: 'Bill Payment',
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Mark subscription as paid
    setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, isPaid: true } : s));

    addNotification(NotificationType.SUBSCRIPTION, 'Payment Successful', `Your payment of ${sub.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${sub.provider} was successful.`, 'services');
    return true;
  };

  const handleAuthorizeTransaction = (transactionId: string) => {
    let authorizedTx: Transaction | undefined;

    setTransactions(prev => prev.map(tx => {
        if (tx.id === transactionId && tx.status === TransactionStatus.IN_TRANSIT) {
            authorizedTx = {
                ...tx,
                status: TransactionStatus.FUNDS_ARRIVED,
                statusTimestamps: {
                    ...tx.statusTimestamps,
                    [TransactionStatus.FUNDS_ARRIVED]: new Date(),
                },
                requiresAuth: false, // Mark as completed
            };
            return authorizedTx;
        }
        return tx;
    }));

    if (authorizedTx) {
        addNotification(
            NotificationType.TRANSACTION,
            'Funds Arrived!',
            `Your transfer to ${authorizedTx.recipient.fullName} has been successfully delivered.`,
            'history'
        );
        const { subject, body } = generateFundsArrivedEmail(authorizedTx, USER_NAME);
        sendTransactionalEmail(USER_EMAIL, subject, body);
    }
  };

  const updateTransactionStatuses = useCallback(() => {
    const newNotifications: Notification[] = [];
    
    setTransactions(currentTransactions => {
      let hasChanged = false;
      const updatedTransactions = currentTransactions.map(tx => {
        if (tx.status === TransactionStatus.FUNDS_ARRIVED) return tx;

        let newStatus: TransactionStatus = tx.status;
        let newTimestamps = { ...tx.statusTimestamps };

        const now = new Date();
        const submittedTime = tx.statusTimestamps[TransactionStatus.SUBMITTED].getTime();
        const timeDiffSeconds = (now.getTime() - submittedTime) / 1000;

        if (tx.status === TransactionStatus.SUBMITTED && timeDiffSeconds > 5 && !tx.statusTimestamps[TransactionStatus.CONVERTING]) {
          newStatus = TransactionStatus.CONVERTING;
          newTimestamps[TransactionStatus.CONVERTING] = now;
          hasChanged = true;
        }

        if (tx.status === TransactionStatus.CONVERTING && timeDiffSeconds > 15 && !tx.statusTimestamps[TransactionStatus.IN_TRANSIT]) {
          newStatus = TransactionStatus.IN_TRANSIT;
          newTimestamps[TransactionStatus.IN_TRANSIT] = now;
          hasChanged = true;

          if (tx.requiresAuth) {
            newNotifications.push({
              id: `notif_auth_${tx.id}`,
              type: NotificationType.SECURITY,
              title: 'Action Required: Authorize Transfer',
              message: `Your transfer to ${tx.recipient.fullName} requires an authorization code to proceed.`,
              timestamp: now,
              read: false,
              linkTo: 'send'
            });
            return { ...tx, status: newStatus, statusTimestamps: newTimestamps };
          }
        }
        
        const arrivalTime = tx.estimatedArrival.getTime();
        if (tx.status === TransactionStatus.IN_TRANSIT && !tx.requiresAuth && now.getTime() >= arrivalTime && !tx.statusTimestamps[TransactionStatus.FUNDS_ARRIVED]) {
            newStatus = TransactionStatus.FUNDS_ARRIVED;
            newTimestamps[TransactionStatus.FUNDS_ARRIVED] = now;
            hasChanged = true;
            newNotifications.push({
                id: `notif_arrival_${tx.id}`,
                type: NotificationType.TRANSACTION,
                title: 'Funds Arrived!',
                message: `Your transfer to ${tx.recipient.fullName} has been successfully delivered.`,
                timestamp: now,
                read: false,
                linkTo: 'history'
            });

            const { subject, body } = generateFundsArrivedEmail(tx, USER_NAME);
            sendTransactionalEmail(USER_EMAIL, subject, body);
        }

        return { ...tx, status: newStatus, statusTimestamps: newTimestamps };
      });

      if (hasChanged) {
        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev.filter(p => !newNotifications.find(n => n.id === p.id))]);
        }
        return updatedTransactions;
      }
      return currentTransactions;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTransactionStatuses();
    }, 2000);

    return () => clearInterval(interval);
  }, [updateTransactionStatuses]);

  const handleUpdateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
      setSecuritySettings(prev => ({ ...prev, ...newSettings }));
      const [key, value] = Object.entries(newSettings)[0];
      const settingName = key === 'mfaEnabled' ? '2FA' : 'Biometrics';
      addNotification(
          NotificationType.SECURITY,
          `Security Setting Updated`,
          `${settingName} has been ${value ? 'enabled' : 'disabled'}.`,
          'security'
      );
  };
  
  const handleRevokeDevice = (deviceId: string) => {
    setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
    addNotification(
        NotificationType.SECURITY,
        'Device Access Revoked',
        `Access for a trusted device has been revoked.`,
        'security'
    );
  };
  
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEME_COLORS[platformSettings.theme];
    for (const [key, value] of Object.entries(theme)) {
      // FIX: Cast `value` to string to resolve 'Argument of type 'unknown' is not assignable to parameter of type 'string'' error.
      // This is necessary due to a strict TypeScript configuration for Object.entries.
      root.style.setProperty(`--color-primary-${key}`, value as string);
    }
  }, [platformSettings.theme]);
  
  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    setShowInactivityModal(false);
    inactivityTimerRef.current = window.setTimeout(() => {
      setShowInactivityModal(true);
    }, INACTIVITY_WARNING_TIMEOUT);
  }, []);

  useEffect(() => {
    if (authStatus === 'loggedIn') {
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();

      return () => {
        events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        clearTimeout(inactivityTimerRef.current);
      };
    }
  }, [authStatus, resetInactivityTimer]);

  const handleStayLoggedIn = () => {
    setShowInactivityModal(false);
    resetInactivityTimer();
  };
  
  const cryptoPortfolioValue = useMemo(() => {
    return cryptoHoldings.reduce((total, holding) => {
      const asset = cryptoAssets.find(a => a.id === holding.assetId);
      return total + (asset ? holding.amount * asset.price : 0);
    }, 0);
  }, [cryptoHoldings, cryptoAssets]);

  const handleBuyCrypto = (assetId: string, usdAmount: number, assetPrice: number): boolean => {
    const checking = accounts.find(a => a.type === 'Global Checking');
    if (!checking || checking.balance < usdAmount) {
        addNotification(NotificationType.CRYPTO, 'Trade Failed', 'Insufficient funds in your checking account.', 'crypto');
        return false;
    }
    
    setAccounts(prev => prev.map(acc => acc.id === checking.id ? { ...acc, balance: acc.balance - usdAmount } : acc));
    
    const cryptoAmount = usdAmount / assetPrice;
    setCryptoHoldings(prev => {
        const existingHolding = prev.find(h => h.assetId === assetId);
        if (existingHolding) {
            const totalAmount = existingHolding.amount + cryptoAmount;
            const totalCost = (existingHolding.avgBuyPrice * existingHolding.amount) + usdAmount;
            const newAvgPrice = totalCost / totalAmount;
            return prev.map(h => h.assetId === assetId ? { ...h, amount: totalAmount, avgBuyPrice: newAvgPrice } : h);
        } else {
            return [...prev, { assetId, amount: cryptoAmount, avgBuyPrice: assetPrice }];
        }
    });

    addNotification(NotificationType.CRYPTO, 'Trade Successful', `You purchased ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()}.`, 'crypto');
    return true;
  };
  
  const handleSellCrypto = (assetId: string, cryptoAmount: number, assetPrice: number): boolean => {
    const holding = cryptoHoldings.find(h => h.assetId === assetId);
    if (!holding || holding.amount < cryptoAmount) {
        addNotification(NotificationType.CRYPTO, 'Trade Failed', 'Insufficient asset balance.', 'crypto');
        return false;
    }
    
    const usdAmount = cryptoAmount * assetPrice;
    const checking = accounts.find(a => a.type === 'Global Checking');
    if (!checking) return false;
    setAccounts(prev => prev.map(acc => acc.id === checking.id ? { ...acc, balance: acc.balance + usdAmount } : acc));

    setCryptoHoldings(prev => prev.map(h => h.assetId === assetId ? { ...h, amount: h.amount - cryptoAmount } : h).filter(h => h.amount > 0.000001));

    addNotification(NotificationType.CRYPTO, 'Trade Successful', `You sold ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()} for ${usdAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`, 'crypto');
    return true;
  };

  const handleUpdateSpendingLimits = (newLimits: SpendingLimit[]) => {
      setAppleCardDetails(prev => ({...prev, spendingLimits: newLimits}));
      addNotification(NotificationType.CARD, 'Spending Limits Updated', 'Your Apple Card spending limits have been successfully updated.', 'services');
  };
  
  const handleUpdateTransactionCategory = (transactionId: string, newCategory: SpendingCategory) => {
    setAppleCardTransactions(prev => prev.map(tx => tx.id === transactionId ? { ...tx, category: newCategory } : tx));
  };
  
  const handleAddTravelPlan = (country: Country, startDate: Date, endDate: Date) => {
      const newPlan: TravelPlan = {
          id: `travel_${Date.now()}`,
          country,
          startDate,
          endDate,
          status: TravelPlanStatus.UPCOMING
      };
      setTravelPlans(prev => [...prev, newPlan]);
      addNotification(NotificationType.TRAVEL, 'Travel Plan Added', `Your trip to ${country.name} has been registered.`, 'checkin');
  };
  
  const handleAddTask = (text: string, dueDate?: Date) => {
    const newTask: Task = { id: `task_${Date.now()}`, text, completed: false, dueDate };
    setTasks(prev => [newTask, ...prev]);
  };
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const handleBookFlight = (booking: Omit<FlightBooking, 'id' | 'bookingDate' | 'status'>, sourceAccountId: string): boolean => {
      const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
      if (!sourceAccount || sourceAccount.balance < booking.totalPrice) {
          addNotification(NotificationType.TRAVEL, 'Booking Failed', 'Insufficient funds to book this flight.', 'flights');
          return false;
      }
      setAccounts(prev => prev.map(acc => acc.id === sourceAccountId ? { ...acc, balance: acc.balance - booking.totalPrice } : acc));
      
      const newBooking: FlightBooking = {
          ...booking,
          id: `book_${Date.now()}`,
          bookingDate: new Date(),
          status: 'Confirmed'
      };
      setFlightBookings(prev => [...prev, newBooking]);
      addNotification(NotificationType.TRAVEL, 'Flight Booked!', `Your flight to ${booking.flight.to.city} is confirmed.`, 'flights');
      return true;
  };
  
  const handlePayUtilityBill = (billId: string, sourceAccountId: string): boolean => {
      const bill = utilityBills.find(b => b.id === billId);
      const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
      
      if (!bill || !sourceAccount || sourceAccount.balance < bill.amount) {
          addNotification(NotificationType.TRANSACTION, 'Payment Failed', 'Insufficient funds to pay this bill.', 'utilities');
          return false;
      }
      
      setAccounts(prev => prev.map(acc => acc.id === sourceAccountId ? { ...acc, balance: acc.balance - bill.amount } : acc));
      
      setUtilityBills(prev => prev.map(b => b.id === billId ? { ...b, isPaid: true } : b));
      
      const biller = utilityBillers.find(b => b.id === bill.billerId);
      addNotification(NotificationType.TRANSACTION, 'Bill Paid', `Your payment to ${biller?.name} was successful.`, 'utilities');
      return true;
  };

  const renderContent = () => {
    switch (authStatus) {
      case 'initializing':
        return <OpeningSequence onComplete={() => setAuthStatus('loggedIn')} />;
      case 'intro':
        return <IntroSequence onComplete={() => setAuthStatus('loggedOut')} />;
      case 'loggedOut':
        return <Welcome onLogin={handleCredentialsSuccess} />;
      case 'profileSignIn':
        return <ProfileSignIn user={USER_PROFILE} onEnterDashboard={handleEnterDashboard} />;
      case 'loggedIn':
        const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');
        const currentBalance = checkingAccount ? checkingAccount.balance : 0;
        
        let viewComponent;
        switch (activeView) {
          case 'dashboard':
            viewComponent = <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} travelPlans={travelPlans} />;
            break;
          case 'send':
            viewComponent = <SendMoneyFlow recipients={recipients} accounts={accounts} createTransaction={createTransaction} transactions={transactions} securitySettings={securitySettings} hapticsEnabled={platformSettings.hapticsEnabled} onAuthorizeTransaction={handleAuthorizeTransaction} />;
            break;
          case 'recipients':
            viewComponent = <Recipients recipients={recipients} addRecipient={addRecipient} />;
            break;
          case 'history':
            viewComponent = <ActivityLog transactions={transactions} />;
            break;
          case 'security':
            viewComponent = <Security transferLimits={transferLimits} onUpdateLimits={setTransferLimits} verificationLevel={verificationLevel} onVerificationComplete={setVerificationLevel} securitySettings={securitySettings} onUpdateSecuritySettings={handleUpdateSecuritySettings} trustedDevices={trustedDevices} onRevokeDevice={handleRevokeDevice} />;
            break;
          case 'cards':
            viewComponent = <CardManagement cards={cards} transactions={INITIAL_CARD_TRANSACTIONS} onToggleFreeze={handleToggleFreeze} onAddCard={addCard} accountBalance={currentBalance} onAddFunds={addFunds} />;
            break;
          case 'insurance':
            viewComponent = <Insurance />;
            break;
          case 'loans':
            viewComponent = <Loans loanApplications={loanApplications} addLoanApplication={addLoanApplication} addNotification={addNotification} />;
            break;
          case 'support':
            viewComponent = <Support />;
            break;
          case 'accounts':
            viewComponent = <Accounts accounts={accounts} transactions={transactions} verificationLevel={verificationLevel} onUpdateAccountNickname={handleUpdateAccountNickname} />;
            break;
          case 'crypto':
            viewComponent = <CryptoDashboard cryptoAssets={cryptoAssets} setCryptoAssets={setCryptoAssets} holdings={cryptoHoldings} checkingAccount={checkingAccount} onBuy={handleBuyCrypto} onSell={handleSellCrypto} />;
            break;
          case 'services':
            viewComponent = <ServicesDashboard subscriptions={subscriptions} onPaySubscription={handlePaySubscription} appleCardDetails={appleCardDetails} appleCardTransactions={appleCardTransactions} onUpdateSpendingLimits={handleUpdateSpendingLimits} onUpdateTransactionCategory={handleUpdateTransactionCategory} />;
            break;
          case 'checkin':
            viewComponent = <TravelCheckIn travelPlans={travelPlans} addTravelPlan={handleAddTravelPlan} />;
            break;
          case 'platform':
            viewComponent = <PlatformFeatures settings={platformSettings} onUpdateSettings={setPlatformSettings} />;
            break;
          case 'tasks':
            viewComponent = <Tasks tasks={tasks} addTask={handleAddTask} toggleTask={handleToggleTask} deleteTask={handleDeleteTask} />;
            break;
          case 'flights':
            viewComponent = <Flights bookings={flightBookings} onBookFlight={handleBookFlight} accounts={accounts} setActiveView={setActiveView} />;
            break;
          case 'utilities':
            viewComponent = <Utilities bills={utilityBills} billers={utilityBillers} onPayBill={handlePayUtilityBill} accounts={accounts} setActiveView={setActiveView} />;
            break;
          default:
            viewComponent = <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} travelPlans={travelPlans} />;
        }
        return (
          <div className="min-h-screen bg-slate-200">
            <Header activeView={activeView} setActiveView={setActiveView} onLogout={handleInitiateLogout} notifications={notifications} onMarkNotificationsAsRead={markNotificationsAsRead} onNotificationClick={setActiveView} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {viewComponent}
            </main>
            <DynamicIslandSimulator transaction={transactions.find(t => t.status !== TransactionStatus.FUNDS_ARRIVED) || null} />
            <BankingChat />
          </div>
        );
      default:
        return null;
    }
  };
  
  if (isLoggingOut) {
    return <LoggingOut onComplete={handleFinalizeLogout} />;
  }

  return (
    <>
      {renderContent()}
      {isLogoutModalOpen && <LogoutConfirmationModal onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />}
      {showInactivityModal && <InactivityModal onStayLoggedIn={handleStayLoggedIn} onLogout={handleConfirmLogout} countdownStart={INACTIVITY_MODAL_COUNTDOWN} />}
    </>
  );
}

export default App;
