// FIX: Import `useMemo` from React to resolve 'Cannot find name' error.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { Recipients } from './components/Recipients';
import { Transaction, Recipient, TransactionStatus, Card, Notification, NotificationType, TransferLimits, Country, LoanApplication, LoanApplicationStatus, Account, VerificationLevel, CryptoHolding, CryptoAsset, SubscriptionService, AppleCardDetails, AppleCardTransaction, SpendingLimit, SpendingCategory, TravelPlan, TravelPlanStatus, SecuritySettings, TrustedDevice, UserProfile, PlatformSettings, PlatformTheme, View, Task, FlightBooking, UtilityBill, UtilityBiller, AdvisorResponse, BalanceDisplayMode, AccountType } from './types';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_CARD_TRANSACTIONS, INITIAL_TRANSFER_LIMITS, SELF_RECIPIENT, INITIAL_ACCOUNTS, INITIAL_CRYPTO_HOLDINGS, INITIAL_CRYPTO_ASSETS, CRYPTO_TRADE_FEE_PERCENT, INITIAL_SUBSCRIPTIONS, INITIAL_APPLE_CARD_DETAILS, INITIAL_APPLE_CARD_TRANSACTIONS, INITIAL_TRAVEL_PLANS, INITIAL_SECURITY_SETTINGS, INITIAL_TRUSTED_DEVICES, USER_PROFILE, INITIAL_PLATFORM_SETTINGS, THEME_COLORS, INITIAL_TASKS, INITIAL_FLIGHT_BOOKINGS, INITIAL_UTILITY_BILLS, UTILITY_BILLERS, SUPPORTED_COUNTRIES } from './constants';
import { Welcome } from './components/Welcome';
import { ProfileSignIn } from './components/ProfileSignIn';
import { ActivityLog } from './components/ActivityLog';
import { Security } from './components/Security';
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
import { Integrations } from './components/Integrations';
import { FinancialAdvisor } from './components/FinancialAdvisor';
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
  generateDepositConfirmationSms,
  generateTaskReminderEmail,
  generateTaskReminderSms
} from './services/notificationService';
import { getFinancialAnalysis } from './services/geminiService';
import { OpeningSequence } from './components/OpeningSequence';
import { LoggingOut } from './components/LoggingOut';
import { AdvancedFirstPage } from './components/AdvancedFirstPage';
import { Insurance } from './components/Insurance';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { LoggedOut } from './components/LoggedOut';
import { Investments } from './components/Investments';
import { Footer } from './components/Footer';
import { AtmLocator } from './components/AtmLocator';


type AuthStatus = 'initializing' | 'intro' | 'loggedOut' | 'profileSignIn' | 'loggedIn' | 'locked';

const INACTIVITY_WARNING_TIMEOUT = 9 * 60 * 1000; // 9 minutes
const INACTIVITY_MODAL_COUNTDOWN = 60; // 60 seconds

const USER_EMAIL = "randy.m.chitwood@apexbank.com";
const USER_NAME = "Randy M. Chitwood";
const USER_PHONE = "+1-555-012-1234";

