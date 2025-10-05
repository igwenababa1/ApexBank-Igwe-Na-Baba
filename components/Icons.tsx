import React from 'react';

export const ApexBankLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L4 11.5V26.5H28V11.5L16 4Z" fill="url(#paint0_linear_1_2)" />
    <path d="M16 4L4 11.5V14L16 21.5L28 14V11.5L16 4Z" fill="white" fillOpacity="0.5"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="16" y1="4" x2="16" y2="26.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0052FF"/>
        <stop offset="1" stopColor="#003199"/>
      </linearGradient>
    </defs>
  </svg>
);

export const DashboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const UserGroupIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m-4.5 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const KeypadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01M6 6h12v12H6z" />
    </svg>
);

export const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const BellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const LogoutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const ActivityIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const CogIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const CreditCardIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const LifebuoyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414m-1.414-1.414l1.414-1.414M12 21a9 9 0 100-18 9 9 0 000 18zm0-4a5 5 0 100-10 5 5 0 000 10zM5.636 5.636l1.414 1.414m-1.414 1.414l-1.414-1.414m12.728 12.728l-1.414-1.414m1.414 1.414l-1.414 1.414" />
    </svg>
);

export const CashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const QuestionMarkCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WalletIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" transform="translate(0 -1)" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z" />
    </svg>
);

export const EyeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

export const EyeSlashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.05 10.05 0 013.54-4.475m6.46-1.025a10.05 10.05 0 013.54 4.475c-1.274 4.057-5.064 7-9.543 7a10.05 10.05 0 01-1.25-.125m1-9.375A3.001 3.001 0 0012 8.5c1.657 0 3 1.343 3 3a2.999 2.999 0 00-.125 1m-6.375 0A3 3 0 009.5 12c0 .285.04.56.115.825m1.85-4.425a3 3 0 014.25 4.25m-6.375-6.375L3.125 6.125m17.75 11.75L6.125 3.125" />
    </svg>
);

export const VerifiedBadgeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a.75.75 0 00-1.06-1.06L9 10.94l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" clipRule="evenodd" />
    </svg>
);

export const DepositIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WithdrawIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const ClipboardDocumentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

export const BankIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 21h16.5M4.75 3h14.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-14.5a.75.75 0 01-.75-.75v-4.5A.75.75 0 014.75 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 9v10.5m13.5-10.5v10.5m-6.75-10.5v10.5m-3-10.5v10.5m-3.75 0h10.5" />
    </svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.2-1.768z" />
    </svg>
);

export const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-4.944c3.924 0 7.423 1.983 9.444 4.944a12.02 12.02 0 00-3.04-12.336z" />
    </svg>
);

export const ChartBarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

export const ShoppingBagIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

export const MapPinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const XCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const LockClosedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const DevicePhoneMobileIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

export const FingerprintIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.058 0 .117.002.175.005a3.999 3.999 0 014.33 4.495A4 4 0 118.5 11.5a1 1 0 012 0 2 2 0 104 0c0-1.103-.897-2-2-2h-1a1 1 0 01-1-1 3 3 0 013-3 2 2 0 100-4 4 4 0 00-4 4 1 1 0 11-2 0 6 6 0 016-6 4 4 0 110 8 1 1 0 01-1 1h-1z" />
    </svg>
);

export const IdentificationIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4m-9 6h4m-4 4h4m2 0h4m-6 4h.01M17 12h.01" />
    </svg>
);

export const NetworkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m4.632 2.684c.202.404.316.86.316 1.342s-.114.938-.316 1.342M9 3v.01M15 3v.01M9 21v-.01M15 21v-.01M4.22 8.307l.006-.006M19.78 8.307l-.006-.006M4.22 15.693l.006.006M19.78 15.693l-.006.006M12 9a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
);

export const GlobeAltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.343a9.012 9.012 0 0110.592 0M7.704 19.657a9.012 9.012 0 0010.592 0" />
    </svg>
);

export const LightBulbIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const ScaleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

