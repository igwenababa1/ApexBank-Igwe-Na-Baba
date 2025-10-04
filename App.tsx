import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { Recipients } from './components/Recipients';
import { Transaction, Recipient, TransactionStatus, Card, Notification, NotificationType, TransferLimits, Country } from './types';
import { INITIAL_RECIPIENTS, INITIAL_TRANSACTIONS, INITIAL_CARD_DETAILS, INITIAL_CARD_TRANSACTIONS, INITIAL_TRANSFER_LIMITS, SELF_RECIPIENT } from './constants';
import { Welcome } from './components/Welcome';
import { ActivityLog } from './components/ActivityLog';
import { Settings } from './components/Settings';
import { CardManagement } from './components/CardManagement';
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

type View = 'dashboard' | 'send' | 'recipients' | 'history' | 'settings' | 'cards';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const USER_EMAIL = "eleanor.vance@apexbank.com";
const USER_NAME = "Eleanor Vance";
const USER_PHONE = "+1-555-012-1234";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [accountBalance, setAccountBalance] = useState(10000);
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cardDetails, setCardDetails] = useState<Card>(INITIAL_CARD_DETAILS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transferLimits, setTransferLimits] = useState<TransferLimits>(INITIAL_TRANSFER_LIMITS);
  
  const handleLogin = (isNewAccount = false) => {
    setIsAuthenticated(true);
    if (isNewAccount) {
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
  
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
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

  const addRecipient = (data: { fullName: string; bankName: string; accountNumber: string; swiftBic: string; country: Country; cashPickupEnabled: boolean; }) => {
    const maskedAccountNumber = `**** **** **** ${data.accountNumber.slice(-4)}`;
    
    const newRecipient: Recipient = {
      id: `rec_${Date.now()}`,
      fullName: data.fullName,
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

  const createTransaction = (txData: Omit<Transaction, 'id' | 'status' | 'estimatedArrival' | 'statusTimestamps' | 'type'>): Transaction | null => {
    const now = new Date();
    const totalCost = txData.sendAmount + txData.fee;

    // --- Limit Checking ---
    const today = new Date();
    today.setHours(0,0,0,0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailyTx = transactions.filter(t => t.statusTimestamps.Submitted.getTime() >= today.getTime());
    const weeklyTx = transactions.filter(t => t.statusTimestamps.Submitted.getTime() >= startOfWeek.getTime());
    const monthlyTx = transactions.filter(t => t.statusTimestamps.Submitted.getTime() >= startOfMonth.getTime());

    const dailySum = dailyTx.reduce((sum, t) => sum + t.sendAmount + t.fee, 0);
    const weeklySum = weeklyTx.reduce((sum, t) => sum + t.sendAmount + t.fee, 0);
    const monthlySum = monthlyTx.reduce((sum, t) => sum + t.sendAmount + t.fee, 0);
    
    if (dailyTx.length >= transferLimits.daily.count) {
      alert(`Daily transaction limit exceeded. You cannot make more than ${transferLimits.daily.count} transactions per day.`);
      return null;
    }
    if (dailySum + totalCost > transferLimits.daily.amount) {
      alert(`Daily amount limit exceeded. This transaction would exceed your daily limit of ${transferLimits.daily.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
      return null;
    }
    if (weeklyTx.length >= transferLimits.weekly.count) {
      alert(`Weekly transaction limit exceeded. You cannot make more than ${transferLimits.weekly.count} transactions per week.`);
      return null;
    }
    if (weeklySum + totalCost > transferLimits.weekly.amount) {
      alert(`Weekly amount limit exceeded. This transaction would exceed your weekly limit of ${transferLimits.weekly.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
      return null;
    }
    if (monthlyTx.length >= transferLimits.monthly.count) {
      alert(`Monthly transaction limit exceeded. You cannot make more than ${transferLimits.monthly.count} transactions per month.`);
      return null;
    }
    if (monthlySum + totalCost > transferLimits.monthly.amount) {
      alert(`Monthly amount limit exceeded. This transaction would exceed your monthly limit of ${transferLimits.monthly.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`);
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
    setAccountBalance(prev => prev - totalCost);
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
    
    const newDeposit: Transaction = {
      id: `txn_${now.getTime()}`,
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
    setAccountBalance(prev => prev + amount);
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

        // Process status changes sequentially with delays between each stage
        switch (tx.status) {
          case TransactionStatus.SUBMITTED:
            // Wait a few seconds before 'Converting'
            if (now - timestamps[TransactionStatus.SUBMITTED].getTime() > 3000) {
              newStatus = TransactionStatus.CONVERTING;
            }
            break;
          case TransactionStatus.CONVERTING:
            // Wait a longer period before going 'In Transit'
            const convertingTimestamp = timestamps[TransactionStatus.CONVERTING];
            if (convertingTimestamp && now - convertingTimestamp.getTime() > 8000) {
              newStatus = TransactionStatus.IN_TRANSIT;
            }
            break;
          case TransactionStatus.IN_TRANSIT:
            // Final step is reaching the estimated arrival time
            if (now >= tx.estimatedArrival.getTime()) {
              newStatus = TransactionStatus.FUNDS_ARRIVED;
            }
            break;
          default:
            break;
        }

        // Catch-all for overdue transactions that might have been missed (e.g., browser tab was inactive)
        if (newStatus === tx.status && now >= tx.estimatedArrival.getTime()) {
            newStatus = TransactionStatus.FUNDS_ARRIVED;
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

  useEffect(() => {
    const intervalId = setInterval(updateTransactionStatuses, 2000); // Check every 2 seconds
    return () => clearInterval(intervalId);
  }, [updateTransactionStatuses]);
  
  useEffect(() => {
    // FIX: Using `ReturnType<typeof setTimeout>` makes the type compatible with both Node.js and browser environments, resolving the "Cannot find namespace 'NodeJS'" error.
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (isAuthenticated) {
        inactivityTimer = setTimeout(() => {
          alert("You've been logged out due to inactivity.");
          handleLogout();
        }, INACTIVITY_TIMEOUT);
      }
    };
    
    if (isAuthenticated) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      resetTimer();
    }

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [isAuthenticated, handleLogout]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard accountBalance={accountBalance} transactions={transactions} />;
      case 'send':
        return <SendMoneyFlow recipients={recipients} accountBalance={accountBalance} createTransaction={createTransaction} transactions={transactions} />;
      case 'recipients':
        return <Recipients recipients={recipients} addRecipient={addRecipient} />;
      case 'cards':
        return <CardManagement card={cardDetails} transactions={INITIAL_CARD_TRANSACTIONS} onToggleFreeze={handleToggleFreeze} accountBalance={accountBalance} onAddFunds={addFunds} />;
      case 'history':
        return <ActivityLog transactions={transactions} />;
      case 'settings':
        return <Settings transferLimits={transferLimits} onUpdateLimits={setTransferLimits} />;
      default:
        return <Dashboard accountBalance={accountBalance} transactions={transactions} />;
    }
  };

  if (!isAuthenticated) {
    return <Welcome onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationsAsRead={markNotificationsAsRead}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;