// FIX: Export 'App' as a named export to be consistent with other components and fix the import error in index.tsx.
export function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('intro');
  const [balanceDisplayMode, setBalanceDisplayMode] = useState<BalanceDisplayMode>('global');
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
  const [linkedServices, setLinkedServices] = useState<Record<string, string>>({});
  const [financialAnalysis, setFinancialAnalysis] = useState<AdvisorResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const inactivityTimerRef = React.useRef<number>();
  
  // FIX: Corrected the function signature to properly handle the optional `isNewAccount` parameter to avoid type mismatches.
  const handleCredentialsSuccess = (isNewAccount?: boolean) => {
    setIsNewAccountLogin(!!isNewAccount);
    setAuthStatus('profileSignIn');
  };

  const handleEnterDashboard = () => {
    setAuthStatus('initializing');
  };
  
  const handleInitiateLogout = () => {
    setIsLogoutModalOpen(true);
  };

  // FIX: Although state setters are stable, it's best practice to include them in the dependency array for useCallback.
  // FIX: Added missing dependencies to useCallback hook to resolve potential stale closures and satisfy linter rules. This is likely the cause of the reported error on line 102.
  const handleFinalizeLogout = useCallback(() => {
    setAuthStatus('locked');
    setActiveView('dashboard');
    // FIX: The `setNotifications` function was called without arguments. It is now correctly called with a functional update to clear the notifications array.
    setNotifications(() => []); // Clear notifications on logout
    setIsLoggingOut(false); // Hide logging out screen
  }, [setActiveView, setAuthStatus, setIsLoggingOut, setNotifications]);

  // FIX: Added missing dependencies to useCallback to satisfy linter rules and prevent potential stale closures.
  const handleConfirmLogout = useCallback(() => {
    clearTimeout(inactivityTimerRef.current);
    setShowInactivityModal(false);
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true); // Show logging out screen
  }, [setShowInactivityModal, setIsLogoutModalOpen, setIsLoggingOut]);

  const handleRelogin = () => {
    // This will just transition to the profile sign in, which then transitions to initializing
    setAuthStatus('profileSignIn');
  };

  // FIX: Add `setNotifications` to dependency array for consistency and to satisfy exhaustive-deps rule.
  // FIX: Added setNotifications to the dependency array to satisfy the exhaustive-deps linting rule.
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
  }, [setNotifications]);
  
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

  // Task Reminder System
  useEffect(() => {
    const checkTaskDeadlines = () => {
        const today = new Date();
        const todayString = today.toDateString();
        const taskIdsToUpdate: string[] = [];

        tasks.forEach(task => {
            if (task.dueDate && !task.completed && !task.notificationSent) {
                if (new Date(task.dueDate).toDateString() === todayString) {
                    addNotification(
                        NotificationType.TASK,
                        'Task Due Today',
                        `Your task "${task.text}" is due today.`,
                        'tasks'
                    );

                    const { subject, body } = generateTaskReminderEmail(USER_NAME, task.text, task.dueDate);
                    sendTransactionalEmail(USER_EMAIL, subject, body);
                    sendSmsNotification(USER_PHONE, generateTaskReminderSms(task.text));

                    taskIdsToUpdate.push(task.id);
                }
            }
        });

        if (taskIdsToUpdate.length > 0) {
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    taskIdsToUpdate.includes(task.id)
                        ? { ...task, notificationSent: true }
                        : task
                )
            );
        }
    };

    if(authStatus === 'loggedIn') {
      // Check once on load, then every minute
      checkTaskDeadlines();
      const intervalId = setInterval(checkTaskDeadlines, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [tasks, addNotification, authStatus]);


  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addRecipient = (data: { 
    fullName: string; 
    bankName: string; 
    accountNumber: string; 
    swiftBic: string; 
    country: Country; 
    cashPickupEnabled: boolean; 
    nickname?: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
  }) => {
    const maskedAccountNumber = `**** **** **** ${data.accountNumber.slice(-4)}`;
    
    const newRecipient: Recipient = {
      id: `rec_${Date.now()}`,
      fullName: data.fullName,
      nickname: data.nickname,
      bankName: data.bankName,
      accountNumber: maskedAccountNumber,
      country: data.country,
      streetAddress: data.streetAddress,
      city: data.city,
      stateProvince: data.stateProvince,
      postalCode: data.postalCode,
      deliveryOptions: {
        bankDeposit: true,
        cardDeposit: Math.random() > 0.5, // Randomize for demo
        cashPickup: data.cashPickupEnabled,
      },
      realDetails: {
        accountNumber: data.accountNumber,
        swiftBic: data.swiftBic,
      },
      recipientType: 'bank',
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
  
  const handleUpdateRecipient = (recipientId: string, data: any) => {
    setRecipients(prev => prev.map(r => {
      if (r.id === recipientId) {
        return {
          ...r,
          fullName: data.fullName,
          bankName: data.bankName,
          country: data.country,
          streetAddress: data.streetAddress,
          city: data.city,
          stateProvince: data.stateProvince,
          postalCode: data.postalCode,
          deliveryOptions: { ...r.deliveryOptions, cashPickup: data.cashPickupEnabled },
          realDetails: { accountNumber: data.accountNumber, swiftBic: data.swiftBic },
          accountNumber: `**** **** **** ${data.accountNumber.slice(-4)}`
        };
      }
      return r;
    }));
    addNotification(NotificationType.SECURITY, 'Recipient Updated', `Details for ${data.fullName} were successfully updated.`, 'recipients');
  };

  const handleLinkService = (serviceName: string, identifier: string) => {
    setLinkedServices(prev => ({ ...prev, [serviceName]: identifier }));

    const newRecipient: Recipient = {
        id: `rec_srv_${Date.now()}`,
        fullName: `${serviceName} Contact`,
        nickname: identifier,
        bankName: serviceName, // Use service name as bank name for display
        accountNumber: identifier, // Display the identifier directly
        country: SUPPORTED_COUNTRIES[0], // Assume US for simplicity
        deliveryOptions: { bankDeposit: true, cardDeposit: false, cashPickup: false },
        realDetails: { accountNumber: identifier, swiftBic: serviceName.toUpperCase() },
        recipientType: 'service',
        serviceName,
    };
    setRecipients(prev => [...prev, newRecipient]);
    addNotification(NotificationType.SECURITY, 'Service Linked', `${serviceName} has been linked and added as a recipient.`, 'integrations');
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
    const checkingAccount = accounts.find(acc => acc.type === AccountType.CHECKING);
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
    setCards(prev =>
      prev.map(c => {
        if (c.id === cardId) {
          updatedCard = { ...c, isFrozen: !c.isFrozen };
          return updatedCard;
        }
        return c;
      })
    );
    if (updatedCard) {
      addNotification(
        NotificationType.CARD,
        `Card ${updatedCard.isFrozen ? 'Frozen' : 'Unfrozen'}`,
        `Your card ending in ${updatedCard.lastFour} has been ${updatedCard.isFrozen ? 'frozen' : 'unfrozen'}.`
      );
      const { subject, body } = generateCardStatusEmail(
        USER_NAME,
        updatedCard.isFrozen,
        updatedCard.lastFour
      );
      sendTransactionalEmail(USER_EMAIL, subject, body);
    }
  };

  const handleUpdateTransactions = (transactionIds: string[], updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(tx => 
        transactionIds.includes(tx.id) ? { ...tx, ...updates } : tx
      )
    );
    addNotification(NotificationType.TRANSACTION, 'Transactions Updated', `${transactionIds.length} transaction(s) have been updated.`);
  };

  const addTravelPlan = (country: Country, startDate: Date, endDate: Date) => {
    const newPlan: TravelPlan = {
        id: `travel_${Date.now()}`,
        country,
        startDate,
        endDate,
        status: new Date() > startDate ? TravelPlanStatus.ACTIVE : TravelPlanStatus.UPCOMING
    };
    setTravelPlans(prev => [newPlan, ...prev].sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
    addNotification(NotificationType.TRAVEL, 'Travel Plan Added', `Your trip to ${country.name} has been registered.`);
  };
  
  const handleUpdatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
      setPlatformSettings(prev => ({ ...prev, ...newSettings }));
  };
  // FIX: Created a handler function to bridge the type mismatch between the useState setter and the prop type in the Security component.
  const handleUpdateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    const root = document.documentElement;
    const theme = THEME_COLORS[platformSettings.theme];
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(`--color-primary-${key}`, value);
    }
  }, [platformSettings.theme]);

  const liveTransaction = useMemo(() => {
    return transactions.find(t => t.status !== TransactionStatus.FUNDS_ARRIVED) || null;
  }, [transactions]);
  
  const addTask = (text: string, dueDate?: Date) => {
    const newTask: Task = { id: `task_${Date.now()}`, text, completed: false, dueDate };
    setTasks(prev => [...prev, newTask]);
    addNotification(NotificationType.TASK, 'Task Added', `New task "${text}" has been created.`, 'tasks');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const onBookFlight = (bookingData: Omit<FlightBooking, 'id' | 'bookingDate' | 'status'>, sourceAccountId: string): boolean => {
    const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);
    if (!sourceAccount || sourceAccount.balance < bookingData.totalPrice) {
      addNotification(NotificationType.TRANSACTION, "Booking Failed", "Insufficient funds to book this flight.", "flights");
      return false;
    }
    
    // Deduct funds
    setAccounts(prev => prev.map(acc => acc.id === sourceAccountId ? {...acc, balance: acc.balance - bookingData.totalPrice} : acc));

    // Create booking
    const newBooking: FlightBooking = {
      ...bookingData,
      id: `book_${Date.now()}`,
      bookingDate: new Date(),
      status: 'Confirmed'
    };
    setFlightBookings(prev => [newBooking, ...prev]);

    // Create corresponding transaction for history
    const newTransaction: Transaction = {
        id: `txn_fl_${Date.now()}`,
        accountId: sourceAccountId,
        recipient: { 
            id: 'rec_airline', 
            fullName: bookingData.flight.airline, 
            bankName: 'Airline Booking',
            accountNumber: `Flight ${bookingData.flight.flightNumber}`,
            country: { code: 'US', name: 'United States', currency: 'USD' },
            deliveryOptions: { bankDeposit: true, cardDeposit: false, cashPickup: false },
            realDetails: { accountNumber: bookingData.flight.flightNumber, swiftBic: 'AIRLINE' }
        },
        sendAmount: bookingData.totalPrice,
        receiveAmount: bookingData.totalPrice,
        fee: 0,
        exchangeRate: 1,
        status: TransactionStatus.FUNDS_ARRIVED, // Treat as immediate payment
        estimatedArrival: new Date(),
        statusTimestamps: { [TransactionStatus.SUBMITTED]: new Date(), [TransactionStatus.FUNDS_ARRIVED]: new Date() },
        description: `Flight: ${bookingData.flight.from.code} to ${bookingData.flight.to.code}`,
        type: 'debit',
        purpose: 'Travel',
    };
    setTransactions(prev => [newTransaction, ...prev]);

    addNotification(NotificationType.TRAVEL, "Flight Booked!", `Your flight to ${bookingData.flight.to.city} is confirmed.`, "flights");
    return true;
  };
  
  const onPayUtilityBill = (billId: string, sourceAccountId: string): boolean => {
    const bill = utilityBills.find(b => b.id === billId);
    const sourceAccount = accounts.find(acc => acc.id === sourceAccountId);

    if (!bill || !sourceAccount || sourceAccount.balance < bill.amount) {
      addNotification(NotificationType.TRANSACTION, "Payment Failed", "Insufficient funds to pay this bill.", "utilities");
      return false;
    }

    setAccounts(prev => prev.map(acc => acc.id === sourceAccountId ? {...acc, balance: acc.balance - bill.amount} : acc));
    setUtilityBills(prev => prev.map(b => b.id === billId ? {...b, isPaid: true} : b));
    
    const biller = utilityBillers.find(b => b.id === bill.billerId);
    
     const newTransaction: Transaction = {
        id: `txn_util_${Date.now()}`,
        accountId: sourceAccountId,
        recipient: {
            id: `rec_util_${biller?.id}`,
            fullName: biller?.name || 'Utility Biller',
            bankName: 'Utility Payment',
            accountNumber: biller?.accountNumber || 'N/A',
            country: { code: 'US', name: 'United States', currency: 'USD' },
            deliveryOptions: { bankDeposit: true, cardDeposit: false, cashPickup: false },
            realDetails: { accountNumber: biller?.accountNumber || '', swiftBic: 'UTILITY' }
        },
        sendAmount: bill.amount,
        receiveAmount: bill.amount,
        fee: 0,
        exchangeRate: 1,
        status: TransactionStatus.FUNDS_ARRIVED,
        estimatedArrival: new Date(),
        statusTimestamps: { [TransactionStatus.SUBMITTED]: new Date(), [TransactionStatus.FUNDS_ARRIVED]: new Date() },
        description: `Payment to ${biller?.name}`,
        type: 'debit',
        purpose: 'Utilities',
    };
    setTransactions(prev => [newTransaction, ...prev]);

    addNotification(NotificationType.TRANSACTION, "Bill Paid", `Your payment of ${bill.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} to ${biller?.name} was successful.`, "utilities");
    return true;
  };
  
   const runFinancialAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisError(false);
    
    // Create a simplified data structure for the AI
    const financialData = JSON.stringify({
        accounts,
        transactions: transactions.slice(0, 20), // Last 20 transactions
        cryptoHoldings,
        loanApplications,
    });

    const { analysis, isError } = await getFinancialAnalysis(financialData);
    if (isError) {
        setAnalysisError(true);
    } else {
        setFinancialAnalysis(analysis);
    }
    setIsAnalyzing(false);
  }, [accounts, transactions, cryptoHoldings, loanApplications, setFinancialAnalysis, setIsAnalyzing, setAnalysisError]);

  const onAuthorizeTransaction = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === transactionId ? { ...tx, requiresAuth: false, status: TransactionStatus.CONVERTING } : tx
      )
    );
     addNotification(NotificationType.TRANSACTION, 'Transfer Authorized', `Your transfer is now being processed.`);
  };
  
  const onUpdateSpendingLimits = (limits: SpendingLimit[]) => {
      setAppleCardDetails(prev => ({...prev, spendingLimits: limits}));
      addNotification(NotificationType.CARD, 'Spending Limits Updated', 'Your Apple Card spending limits have been successfully updated.');
  };
  
  const onUpdateTransactionCategory = (transactionId: string, category: SpendingCategory) => {
    setAppleCardTransactions(prev => 
      prev.map(tx => tx.id === transactionId ? {...tx, category} : tx)
    );
  };
  
  const onPaySubscription = (subscriptionId: string): boolean => {
      const sub = subscriptions.find(s => s.id === subscriptionId);
      const checkingAccount = accounts.find(a => a.type === AccountType.CHECKING);
      
      if(!sub || !checkingAccount || checkingAccount.balance < sub.amount) {
        addNotification(NotificationType.TRANSACTION, 'Payment Failed', 'Insufficient funds for this subscription.', 'services');
        return false;
      }
      
      setAccounts(prev => prev.map(acc => acc.id === checkingAccount.id ? { ...acc, balance: acc.balance - sub.amount } : acc));
      setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? { ...s, isPaid: true } : s));
      
      addNotification(NotificationType.SUBSCRIPTION, 'Subscription Paid', `Your payment to ${sub.provider} was successful.`, 'services');
      return true;
  };

  const onBuyCrypto = (assetId: string, usdAmount: number, assetPrice: number): boolean => {
    const checkingAccount = accounts.find(a => a.type === AccountType.CHECKING);
    if (!checkingAccount || checkingAccount.balance < usdAmount) {
      addNotification(NotificationType.CRYPTO, 'Purchase Failed', 'Insufficient funds in your checking account.', 'crypto');
      return false;
    }
    
    const fee = usdAmount * CRYPTO_TRADE_FEE_PERCENT;
    const totalCost = usdAmount + fee;
    const cryptoAmount = usdAmount / assetPrice;

    if (checkingAccount.balance < totalCost) {
      addNotification(NotificationType.CRYPTO, 'Purchase Failed', 'Insufficient funds to cover the amount plus fees.', 'crypto');
      return false;
    }

    // Deduct from checking
    setAccounts(prev => prev.map(acc => acc.id === checkingAccount.id ? { ...acc, balance: acc.balance - totalCost } : acc));
    
    // Add to crypto holdings
    setCryptoHoldings(prev => {
        const existing = prev.find(h => h.assetId === assetId);
        if(existing) {
            const newTotalAmount = existing.amount + cryptoAmount;
            const newAvgPrice = ((existing.avgBuyPrice * existing.amount) + (assetPrice * cryptoAmount)) / newTotalAmount;
            return prev.map(h => h.assetId === assetId ? {...h, amount: newTotalAmount, avgBuyPrice: newAvgPrice} : h);
        } else {
            return [...prev, { assetId, amount: cryptoAmount, avgBuyPrice: assetPrice }];
        }
    });
    
    addNotification(NotificationType.CRYPTO, 'Purchase Successful', `You bought ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()}.`, 'crypto');
    return true;
  };
  
  const onSellCrypto = (assetId: string, cryptoAmount: number, assetPrice: number): boolean => {
      const holding = cryptoHoldings.find(h => h.assetId === assetId);
      if (!holding || holding.amount < cryptoAmount) {
        addNotification(NotificationType.CRYPTO, 'Sale Failed', 'Insufficient crypto balance.', 'crypto');
        return false;
      }
      
      const usdAmount = cryptoAmount * assetPrice;
      const fee = usdAmount * CRYPTO_TRADE_FEE_PERCENT;
      const netProceeds = usdAmount - fee;
      
      // Update holdings
      setCryptoHoldings(prev => prev.map(h => h.assetId === assetId ? {...h, amount: h.amount - cryptoAmount} : h).filter(h => h.amount > 0.000001));

      // Add to checking
      setAccounts(prev => prev.map(acc => acc.type === AccountType.CHECKING ? { ...acc, balance: acc.balance + netProceeds } : acc));
      
      addNotification(NotificationType.CRYPTO, 'Sale Successful', `You sold ${cryptoAmount.toFixed(6)} ${assetId.toUpperCase()}.`, 'crypto');
      return true;
  };

  const totalDomesticBalance = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
  const cryptoPortfolioValue = useMemo(() => cryptoHoldings.reduce((sum, holding) => {
    const asset = cryptoAssets.find(a => a.id === holding.assetId);
    return sum + (asset ? asset.price * holding.amount : 0);
  }, 0), [cryptoHoldings, cryptoAssets]);

  const totalNetWorth = useMemo(() => {
    if (balanceDisplayMode === 'global') {
      return totalDomesticBalance + cryptoPortfolioValue;
    }
    return totalDomesticBalance;
  }, [totalDomesticBalance, cryptoPortfolioValue, balanceDisplayMode]);

  const portfolioChange24h = useMemo(() => {
      const previousValue = cryptoHoldings.reduce((sum, holding) => {
          const asset = cryptoAssets.find(a => a.id === holding.assetId);
          if (asset) {
              const previousPrice = asset.price / (1 + asset.change24h / 100);
              return sum + (previousPrice * holding.amount);
          }
          return sum;
      }, 0);

      if (previousValue === 0) return 0;
      return ((cryptoPortfolioValue - previousValue) / previousValue) * 100;
  }, [cryptoPortfolioValue, cryptoHoldings, cryptoAssets]);

  // Main render logic
  if (authStatus === 'intro') {
    return <AdvancedFirstPage onComplete={() => setAuthStatus('loggedOut')} />;
  }
  
  if (authStatus === 'loggedOut') {
    return <Welcome onLogin={handleCredentialsSuccess} />;
  }
  
  if (authStatus === 'locked') {
    return <LoggedOut user={USER_PROFILE} onLogin={handleRelogin} onSwitchUser={() => setAuthStatus('loggedOut')} />
  }

  if (authStatus === 'profileSignIn') {
    return <ProfileSignIn user={USER_PROFILE} onEnterDashboard={handleEnterDashboard} />;
  }
  
  if (authStatus === 'initializing') {
    return <OpeningSequence onComplete={() => setAuthStatus('loggedIn')} />;
  }
  
  if (isLoggingOut) {
    return <LoggingOut onComplete={handleFinalizeLogout} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} portfolioChange24h={portfolioChange24h} travelPlans={travelPlans} totalNetWorth={totalNetWorth} balanceDisplayMode={balanceDisplayMode} />;
      case 'send':
        return <SendMoneyFlow recipients={recipients} accounts={accounts} createTransaction={createTransaction} transactions={transactions} securitySettings={securitySettings} hapticsEnabled={platformSettings.hapticsEnabled} onAuthorizeTransaction={onAuthorizeTransaction} setActiveView={setActiveView} />;
      case 'recipients':
        return <Recipients recipients={recipients} addRecipient={addRecipient} onUpdateRecipient={handleUpdateRecipient} />;
      case 'history':
        return <ActivityLog transactions={transactions} onUpdateTransactions={handleUpdateTransactions} />;
      case 'security':
        return <Security transferLimits={transferLimits} onUpdateLimits={setTransferLimits} verificationLevel={verificationLevel} onVerificationComplete={setVerificationLevel} securitySettings={securitySettings} onUpdateSecuritySettings={handleUpdateSecuritySettings} trustedDevices={trustedDevices} onRevokeDevice={(id) => setTrustedDevices(prev => prev.filter(d => d.id !== id))} onChangePassword={() => setIsChangePasswordModalOpen(true)} transactions={transactions}/>;
      case 'cards':
        return <CardManagement cards={cards} transactions={INITIAL_CARD_TRANSACTIONS} onToggleFreeze={handleToggleFreeze} onAddCard={addCard} accountBalance={accounts.find(acc=>acc.type===AccountType.CHECKING)?.balance || 0} onAddFunds={addFunds} />;
      case 'insurance':
        return <Insurance addNotification={addNotification} />;
      case 'loans':
        return <Loans loanApplications={loanApplications} addLoanApplication={addLoanApplication} addNotification={addNotification} />;
      case 'support':
        return <Support />;
      case 'accounts':
        // FIX: Corrected prop value from undefined variable 'onUpdateAccountNickname' to the defined handler 'handleUpdateAccountNickname'.
        return <Accounts accounts={accounts} transactions={transactions} verificationLevel={verificationLevel} onUpdateAccountNickname={handleUpdateAccountNickname} />;
      case 'crypto':
        // FIX: Corrected variable name from 'holdings' to 'cryptoHoldings' to match state variable.
        return <CryptoDashboard cryptoAssets={cryptoAssets} setCryptoAssets={setCryptoAssets} holdings={cryptoHoldings} checkingAccount={accounts.find(a => a.type === AccountType.CHECKING)} onBuy={onBuyCrypto} onSell={onSellCrypto} />;
      case 'services':
        return <ServicesDashboard subscriptions={subscriptions} onPaySubscription={onPaySubscription} appleCardDetails={appleCardDetails} appleCardTransactions={appleCardTransactions} onUpdateSpendingLimits={onUpdateSpendingLimits} onUpdateTransactionCategory={onUpdateTransactionCategory} />;
      case 'checkin':
        return <TravelCheckIn travelPlans={travelPlans} addTravelPlan={addTravelPlan} />;
      case 'platform':
        return <PlatformFeatures settings={platformSettings} onUpdateSettings={handleUpdatePlatformSettings} />;
      case 'tasks':
        return <Tasks tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />;
      case 'flights':
        return <Flights bookings={flightBookings} onBookFlight={onBookFlight} accounts={accounts} setActiveView={setActiveView} />;
      case 'utilities':
        return <Utilities bills={utilityBills} billers={utilityBillers} onPayBill={onPayUtilityBill} accounts={accounts} setActiveView={setActiveView} />;
      case 'integrations':
        return <Integrations linkedServices={linkedServices} onLinkService={handleLinkService} />;
      case 'advisor':
