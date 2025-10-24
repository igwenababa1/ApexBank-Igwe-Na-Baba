import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TransferLimits, VerificationLevel, SecuritySettings, TrustedDevice, Transaction, TransactionStatus } from '../types';
import { CheckCircleIcon, PencilIcon, DevicePhoneMobileIcon, FingerprintIcon, LockClosedIcon, UserCircleIcon, NetworkIcon, IdentificationIcon, ComputerDesktopIcon, FaceIdIcon, CertificateIcon, ChartBarIcon, ShieldCheckIcon, TrendingUpIcon, EyeIcon, ExclamationTriangleIcon } from './Icons';
import { ManageLimitsModal } from './ManageLimitsModal';
import { VerificationCenter } from './VerificationCenter';
import { Setup2FAModal } from './Setup2FAModal';
import { SetupBiometricsModal } from './SetupBiometricsModal';

interface SettingsProps {
  transferLimits: TransferLimits;
  onUpdateLimits: (newLimits: TransferLimits) => void;
  verificationLevel: VerificationLevel;
  onVerificationComplete: (level: VerificationLevel) => void;
  securitySettings: SecuritySettings;
  onUpdateSecuritySettings: (newSettings: Partial<SecuritySettings>) => void;
  trustedDevices: TrustedDevice[];
  onRevokeDevice: (deviceId: string) => void;
  onChangePassword: () => void;
  transactions: Transaction[];
}

const KycFeatureCard: React.FC<{
  // FIX: Changed icon type to React.ReactElement to ensure it's a cloneable element for React.cloneElement.
  icon: React.ReactElement<any>;
  title: string;
  description: string;
  unlocked: boolean;
  requiredLevel: string;
  imageUrl?: string;
}> = ({ icon, title, description, unlocked, requiredLevel, imageUrl }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px 100px 0px' } // Load when 100px from bottom of viewport
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <div ref={cardRef} className={`group relative p-4 rounded-lg shadow-digital-inset transition-all duration-300 overflow-hidden ${unlocked ? 'bg-slate-200' : 'bg-slate-300/50'}`}>
            {unlocked && imageUrl && (
                <>
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: isVisible ? `url(${imageUrl})` : 'none' }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-200 via-slate-200/80 to-slate-200/50"></div>
                </>
            )}
            <div className="relative flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full shadow-digital ${unlocked ? 'bg-slate-200/80' : 'bg-slate-300'}`}>
                    {unlocked ? React.cloneElement(icon, { className: "w-6 h-6 text-primary" }) : React.cloneElement(icon, { className: "w-6 h-6 text-slate-400" })}
                </div>
                <div className="flex-grow">
                    <h4 className={`font-bold ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{title}</h4>
                    <p className={`text-sm ${unlocked ? 'text-slate-600' : 'text-slate-500'}`}>{description}</p>
                </div>
                {unlocked ? (
                    <div className="flex-shrink-0 flex items-center space-x-1 text-green-600 text-xs font-bold bg-green-100/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Unlocked</span>
                    </div>
                ) : (
                    <div className="flex-shrink-0 text-slate-500 text-xs font-semibold bg-slate-200/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        Requires {requiredLevel}
                    </div>
                )}
            </div>
        </div>
    );
};


const SecurityScore: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference * (1 - score / 100);
    const scoreColor = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="text-slate-300" />
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${scoreColor}`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm font-medium text-slate-500">Score</span>
            </div>
        </div>
    );
};