export const DocumentCheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" transform="scale(0.8) translate(3, 3)" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 012 2h2a2 2 0 012-2m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v2" />
    </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const PlusCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const VisaIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1000" height="323" viewBox="0 0 1000 323"><path fill="#1A1F71" d="M754.7 35.2h-74.2l-98.3 252.1h80.1l17.7-47.5h85.3l10.9 47.5h75.2L754.7 35.2zm-42.6 156.9l32.3-94.6 22.8 94.6h-55.1zM928.3 35.2l-64.6 179.8-67.4-179.8h-78.2l111.4 252.1h82.5l109.2-252.1z"/><path fill="#1A1F71" d="M386 161.4c0-43.2-23.4-69.5-63.5-69.5-40.6 0-61.9 26.3-61.9 69.5 0 43.1 21.3 69.5 61.9 69.5 40.1 0 63.5-26.4 63.5-69.5zm-88.9 0c0-24.5 10.9-39.7 25.4-39.7 14.3 0 25.1 15.2 25.1 39.7 0 24.4-10.8 39.7-25.1 39.7-14.5 0-25.4-15.3-25.4-39.7zM425.2 92.2c-12 0-20.9 5.8-25.1 11.2l-2.8-9.1h-56.1v193h60.8V176c0-15.6 7.2-24.2 19-24.2 10.1 0 16.5 6.2 16.5 21.3v114.2h60.8V155c0-33.9-19.1-58.4-52.2-58.4-1.2 0-2.4 0-3.6 0zM229.7 35.2L162 287.3h60.8l67.7-252.1zM0 35.2l62.2 252.1h60.8L64.8 35.2H0z"/></svg>
);

export const MastercardIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 227">
        <path fill="#FF5F00" d="M384 113.5c0 62.7-51 113.5-113.5 113.5S157 176.2 157 113.5 208 0 270.5 0 384 50.8 384 113.5z"/>
        <path fill="#EB001B" d="M157 113.5c0 62.7-51 113.5-113.5 113.5S-27 176.2-27 113.5 24 0 86.5 0 157 50.8 157 113.5z"/>
        <path fill="#F79E1B" d="M125.1 113.5c0 40.5 16.9 76.8 43.8 102.2 26.9-25.4 43.8-61.7 43.8-102.2S195.8 36.7 169 11.3c-26.9 25.5-43.8 61.8-43.8 102.2z"/>
    </svg>
);

export const BtcIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.75 14.25h-1.5v2h-1.5v-2h-2.5v-1.5h2.5v-7h-2.5v-1.5h2.5v-2h1.5v2h1.5v1.5h-1.5v7h1.5v1.5zm-2.25-8.5h-1.5v5h1.5v-5z"/>
    </svg>
);

export const EthIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.22 15.75l-4.22-2.54 4.22-6.46 4.22 6.46-4.22 2.54zm.01-8.03L8 12.25l4.23 2.54 4.23-2.54L12.23 9.72z"/>
    </svg>
);

export const ApxIcon = ({ className }: { className?: string }) => (
    <ApexBankLogo />
);

export const AppleIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 12.2c-.1-2.1 1.6-3.4 1.8-3.5-.1-.1-1.3-1.1-3.3-1.1-1.6 0-3.1 1-3.9 1-.8 0-2.1-.9-3.5-.9-1.9 0-3.6 1.1-4.6 2.8-.9 1.7-1.3 4.2-.1 6.3.8 1.9 2.2 3.5 3.9 3.5 1.5 0 2.3-.9 3.8-.9s2.3.9 3.8.9c1.7 0 3-1.5 3.9-3.3.5-1 .7-2.1.1-3.3zm-3.2-6.6c.9-.9 1.4-2.1 1.3-3.2-.1.1-1.2 1-2.4 1.9-.9.8-1.6 2-1.5 3.1 1.2.2 2.2-.1 2.6-1.8z"/>
    </svg>
);

