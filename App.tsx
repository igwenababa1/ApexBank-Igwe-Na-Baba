import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { Recipients } from './components/Recipients';
import { Transaction, Recipient, TransactionStatus, Card, Notification, NotificationType, TransferLimits, Country, InsuranceProduct, LoanApplication, LoanApplicationStatus, Account, VerificationLevel, CryptoHolding, CryptoAsset, SubscriptionService, AppleCardDetails, AppleCardTransaction, SpendingLimit, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile, PlatformSettings, PlatformTheme, View } from './types';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_CARD_TRANSACTIONS, INITIAL_TRANSFER_LIMITS, SELF_RECIPIENT, INITIAL_ACCOUNTS, INITIAL_CRYPTO_HOLDINGS, INITIAL_CRYPTO_ASSETS, CRYPTO_TRADE_FEE_PERCENT, INITIAL_SUBSCRIPTIONS, INITIAL_APPLE_CARD_DETAILS, INITIAL_APPLE_CARD_TRANSACTIONS, INITIAL_TRAVEL_PLANS, INITIAL_SECURITY_SETTINGS, INITIAL_TRUSTED_DEVICES, USER_PROFILE, INITIAL_PLATFORM_SETTINGS, THEME_COLORS } from './constants';
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


type AuthStatus = 'loggedOut' | 'profileSignIn' | 'loggedIn';

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const inactivityTimerRef = React.useRef<number>();
  
  const handleCredentialsSuccess = (isNewAccount = false) => {
    setIsNewAccountLogin(isNewAccount);
    setAuthStatus('profileSignIn');
  };

  const handleEnterDashboard = () => {
    setAuthStatus('loggedIn');
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
  };
  
  const handleInitiateLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    setShowInactivityModal(false);
    setIsLogoutModalOpen(false);
    setAuthStatus('loggedOut');
    setActiveView('dashboard');
    setNotifications([]); // Clear notifications on logout
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
    const dailyTx = transactions.filter(t => t.statusTimestamps.Submitted.getTime() >= today.getTime());
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

        let newStatus = tx.status;
        let newTimestamps = { ...tx.statusTimestamps };

        const now = new Date();
        const submittedTime = tx.statusTimestamps[TransactionStatus.SUBMITTED].getTime();
        const timeDiffSeconds = (now.getTime() - submittedTime) / 1000;

        // Progress from SUBMITTED -> CONVERTING after a few seconds
        if (tx.status === TransactionStatus.SUBMITTED && timeDiffSeconds > 5 && !tx.statusTimestamps[TransactionStatus.CONVERTING]) {
          newStatus = TransactionStatus.CONVERTING;
          newTimestamps[TransactionStatus.CONVERTING] = now;
          hasChanged = true;
        }

        // Progress from CONVERTING -> IN_TRANSIT
        if (tx.status === TransactionStatus.CONVERTING && timeDiffSeconds > 15 && !tx.statusTimestamps[TransactionStatus.IN_TRANSIT]) {
          newStatus = TransactionStatus.IN_TRANSIT;
          newTimestamps[TransactionStatus.IN_TRANSIT] = now;
          hasChanged = true;
        }

        // Progress from IN_TRANSIT -> FUNDS_ARRIVED (simulates a longer delay)
        if (tx.status === TransactionStatus.IN_TRANSIT && now.getTime() >= tx.estimatedArrival.getTime() && !tx.requiresAuth) {
          newStatus = TransactionStatus.FUNDS_ARRIVED;
          newTimestamps[TransactionStatus.FUNDS_ARRIVED] = now;
          hasChanged = true;
          // Create notification for funds arrival
          newNotifications.push({
            id: `notif_${tx.id}_arrival`,
            type: NotificationType.TRANSACTION,
            title: 'Funds Arrived!',
            message: `Your transfer to ${tx.recipient.fullName} has been successfully delivered.`,
            timestamp: new Date(),
            read: false,
            linkTo: 'history',
          });

          // Send email for funds arrival
          const { subject, body } = generateFundsArrivedEmail(tx, USER_NAME);
          sendTransactionalEmail(USER_EMAIL, subject, body);
        }

        return { ...tx, status: newStatus, statusTimestamps: newTimestamps };
      });

      if (hasChanged) {
        // Add new notifications if any were created
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev.filter(n => !newNotifications.some(nn => nn.id === n.id))]);
        }
        return updatedTransactions;
      }
      return currentTransactions;
    });
  }, [USER_NAME]);

  useEffect(() => {
    const interval = setInterval(updateTransactionStatuses, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [updateTransactionStatuses]);
  
  const cryptoPortfolioValue = cryptoHoldings.reduce((total, holding) => {
    const asset = cryptoAssets.find(a => a.id === holding.assetId);
    return total + (asset ? holding.amount * asset.price : 0);
  }, 0);

  const onBuyCrypto = (assetId: string, usdAmount: number, assetPrice: number): boolean => {
    const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');
    if (!checkingAccount || checkingAccount.balance < usdAmount) {
      addNotification(NotificationType.CRYPTO, 'Trade Failed', 'Insufficient funds in your checking account.', 'accounts');
      return false;
    }

    const fee = usdAmount * CRYPTO_TRADE_FEE_PERCENT;
    const usdSpent = usdAmount + fee;
    const cryptoReceived = usdAmount / assetPrice;

    // Deduct from checking
    setAccounts(prev => prev.map(acc => acc.id === checkingAccount.id ? { ...acc, balance: acc.balance - usdSpent } : acc));

    // Update holdings
    setCryptoHoldings(prev => {
      const existing = prev.find(h => h.assetId === assetId);
      if (existing) {
        // Update avg buy price
        const newTotalAmount = existing.amount + cryptoReceived;
        const newAvgPrice = ((existing.avgBuyPrice * existing.amount) + (assetPrice * cryptoReceived)) / newTotalAmount;
        return prev.map(h => h.assetId === assetId ? { ...h, amount: newTotalAmount, avgBuyPrice: newAvgPrice } : h);
      } else {
        return [...prev, { assetId, amount: cryptoReceived, avgBuyPrice: assetPrice }];
      }
    });

    addNotification(NotificationType.CRYPTO, 'Trade Executed', `Successfully bought ${cryptoReceived.toFixed(6)} ${assetId.toUpperCase()}.`, 'crypto');
    return true;
  };
  
  const onSellCrypto = (assetId: string, cryptoAmount: number, assetPrice: number): boolean => {
    const holding = cryptoHoldings.find(h => h.assetId === assetId);
    if (!holding || holding.amount < cryptoAmount) {
      addNotification(NotificationType.CRYPTO, 'Trade Failed', 'Insufficient crypto balance.', 'crypto');
      return false;
    }

    const usdReceived = cryptoAmount * assetPrice;
    const fee = usdReceived * CRYPTO_TRADE_FEE_PERCENT;
    const usdCredited = usdReceived - fee;
    
    // Add to checking account
    setAccounts(prev => prev.map(acc => acc.type === 'Global Checking' ? { ...acc, balance: acc.balance + usdCredited } : acc));

    // Update holdings
    setCryptoHoldings(prev => prev.map(h => h.assetId === assetId ? { ...h, amount: h.amount - cryptoAmount } : h).filter(h => h.amount > 0.000001));

    addNotification(NotificationType.CRYPTO, 'Trade Executed', `Successfully sold ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()}.`, 'crypto');
    return true;
  };

  const addTravelPlan = (country: Country, startDate: Date, endDate: Date) => {
    const newPlan: TravelPlan = {
      id: `travel_${Date.now()}`,
      country,
      startDate,
      endDate,
      status: new Date() >= startDate && new Date() <= endDate ? TravelPlanStatus.ACTIVE : (new Date() < startDate ? TravelPlanStatus.UPCOMING : TravelPlanStatus.COMPLETED)
    };
    setTravelPlans(prev => [...prev, newPlan].sort((a,b) => a.startDate.getTime() - b.startDate.getTime()));
    addNotification(NotificationType.TRAVEL, "Travel Plan Added", `Your trip to ${country.name} has been successfully registered.`, 'checkin');
  };

  const handleUpdateTheme = (theme: PlatformTheme) => {
    setPlatformSettings(prev => ({...prev, theme}));
    const root = document.documentElement;
    const colors = THEME_COLORS[theme];
    for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(`--color-primary-${key}`, value);
    }
  };

  const handleUpdateSpendingLimits = (limits: SpendingLimit[]) => {
    setAppleCardDetails(prev => ({...prev, spendingLimits: limits}));
    addNotification(NotificationType.CARD, 'Spending Limits Updated', 'Your Apple Card spending limits have been successfully updated.', 'services');
  };
  
  const handleUpdateTransactionCategory = (transactionId: string, category: SpendingCategory) => {
    setAppleCardTransactions(prev => prev.map(tx => tx.id === transactionId ? {...tx, category} : tx));
  };
  
  const inProgressTransaction = transactions.find(tx => tx.status !== TransactionStatus.FUNDS_ARRIVED);

  const handleNotificationClick = (view: View) => {
    setActiveView(view);
  };


  useEffect(() => {
    handleUpdateTheme(platformSettings.theme);
  }, [platformSettings.theme]);
  
  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    setShowInactivityModal(false);
    if (authStatus === 'loggedIn') {
      inactivityTimerRef.current = window.setTimeout(() => {
        setShowInactivityModal(true);
      }, INACTIVITY_WARNING_TIMEOUT);
    }
  }, [authStatus]);

  useEffect(() => {
    resetInactivityTimer();
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    return () => {
      clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
    };
  }, [resetInactivityTimer]);
  

  const renderContent = () => {
    switch (authStatus) {
      case 'loggedOut':
        return <Welcome onLogin={handleCredentialsSuccess} />;
      case 'profileSignIn':
        return <ProfileSignIn user={USER_PROFILE} onEnterDashboard={handleEnterDashboard} />;
      case 'loggedIn':
        const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');
        let viewContent;
        switch (activeView) {
          case 'dashboard':
            viewContent = <Dashboard 
              accounts={accounts} 
              transactions={transactions} 
              setActiveView={setActiveView}
              recipients={recipients}
              createTransaction={createTransaction}
              cryptoPortfolioValue={cryptoPortfolioValue}
              travelPlans={travelPlans}
            />;
            break;
          case 'send':
            viewContent = <SendMoneyFlow
              recipients={recipients} 
              accounts={accounts} 
              createTransaction={createTransaction}
              transactions={transactions}
              securitySettings={securitySettings}
              hapticsEnabled={platformSettings.hapticsEnabled}
              onAuthorizeTransaction={handleAuthorizeTransaction}
            />;
            break;
          case 'recipients':
            viewContent = <Recipients recipients={recipients} addRecipient={addRecipient} />;
            break;
          case 'history':
            viewContent = <ActivityLog transactions={transactions} />;
            break;
          case 'security':
            viewContent = <Security 
              transferLimits={transferLimits} 
              onUpdateLimits={setTransferLimits} 
              verificationLevel={verificationLevel}
              onVerificationComplete={setVerificationLevel}
              securitySettings={securitySettings}
              onUpdateSecuritySettings={(s) => setSecuritySettings(prev => ({...prev, ...s}))}
              trustedDevices={trustedDevices}
              onRevokeDevice={(id) => setTrustedDevices(prev => prev.filter(d => d.id !== id))}
            />;
            break;
          case 'cards':
            viewContent = <CardManagement
                cards={cards}
                transactions={INITIAL_CARD_TRANSACTIONS}
                onToggleFreeze={handleToggleFreeze}
                onAddCard={addCard}
                accountBalance={checkingAccount?.balance || 0}
                onAddFunds={addFunds}
            />;
            break;
          case 'insurance':
            viewContent = <Insurance />;
            break;
          case 'loans':
            viewContent = <Loans loanApplications={loanApplications} addLoanApplication={addLoanApplication} addNotification={addNotification} />;
            break;
          case 'support':
            viewContent = <Support />;
            break;
          case 'accounts':
            viewContent = <Accounts 
              accounts={accounts} 
              transactions={transactions} 
              verificationLevel={verificationLevel} 
              onUpdateAccountNickname={handleUpdateAccountNickname}
            />;
            break;
          case 'crypto':
            viewContent = <CryptoDashboard 
              cryptoAssets={cryptoAssets}
              setCryptoAssets={setCryptoAssets}
              holdings={cryptoHoldings}
              checkingAccount={checkingAccount}
              onBuy={onBuyCrypto}
              onSell={onSellCrypto}
            />;
            break;
          case 'services':
            viewContent = <ServicesDashboard 
              subscriptions={subscriptions}
              appleCardDetails={appleCardDetails}
              appleCardTransactions={appleCardTransactions}
              onPaySubscription={handlePaySubscription}
              onUpdateSpendingLimits={handleUpdateSpendingLimits}
              onUpdateTransactionCategory={handleUpdateTransactionCategory}
            />;
            break;
          case 'checkin':
            viewContent = <TravelCheckIn travelPlans={travelPlans} addTravelPlan={addTravelPlan} />;
            break;
          case 'platform':
            viewContent = <PlatformFeatures settings={platformSettings} onUpdateSettings={(s) => setPlatformSettings(prev => ({...prev, ...s}))} />;
            break;
          default:
            viewContent = <Dashboard 
              accounts={accounts} 
              transactions={transactions} 
              setActiveView={setActiveView}
              recipients={recipients}
              createTransaction={createTransaction}
              cryptoPortfolioValue={cryptoPortfolioValue}
              travelPlans={travelPlans}
            />;
        }

        return (
          <div className="bg-slate-300 min-h-screen">
            <Header
              activeView={activeView}
              setActiveView={setActiveView}
              onLogout={handleInitiateLogout}
              notifications={notifications}
              onMarkNotificationsAsRead={markNotificationsAsRead}
              onNotificationClick={handleNotificationClick}
            />
            <DynamicIslandSimulator transaction={inProgressTransaction || null} />
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {viewContent}
            </main>
             {isLogoutModalOpen && <LogoutConfirmationModal onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />}
             {showInactivityModal && <InactivityModal onLogout={handleConfirmLogout} onStayLoggedIn={resetInactivityTimer} countdownStart={INACTIVITY_MODAL_COUNTDOWN} />}
             <BankingChat />
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="font-sans antialiased">{renderContent()}</div>;
}

// FIX: Add default export for the App component.
export default App;