const LimitProgress: React.FC<{
    title: string;
    usedAmount: number;
    limitAmount: number;
    usedCount: number;
    limitCount: number;
}> = ({ title, usedAmount, limitAmount, usedCount, limitCount }) => {
    const amountPercentage = Math.min((usedAmount / limitAmount) * 100, 100);
    const countPercentage = Math.min((usedCount / limitCount) * 100, 100);

    const getBarColor = (percentage: number) => {
        if (percentage > 90) return 'bg-red-500';
        if (percentage > 75) return 'bg-yellow-500';
        return 'bg-primary';
    };

    return (
        <div className="py-4 first:pt-0 last:pb-0">
            <h4 className="font-semibold text-slate-700 mb-3">{title}</h4>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Amount Used</span>
                        <span className="font-mono text-slate-800 font-semibold">
                            {usedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / {limitAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 shadow-digital-inset">
                        <div className={`${getBarColor(amountPercentage)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${amountPercentage}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Transactions Used</span>
                        <span className="font-mono text-slate-800 font-semibold">
                            {usedCount} / {limitCount}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 shadow-digital-inset">
                        <div className={`${getBarColor(countPercentage)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${countPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Security: React.FC<SettingsProps> = ({ 
    transferLimits, 
    onUpdateLimits, 
    verificationLevel, 
    onVerificationComplete,
    securitySettings,
    onUpdateSecuritySettings,
    trustedDevices,
    onRevokeDevice,
    onChangePassword,
    transactions,
}) => {
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);

  const securityScore = useMemo(() => {
    let score = 25; // Base score
    if (securitySettings.mfaEnabled) score += 25;
    if (securitySettings.biometricsEnabled) score += 25;
    
    if (verificationLevel === VerificationLevel.LEVEL_3) {
        score += 25;
    } else if (verificationLevel === VerificationLevel.LEVEL_2) {
        score += 15;
    } else if (verificationLevel === VerificationLevel.LEVEL_1) {
        score += 10;
    }

    return Math.round(score);
  }, [securitySettings, verificationLevel]);

  const getUsageForPeriod = (transactions: Transaction[], days: number) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const relevantTxs = transactions.filter(tx => {
        const txDate = tx.statusTimestamps[TransactionStatus.SUBMITTED];
        return txDate >= cutoff && tx.type === 'debit';
    });

    const totalAmount = relevantTxs.reduce((sum, tx) => sum + tx.sendAmount, 0);
    const totalCount = relevantTxs.length;

    return { amount: totalAmount, count: totalCount };
  };

  const dailyUsage = useMemo(() => getUsageForPeriod(transactions, 1), [transactions]);
  const weeklyUsage = useMemo(() => getUsageForPeriod(transactions, 7), [transactions]);
  const monthlyUsage = useMemo(() => getUsageForPeriod(transactions, 30), [transactions]);

  const handleSaveLimits = (newLimits: TransferLimits) => {
    onUpdateLimits(newLimits);
    setIsLimitsModalOpen(false);
  };
  
  const handleVerificationModalClose = (level: VerificationLevel) => {
    onVerificationComplete(level);
    setIsVerificationModalOpen(false);
  };

  const TrustedDeviceRow: React.FC<{ device: TrustedDevice }> = ({ device }) => {
    const DeviceIcon = device.deviceType === 'desktop' ? ComputerDesktopIcon : DevicePhoneMobileIcon;
    return (
        <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center first:pt-0 last:pb-0">
            <div className="flex items-start space-x-4">
                <DeviceIcon className="w-6 h-6 text-slate-500 mt-0.5 flex-shrink-0"/>
                <div>
                    <p className="font-medium text-slate-700 flex items-center">{device.browser} {device.isCurrent && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Current</span>}</p>
                    <p className="text-sm text-slate-500">{device.location} • Last login: {new Date(device.lastLogin).toLocaleDateString()}</p>
                </div>
            </div>
            {!device.isCurrent && (
                <button onClick={() => onRevokeDevice(device.id)} className="mt-2 sm:mt-0 px-3 py-1.5 text-sm font-medium text-red-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                    Revoke
                </button>
            )}
        </div>
    );
  };

  const verificationLevelValue = useMemo(() => Object.values(VerificationLevel).indexOf(verificationLevel), [verificationLevel]);

  const kycFeatures = [
      { 
          icon: <ChartBarIcon />, 
          title: "Access to Crypto Trading", 
          description: "Buy, sell, and hold top cryptocurrencies directly within your I-Shell Credit Union account.", 
          requiredLevel: VerificationLevel.LEVEL_2, 
          requiredLevelValue: 2,
          imageUrl: 'https://images.unsplash.com/photo-1621452684752-5192a835a42a?q=80&w=2070&auto=format&fit=crop'
      },
      { 
          icon: <ShieldCheckIcon />, 
          title: "Enhanced Fraud Protection Insurance", 
          description: "Advanced insurance coverage for unauthorized transactions on your verified account.", 
          requiredLevel: VerificationLevel.LEVEL_3, 
          requiredLevelValue: 3,
          imageUrl: 'https://images.unsplash.com/photo-1563212139-251f93f1f358?q=80&w=1974&auto=format&fit=crop'
      },
      { 
          icon: <TrendingUpIcon />, 
          title: "Access to High-Value Transactions", 
          description: "Eligibility for increased transfer limits and access to specialized investment products.", 
          requiredLevel: VerificationLevel.LEVEL_3, 
          requiredLevelValue: 3,
          imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop'
      },
      { 
          icon: <EyeIcon />, 
          title: "Dedicated Account Monitoring", 
          description: "Proactive, specialized monitoring of your account activity by our senior security team.", 
          requiredLevel: VerificationLevel.LEVEL_3, 
          requiredLevelValue: 3,
          imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2231&auto=format&fit=crop'
      },
  ];

  const securityCheckupItems = [
    {
        icon: LockClosedIcon,
        title: 'Strong Password',
        description: 'A strong, unique password is your first line of defense.',
        isComplete: true, // Assuming password is always set
        statusText: 'Active',
        actionText: 'Change',
        action: onChangePassword
    },
    {
        icon: DevicePhoneMobileIcon,
        title: 'Two-Factor Authentication',
        description: 'Add a second layer of security for logins and sensitive actions.',
        isComplete: securitySettings.mfaEnabled,
        statusText: securitySettings.mfaEnabled ? 'Enabled' : 'Not Enabled',
        actionText: 'Enable',
        action: () => setIs2FAModalOpen(true)
    },
    {
        icon: FingerprintIcon,
        title: 'Biometric Login',
        description: 'Enable Face ID or fingerprint for faster, secure access on this device.',
        isComplete: securitySettings.biometricsEnabled,
        statusText: securitySettings.biometricsEnabled ? 'Enabled' : 'Not Set Up',
        actionText: 'Setup',
        action: () => setIsBiometricsModalOpen(true)
    },
    {
        icon: IdentificationIcon,
        title: 'Identity Verification',
        description: 'Complete verification to unlock higher limits and more features.',
        isComplete: verificationLevel !== VerificationLevel.UNVERIFIED,
        statusText: verificationLevel,
        actionText: 'Verify',
        action: () => setIsVerificationModalOpen(true)
    }
  ];
  
  const kycLevels = Object.values(VerificationLevel).slice(1);

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <div className="flex items-center space-x-3">
                <CertificateIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-slate-800">Security Center</h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">Manage your account security settings and connected services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-slate-200 rounded-2xl shadow-digital p-6">
            <div className="md:col-span-1">
                <SecurityScore score={securityScore} />
            </div>
            <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800">Your Security Score is {securityScore > 80 ? 'Excellent' : securityScore > 60 ? 'Good' : 'Fair'}</h3>
                <p className="text-sm text-slate-600 mt-1">Complete the security checkup items to improve your score and better protect your account.</p>
            </div>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital">
            <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Security Checkup</h2></div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityCheckupItems.map(item => {
                    const statusColor = item.isComplete ? 'text-green-600' : 'text-yellow-600';
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="bg-slate-200 p-4 rounded-lg shadow-digital-inset space-y-3 flex flex-col">
                            <div className="flex items-start space-x-3">
                                <Icon className={`w-8 h-8 ${statusColor}`} />
                                <div className="flex-grow">
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.description}</p>
                                </div>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                                <div className={`flex items-center text-sm font-semibold ${statusColor}`}>
                                    {item.isComplete ? <CheckCircleIcon className="w-4 h-4 mr-1"/> : <ExclamationTriangleIcon className="w-4 h-4 mr-1"/>}
                                    <span>{item.statusText}</span>
                                </div>
                                {!item.isComplete && (
                                    <button onClick={item.action} className="px-3 py-1.5 text-xs font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                                        {item.actionText}
                                    </button>
                                )}
                                {item.isComplete && item.title === 'Strong Password' && (
                                    <button onClick={item.action} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                                        {item.actionText}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        
        <div className="bg-slate-200 rounded-2xl shadow-digital">
            <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Advanced KYC Features</h2></div>
            <div className="p-6 space-y-4">
                <div className="mb-6">
                    <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                        <span>Verification Progress</span>
                        <span className="font-bold text-primary">{verificationLevel}</span>
                    </div>
                    <div className="w-full bg-slate-300 rounded-full h-2.5 shadow-digital-inset">
                        <div 
                            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${(verificationLevelValue / (Object.values(VerificationLevel).length -1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {kycFeatures.map(feature => (
                    <div key={feature.title} className="group">
                      <KycFeatureCard 
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                          unlocked={verificationLevelValue >= feature.requiredLevelValue}
                          requiredLevel={feature.requiredLevel.split(':')[0]}
                          imageUrl={feature.imageUrl}
                      />
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300"><h2 className="text-xl font-bold text-slate-800">Trusted Devices & Sessions</h2></div>
          <div className="p-6 divide-y divide-slate-300">
             {trustedDevices.map(device => <TrustedDeviceRow key={device.id} device={device} />)}
          </div>
        </div>

        <div className="bg-slate-200 rounded-2xl shadow-digital">
          <div className="p-6 border-b border-slate-300 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Transfer Limits</h2>
             <button onClick={() => setIsLimitsModalOpen(true)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-slate-200 rounded-lg shadow-digital active:shadow-digital-inset transition-shadow">
                <PencilIcon className="w-4 h-4" />
                <span>Manage</span>
              </button>
          </div>
          <div className="p-6 divide-y divide-slate-300">
             <LimitProgress 
                title="Daily Limit"
                usedAmount={dailyUsage.amount}
                limitAmount={transferLimits.daily.amount}
                usedCount={dailyUsage.count}
                limitCount={transferLimits.daily.count}
            />
            <LimitProgress 
                title="Weekly Limit"
                usedAmount={weeklyUsage.amount}
                limitAmount={transferLimits.weekly.amount}
                usedCount={weeklyUsage.count}
                limitCount={transferLimits.weekly.count}
            />
            <LimitProgress 
                title="Monthly Limit"
                usedAmount={monthlyUsage.amount}
                limitAmount={transferLimits.monthly.amount}
                usedCount={monthlyUsage.count}
                limitCount={transferLimits.monthly.count}
            />
          </div>
        </div>
      </div>
      {isLimitsModalOpen && (
        <ManageLimitsModal 
          limits={transferLimits}
          onSave={handleSaveLimits}
          onClose={() => setIsLimitsModalOpen(false)}
        />
      )}
      {isVerificationModalOpen && (
        <VerificationCenter 
            currentLevel={verificationLevel}
            onClose={handleVerificationModalClose}
        />
      )}
       {is2FAModalOpen && (
          <Setup2FAModal 
            onClose={() => setIs2FAModalOpen(false)}
            onEnable={() => onUpdateSecuritySettings({ mfaEnabled: true })}
          />
      )}
      {isBiometricsModalOpen && (
          <SetupBiometricsModal 
            onClose={() => setIsBiometricsModalOpen(false)}
            onEnable={() => onUpdateSecuritySettings({ biometricsEnabled: true })}
          />
      )}
    </>
  );
};