export const UberIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 12.3c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-2.7-2.7v5.4c0 .6-.4 1-1 1s-1-.4-1-1v-5.4l-2.7 2.7c-.2.2-.5.3-.8.3s-.6-.1-.8-.3c-.4-.4-.4-1.2 0-1.6l4.5-4.5c.4-.4 1.2-.4 1.6 0l4.5 4.5c.4.4.4 1.2 0 1.6z"/>
    </svg>
);

export const StarbucksIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z"/>
    </svg>
);

export const ArrowsRightLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-4.5-12L21 9m0 0L16.5 4.5M21 9H3" />
  </svg>
);

export const GlobeAmericasIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.646 15.354A9 9 0 0115.354 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 00-8.354-5.646z" />
    </svg>
);

export const CalendarDaysIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const CheckBadgeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const bankIconMap: { [key: string]: React.FC<{ className?: string }> } = {
  'chase': ({ className }) => <svg className={className} viewBox="0 0 100 100"><path fill="#117ACA" d="M50 0L0 25v50l50 25 50-25V25L50 0zm0 10l40 20v40L50 90 10 70V30L50 10z"/><path fill="#117ACA" d="M50 15L20 30v40l30 15 30-15V30L50 15zm0 10l20 10v20L50 65 30 55V35l20-10z"/></svg>,
  'america': ({ className }) => <svg className={className} viewBox="0 0 100 100"><path fill="#E31837" d="M0 25h100v50H0z"/><path fill="#FFFFFF" d="M0 25h33v50H0zM67 25h33v50H67z"/><path fill="#002868" d="M33 25h34v50H33z"/></svg>,
  'wells': ({ className }) => <svg className={className} viewBox="0 0 100 100"><path fill="#D71E28" d="M50 5l10 20h21l-17 12 6 22-19-14-19 14 6-22-17-12h21z"/></svg>,
  'default': BankIcon,
};