// FIX: Corrected function name from 'runAnalysis' to 'runFinancialAnalysis'
        return <FinancialAdvisor analysis={financialAnalysis} isAnalyzing={isAnalyzing} analysisError={analysisError} runAnalysis={runFinancialAnalysis} setActiveView={setActiveView} />;
      case 'invest':
        return <Investments />;
      case 'atmLocator':
        return <AtmLocator />;
      default:
        return <Dashboard accounts={accounts} transactions={transactions} setActiveView={setActiveView} recipients={recipients} createTransaction={createTransaction} cryptoPortfolioValue={cryptoPortfolioValue} portfolioChange24h={portfolioChange24h} travelPlans={travelPlans} totalNetWorth={totalNetWorth} balanceDisplayMode={balanceDisplayMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleInitiateLogout}
        notifications={notifications}
        onMarkNotificationsAsRead={markNotificationsAsRead}
        onNotificationClick={(view) => setActiveView(view)}
        balanceDisplayMode={balanceDisplayMode}
        setBalanceDisplayMode={setBalanceDisplayMode}
      />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderActiveView()}
      </main>
      <Footer setActiveView={setActiveView} />
      <DynamicIslandSimulator transaction={liveTransaction} />
      <BankingChat />
      {isLogoutModalOpen && <LogoutConfirmationModal onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />}
      {showInactivityModal && <InactivityModal onLogout={handleConfirmLogout} onStayLoggedIn={() => setShowInactivityModal(false)} countdownStart={INACTIVITY_MODAL_COUNTDOWN} />}
      {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} onSuccess={() => addNotification(NotificationType.SECURITY, 'Password Updated', 'Your password has been successfully changed.')} />}
    </div>
  );
}