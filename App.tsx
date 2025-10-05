import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { Recipients } from './components/Recipients';
import { Transaction, Recipient, TransactionStatus, Card, Notification, NotificationType, TransferLimits, Country, InsuranceProduct, LoanApplication, LoanApplicationStatus, Account, VerificationLevel, CryptoHolding, CryptoAsset, SubscriptionService, AppleCardDetails, AppleCardTransaction, SpendingLimit, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile } from './types';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARD_DETAILS, INITIAL_CARD_TRANSACTIONS, INITIAL_TRANSFER_LIMITS, SELF_RECIPIENT, INITIAL_ACCOUNTS, INITIAL_CRYPTO_HOLDINGS, INITIAL_CRYPTO_ASSETS, CRYPTO_TRADE_FEE_PERCENT, INITIAL_SUBSCRIPTIONS, INITIAL_APPLE_CARD_DETAILS, INITIAL_APPLE_CARD_TRANSACTIONS, INITIAL_TRAVEL_PLANS, INITIAL_SECURITY_SETTINGS, INITIAL_TRUSTED_DEVICES, USER_PROFILE } from './constants';
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


type View = 'dashboard' | 'send' | 'recipients' | 'history' | 'security' | 'cards' | 'insurance' | 'loans' | 'support' | 'accounts' | 'crypto' | 'services' | 'checkin';
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
  const [cardDetails, setCardDetails] = useState<Card>(INITIAL_CARD_DETAILS);
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
            'Your account has been successfully created. We\'re glad to have you.'
        );
        const { subject, body } = generateWelcomeEmail(USER_NAME);
        sendTransactionalEmail(USER_EMAIL, subject, body);
        sendSmsNotification(USER_PHONE, generateWelcomeSms(USER_NAME));
    } else {
        addNotification(
            NotificationType.SECURITY,
            'Successful Sign In',
            'Your account was accessed from a new device. If this was not you, please contact support.'
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

  const addNotification = useCallback((type: NotificationType, title: string, message: string) => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
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
        `"${newRecipient.fullName}" was added to your recipients list.`
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
        `A nickname was updated for one of your recipients.`
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
      `Your account nickname has been successfully updated.`
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
                      `Your application for a ${app.loanProduct.name} of ${app.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been ${newStatus.toLowerCase()}.`
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
                        `${app.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been disbursed to your account.`
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
        addNotification(NotificationType.TRANSACTION, 'Transaction Failed', 'Insufficient funds for this transfer.');
        return null;
    }

    // --- Limit Checking ---
    const today = new Date();
    today.setHours(0,0,0,0);
    const dailyTx = transactions.filter(t => t.statusTimestamps.Submitted.getTime() >= today.getTime());
    if (dailyTx.length >= transferLimits.daily.count) {
      addNotification(NotificationType.TRANSACTION, 'Transaction Failed', 'You have exceeded your daily transaction limit.');
      return null;
    }

    const newTransaction: Transaction = {
      ...txData,
      id: `txn_${now.getTime()}`,
      status: TransactionStatus.SUBMITTED,
      estimatedArrival: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
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
        `Your transfer of ${txData.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${txData.recipient.fullName} has been submitted.`
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
        `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been added to your account.`
    );

    const { subject, body } = generateDepositConfirmationEmail(USER_NAME, amount, cardLastFour);
    sendTransactionalEmail(USER_EMAIL, subject, body);
    sendSmsNotification(USER_PHONE, generateDepositConfirmationSms(amount, cardLastFour));
  };


  const handleToggleFreeze = () => {
    const isNowFrozen = !cardDetails.isFrozen;
    setCardDetails(prev => ({...prev, isFrozen: isNowFrozen }));
    addNotification(
      NotificationType.CARD,
      isNowFrozen ? 'Card Frozen' : 'Card Unfrozen',
      `Your card ending in ${cardDetails.lastFour} has been ${isNowFrozen ? 'frozen' : 'unfrozen'}.`
    );

    const { subject, body } = generateCardStatusEmail(USER_NAME, isNowFrozen);
    sendTransactionalEmail(USER_EMAIL, subject, body);
  };
  
  const handlePaySubscription = (subscriptionId: string) => {
    const sub = subscriptions.find(s => s.id === subscriptionId);
    const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');

    if (!sub || !checkingAccount || checkingAccount.balance < sub.amount) {
      addNotification(NotificationType.SUBSCRIPTION, 'Payment Failed', `Insufficient funds to pay for ${sub?.provider}.`);
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

    addNotification(NotificationType.SUBSCRIPTION, 'Payment Successful', `Your payment of ${sub.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to ${sub.provider} was successful.`);
    return true;
  };

  const updateTransactionStatuses = useCallback(() => {
    const newNotifications: Notification[] = [];
    
    setTransactions(currentTransactions => {
      let hasChanged = false;
      const updatedTransactions = currentTransactions.map(tx => {
        if (tx.status === TransactionStatus.FUNDS_ARRIVED) {
          return tx;
        }

        const now = Date.now();
        let newStatus: TransactionStatus = tx.status;
        const timestamps = tx.statusTimestamps;

        switch (tx.status) {
          case TransactionStatus.SUBMITTED:
            if (now - timestamps[TransactionStatus.SUBMITTED].getTime() > 3000) {
              newStatus = TransactionStatus.CONVERTING;
            }
            break;
          case TransactionStatus.CONVERTING:
            const convertingTimestamp = timestamps[TransactionStatus.CONVERTING];
            if (convertingTimestamp && now - convertingTimestamp.getTime() > 8000) {
              newStatus = TransactionStatus.IN_TRANSIT;
            }
            break;
          case TransactionStatus.IN_TRANSIT:
            if (now >= tx.estimatedArrival.getTime()) {
              newStatus = TransactionStatus.FUNDS_ARRIVED;
            }
            break;
          default:
            break;
        }
        
        if (newStatus !== tx.status) {
          hasChanged = true;
          
          newNotifications.push({
            id: `notif_${Date.now()}_${tx.id}`,
            type: NotificationType.TRANSACTION,
            title: `Transfer Update: ${newStatus}`,
            message: `Your transfer to ${tx.recipient.fullName} is now "${newStatus}".`,
            timestamp: new Date(),
            read: false,
          });

          if (newStatus === TransactionStatus.FUNDS_ARRIVED) {
              const fullTxDetails = { ...tx, status: newStatus }; // Use updated status for email
              const { subject, body } = generateFundsArrivedEmail(fullTxDetails, USER_NAME);
              sendTransactionalEmail(USER_EMAIL, subject, body);
          }

          return { 
            ...tx, 
            status: newStatus, 
            statusTimestamps: { ...tx.statusTimestamps, [newStatus]: new Date() } 
          };
        }
        return tx;
      });
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }

      return hasChanged ? updatedTransactions : currentTransactions;
    });
  }, []);

  // --- Crypto Functions ---

  const handleBuyCrypto = (assetId: string, usdAmount: number, assetPrice: number): boolean => {
      const checkingAccount = accounts.find(acc => acc.type === 'Global Checking');
      if (!checkingAccount || checkingAccount.balance < usdAmount) {
          addNotification(NotificationType.CRYPTO, 'Purchase Failed', 'Insufficient funds in your checking account.');
          return false;
      }

      const fee = usdAmount * CRYPTO_TRADE_FEE_PERCENT;
      const usdAmountAfterFee = usdAmount - fee;
      const cryptoAmount = usdAmountAfterFee / assetPrice;

      // Update checking account balance
      setAccounts(prev => prev.map(acc => acc.id === checkingAccount.id ? { ...acc, balance: acc.balance - usdAmount } : acc));

      // Update crypto holdings
      setCryptoHoldings(prev => {
          const existingHolding = prev.find(h => h.assetId === assetId);
          if (existingHolding) {
              const totalAmount = existingHolding.amount + cryptoAmount;
              const totalCost = (existingHolding.avgBuyPrice * existingHolding.amount) + usdAmountAfterFee;
              const newAvgPrice = totalCost / totalAmount;
              return prev.map(h => h.assetId === assetId ? { ...h, amount: totalAmount, avgBuyPrice: newAvgPrice } : h);
          } else {
              return [...prev, { assetId, amount: cryptoAmount, avgBuyPrice: assetPrice }];
          }
      });
      
      addNotification(NotificationType.CRYPTO, 'Purchase Successful', `You bought ${cryptoAmount.toFixed(6)} of ${assetId.toUpperCase()}.`);
      return true;
  };

  const handleSellCrypto = (assetId: string, cryptoAmount: number, assetPrice: number): boolean => {
      const holding = cryptoHoldings.find(h => h.assetId === assetId);
      if (!holding || holding.amount < cryptoAmount) {
          addNotification(NotificationType.CRYPTO, 'Sale Failed', 'Insufficient crypto balance.');
          return false;
      }
      
      const usdAmount = cryptoAmount * assetPrice;
      const fee = usdAmount * CRYPTO_TRADE_FEE_PERCENT;
      const usdAmountAfterFee = usdAmount - fee;

      // Update checking account balance
      setAccounts(prev => prev.map(acc => acc.type === 'Global Checking' ? { ...acc, balance: acc.balance + usdAmountAfterFee } : acc));

      // Update crypto holdings
      setCryptoHoldings(prev => {
          const newAmount = holding.amount - cryptoAmount;
          if (newAmount < 0.000001) { // Remove if dust
              return prev.filter(h => h.assetId !== assetId);
          }
          return prev.map(h => h.assetId === assetId ? { ...h, amount: newAmount } : h);
      });

      addNotification(NotificationType.CRYPTO, 'Sale Successful', `You sold ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()} for ${usdAmountAfterFee.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
      return true;
  };
  
  // --- End Crypto Functions ---
  
  // --- Apple Card Functions ---
  const handleUpdateSpendingLimits = (newLimits: SpendingLimit[]) => {
      setAppleCardDetails(prev => ({
          ...prev,
          spendingLimits: newLimits
      }));
      addNotification(
          NotificationType.CARD,
          'Spending Limits Updated',
          'Your Apple Card spending limits have been successfully updated.'
      );
  };

  const handleUpdateTransactionCategory = (transactionId: string, newCategory: SpendingCategory) => {
      setAppleCardTransactions(prev => 
          prev.map(tx => tx.id === transactionId ? { ...tx, category: newCategory } : tx)
      );
  };
  // --- End Apple Card Functions ---

  // --- Travel Check-In Functions ---
  const addTravelPlan = (country: Country, startDate: Date, endDate: Date) => {
    const newPlan: TravelPlan = {
      id: `travel_${Date.now()}`,
      country,
      startDate,
      endDate,
      status: TravelPlanStatus.UPCOMING, // Will be updated by effect
    };
    setTravelPlans(prev => [...prev, newPlan].sort((a,b) => a.startDate.getTime() - b.startDate.getTime()));
    addNotification(
      NotificationType.TRAVEL,
      'Travel Plan Added',
      `Your travel notice for ${country.name} has been successfully registered.`
    );
  };
  // --- End Travel Check-In Functions ---
  
  // --- Security Functions ---
    const handleUpdateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
      setSecuritySettings(prev => ({ ...prev, ...newSettings }));
      const [key, value] = Object.entries(newSettings)[0];
      const featureName = key === 'mfaEnabled' ? 'Two-Factor Authentication' : 'Biometric Login';
       addNotification(
            NotificationType.SECURITY,
            `Security Setting Updated`,
            `${featureName} has been ${value ? 'enabled' : 'disabled'}.`
        );
    };

    const handleRevokeDevice = (deviceId: string) => {
      setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
      addNotification(
        NotificationType.SECURITY,
        'Device Access Revoked',
        `Access has been revoked for one of your trusted devices.`
      );
    };
  // --- End Security Functions ---


  useEffect(() => {
    const intervalId = setInterval(updateTransactionStatuses, 2000); // Check every 2 seconds
    return () => clearInterval(intervalId);
  }, [updateTransactionStatuses]);
  
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
    if (authStatus === 'loggedIn') {
      window.addEventListener('mousemove', resetInactivityTimer);
      window.addEventListener('keypress', resetInactivityTimer);
      resetInactivityTimer();
    }

    return () => {
      clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keypress', resetInactivityTimer);
    };
  }, [authStatus, resetInactivityTimer]);

  const renderContent = () => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const cryptoPortfolioValue = cryptoHoldings.reduce((total, holding) => {
        const asset = cryptoAssets.find(a => a.id === holding.assetId);
        return total + (asset ? asset.price * holding.amount : 0);
    }, 0);

    switch (activeView) {
      case 'dashboard':
        return <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} travelPlans={travelPlans} />;
      case 'accounts':
        return <Accounts accounts={accounts} transactions={transactions} verificationLevel={verificationLevel} onUpdateAccountNickname={handleUpdateAccountNickname} />;
      case 'send':
        return <SendMoneyFlow recipients={recipients} accounts={accounts} createTransaction={createTransaction} transactions={transactions} />;
      case 'recipients':
        return <Recipients recipients={recipients} addRecipient={addRecipient} />;
      case 'cards':
        return <CardManagement card={cardDetails} transactions={INITIAL_CARD_TRANSACTIONS} onToggleFreeze={handleToggleFreeze} accountBalance={totalBalance} onAddFunds={addFunds} />;
      case 'crypto':
        return <CryptoDashboard 
          cryptoAssets={cryptoAssets} 
          setCryptoAssets={setCryptoAssets}
          holdings={cryptoHoldings} 
          checkingAccount={accounts.find(acc => acc.type === 'Global Checking')} 
          onBuy={handleBuyCrypto} 
          onSell={handleSellCrypto}
        />;
      case 'services':
        return <ServicesDashboard 
          subscriptions={subscriptions} 
          appleCardDetails={appleCardDetails}
          appleCardTransactions={appleCardTransactions}
          onPaySubscription={handlePaySubscription}
          onUpdateSpendingLimits={handleUpdateSpendingLimits}
          onUpdateTransactionCategory={handleUpdateTransactionCategory}
        />;
      case 'checkin':
        return <TravelCheckIn travelPlans={travelPlans} addTravelPlan={addTravelPlan} />;
      case 'loans':
        return <Loans loanApplications={loanApplications} addLoanApplication={addLoanApplication} addNotification={addNotification}/>;
      case 'insurance':
        return <Insurance />;
      case 'history':
        return <ActivityLog transactions={transactions} />;
      case 'support':
          return <Support />;
      case 'security':
        return <Security 
          transferLimits={transferLimits} 
          onUpdateLimits={setTransferLimits} 
          verificationLevel={verificationLevel} 
          onVerificationComplete={setVerificationLevel}
          securitySettings={securitySettings}
          onUpdateSecuritySettings={handleUpdateSecuritySettings}
          trustedDevices={trustedDevices}
          onRevokeDevice={handleRevokeDevice}
        />;
      default:
        return <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} travelPlans={travelPlans} />;
    }
  };

  if (authStatus === 'loggedOut') {
    return <Welcome onLogin={handleCredentialsSuccess} />;
  }
  
  if (authStatus === 'profileSignIn') {
    return <ProfileSignIn user={USER_PROFILE} onEnterDashboard={handleEnterDashboard} />;
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleInitiateLogout}
        notifications={notifications}
        onMarkNotificationsAsRead={markNotificationsAsRead}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
      {showInactivityModal && (
        <InactivityModal
          onStayLoggedIn={resetInactivityTimer}
          onLogout={handleConfirmLogout}
          countdownStart={INACTIVITY_MODAL_COUNTDOWN}
        />
      )}
    </div>
  );
}

export default App;