export const getBankIcon = (bankName: string) => {
    const lowerBankName = bankName.toLowerCase();
    if (lowerBankName.includes('chase')) return bankIconMap['chase'];
    if (lowerBankName.includes('america')) return bankIconMap['america'];
    if (lowerBankName.includes('wells fargo')) return bankIconMap['wells'];
    return bankIconMap['default'];
};
// FIX: Add the missing StarIcon component.
export const StarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);
// --- Start of newly added icons for Welcome.tsx ---
export const LicensedPartnerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-4.944c3.924 0 7.423 1.983 9.444 4.944a12.02 12.02 0 00-3.04-12.336z" />
    </svg>
);
export const DataEncryptionIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
export const ComplianceIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
export const FundsProtectedIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
export const PlaidLogoIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg"><path d="M46 23c0 12.703-10.297 23-23 23S0 35.703 0 23 10.297 0 23 0s23 10.297 23 23Z" fill="#000"/><path d="M23 41.25c-1.125 0-2.25-.094-3.375-.188a18.156 18.156 0 0 1-10.594-5.25c-1.406-1.406-2.625-2.906-3.656-4.594a18.234 18.234 0 0 1-2.156-6.468c-.188-1.5-.281-3-.281-4.5s.094-3 .281-4.5a18.156 18.156 0 0 1 5.812-11.063c1.406-1.406 2.906-2.531 4.594-3.468a18.156 18.156 0 0 1 6.469-2.063c1.5-.188 3-.281 4.5-.281s3 .094 4.5.281a18.156 18.156 0 0 1 11.063 5.72c1.406 1.405 2.531 2.905 3.469 4.593a18.156 18.156 0 0 1 2.063 6.468c.188 1.5.281 3 .281 4.5s-.094 3-.281 4.5a18.156 18.156 0 0 1-5.72 11.063c-1.405 1.406-2.905 2.625-4.593 3.656a18.156 18.156 0 0 1-6.468 2.157c-1.5.187-3 .28-4.5.28Z" fill="url(#a)"/><defs><linearGradient id="a" x1="4.75" x2="41.25" y1="4.75" y2="41.25" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>
);
export const FdicInsuredIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="#000"/><text x="50" y="60" fill="#fff" text-anchor="middle" style={{fontFamily: 'serif', fontSize: '40px', fontWeight: 'bold'}}>FDIC</text></svg>
);
export const PciDssIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="#002f6c"/><text x="50" y="60" fill="#fff" text-anchor="middle" style={{fontFamily: 'sans-serif', fontSize: '30px', fontWeight: 'bold'}}>PCI DSS</text></svg>
);
export const Soc2Icon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="#fff" stroke="#000" stroke-width="2"/><text x="50" y="60" fill="#000" text-anchor="middle" style={{fontFamily: 'sans-serif', fontSize: '40px', fontWeight: 'bold'}}>SOC 2</text></svg>
);
export const LightningBoltIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
export const ServerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
);
export const EnvelopeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
export const FaceIdIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.058 0 .117.002.175.005a3.999 3.999 0 014.33 4.495A4 4 0 118.5 11.5a1 1 0 012 0 2 2 0 104 0c0-1.103-.897-2-2-2h-1a1 1 0 01-1-1 3 3 0 013-3 2 2 0 100-4 4 4 0 00-4 4 1 1 0 11-2 0 6 6 0 016-6 4 4 0 110 8 1 1 0 01-1 1h-1z" />
    </svg>
);
export const WifiIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13a7 7 0 0114 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10a11 11 0 0118 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 7a15 15 0 0122 0" />
    </svg>
);
export const TvIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v2m6-2v2m-6-6h6M3 3h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
);
export const SatelliteDishIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75a18.75 18.75 0 0116.5 0M4.5 9.75a15 15 0 0115 0M6 15.75a10.5 10.5 0 0112 0m-9.75 4.5h7.5" />
    </svg>
);
export const PiggyBankIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11.25V13.5m0-6.75V4.5m0 12V18m-7.5-3.75h15M6.375 7.5h11.25m-11.25 9h11.25M3 9a9 9 0 0118 0v6a9 9 0 01-18 0V9z" />
    </svg>
);
export const BuildingOfficeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18h12M6 18V9.75a2.25 2.25 0 012.25-2.25h3.5a2.25 2.25 0 012.25 2.25V18M6 18h.01M9 18h.01M12 18h.01M15 18h.01M18 18h.01M12 6.75V4.5m0 2.25a2.25 2.25 0 01-2.25-2.25V4.5A2.25 2.25 0 0112 2.25v0A2.25 2.25 0 0114.25 4.5v2.25A2.25 2.25 0 0112 9v0A2.25 2.25 0 019.75 6.75v0z" />
    </svg>
);
export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.41-1.437a.5.5 0 01.98 0l.41 1.437 1.437.41a.5.5 0 010 .98l-1.437.41-.41 1.437a.5.5 0 01-.98 0l-.41-1.437-1.437-.41a.5.5 0 010-.98l1.437-.41z" />
    </svg>
);
export const ComputerDesktopIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
export const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
export const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CubeTransparentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M12 17.5v-2.5m2-1l2-1m-2 1l-2-1m6-3l-4 2.5l-4-2.5l4-2.5l4 2.5zM12 2.5L8 5l4 2.5L16 5l-4-2.5zM4 9.5l4 2.5l4-2.5l-4-2.5L4 9.5z" />
    </svg>
);

export const AppleWalletIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7V9.5C20 10.88 18.88 12 17.5 12H6.5C5.12 12 4 10.88 4 9.5V7C4 5.62 5.12 4.5 6.5 4.5H17.5C18.88 4.5 20 5.62 20 7Z" fill="#888"/>
        <path d="M17.5 19.5H6.5C5.12 19.5 4 18.38 4 17V13C4 12.45 4.45 12 5 12H19C19.55 12 20 12.45 20 13V17C20 18.38 18.88 19.5 17.5 19.5Z" fill="#555"/>
        <path d="M20 9.5V11.25C20 11.66 19.66 12 19.25 12H4.75C4.34 12 4 11.66 4 11.25V9.5C4 8.12 5.12 7 6.5 7H17.5C18.88 7 20 8.12 20 9.5Z" fill="#AAA"/>
        <circle cx="17.5" cy="16" r="1.5" fill="white"/>
    </svg>
);