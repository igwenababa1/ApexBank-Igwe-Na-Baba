import React from 'react';

// FIX: Renamed from IShellCreditUnionLogo to ApexBankLogo to match usage across the app.
export const ApexBankLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgb(var(--color-primary-400))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(var(--color-primary-600))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g>
      <path d="M50,10 C 80,20 90,40 90,50 C 90,70 70,90 50,90 C 30,90 10,70 10,50 C 10,40 20,20 50,10 Z" fill="url(#grad1)" />
      <path d="M50,20 C 70,30 75,45 75,50 C 75,65 65,80 50,80 C 35,80 25,65 25,50 C 25,45 30,30 50,20 Z" fill="white" fillOpacity="0.3" />
      <circle cx="50" cy="38" r="6" fill="white" />
      <rect x="46" y="48" width="8" height="20" rx="4" fill="white" />
    </g>
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

export const BellIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const LogoutIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6" />
    </svg>
);

export const BankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const TagIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);

export const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const MenuIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const GlobeAmericasIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.115 5.19A9 9 0 0112 3c1.928 0 3.723.63 5.185 1.714M17.885 5.19A9 9 0 0121 12h-3m-3.885-6.81A9 9 0 0012 3v3.115m3.885 6.814a.75.75 0 01.353.97l-3.25 6.5a.75.75 0 01-1.356-.67l3.25-6.5a.75.75 0 011.003-.3zM12 21a9 9 0 01-9-9h3m3.885 6.81A9 9 0 0112 21v-3.115m-3.885-6.814a.75.75 0 01-.353-.97l3.25-6.5a.75.75 0 011.356.67l-3.25 6.5a.75.75 0 01-1.003.3z" />
    </svg>
);

export const FaceIdIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8v3.75M9 16.5V21M15 8v3.75M15 16.5V21M3 12h18M5.25 9h13.5M5.25 15h13.5" />
    </svg>
);

export const ComputerDesktopIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v.75a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75M3 9.75h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h18M5.25 3h13.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 015.25 3z" />
    </svg>
);

export const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.036-4.43 3.75 3.75 0 016.928 0 9.75 9.75 0 011.036 4.43zM16.5 18.75a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25zM7.5 18.75a2.625 2.625 0 110-5.25 2.625 2.625 0 010 5.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v5.25m0 0V21m0-1.5H9.75M12 19.5h2.25M7.5 7.5c0-1.657 3-3.75 4.5-3.75s4.5 2.093 4.5 3.75" />
    </svg>
);

export const StarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.681 3.468a1 1 0 00.951.692h3.911c.713 0 1.02 1.002.448 1.489l-3.159 2.296a1 1 0 00-.364 1.118l1.215 4.218c.226.784-.613 1.46-1.325.992l-3.56-2.58a1 1 0 00-1.176 0l-3.56 2.58c-.712.468-1.55-.208-1.325-.992l1.215-4.218a1 1 0 00-.364-1.118L2.072 8.533c-.572-.487-.265-1.489.448-1.489h3.911a1 1 0 00.951-.692l1.681-3.468z" clipRule="evenodd" />
    </svg>
);

export const ArrowsRightLeftIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-4.5-9L21 12m0 0l-4.5 4.5M21 12H3" />
    </svg>
);

export const CubeTransparentIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25l9-5.25" />
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.188-.398a2.25 2.25 0 001.423-1.423l.398-1.188.398 1.188a2.25 2.25 0 001.423 1.423l1.188.398-1.188.398a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export const CertificateIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.6-3.751A11.959 11.959 0 0112 2.714z" />
  </svg>
);

export const AirplaneTicketIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m0 0h1.5m9 1.5l-3.75-3.75M12 12.75l-3.75 3.75M12 12.75V15m0-.75V9m3 3.75l3.75-3.75M12 12.75l3.75 3.75M12 12.75V15m0-.75V9" />
    </svg>
);

export const ArrowLongRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
    </svg>
);

export const FireIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.23 8.23 0 0115.362 5.214z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75a7.5 7.5 0 0015 0c0-1.844-.828-3.536-2.185-4.685A7.5 7.5 0 0012 6.75a7.5 7.5 0 00-5.315 2.315A7.488 7.488 0 004.5 12.75z" />
    </svg>
);

export const WaterDropIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-3.75-2.25-6-5.25-6-9C6 6.336 8.686 3.75 12 3.75s6 2.586 6 6c0 3.75-2.25 6.75-6 9z" />
    </svg>
);

export const WrenchScrewdriverIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.636 4.636a2.121 2.121 0 01-3 3L3 17.25a2.121 2.121 0 013-3l4.636-4.636m0 0l2.496-3.03c.317-.384.74-.664 1.208-.766m-1.208.766L9.153 5.25a2.121 2.121 0 00-3-3L3 5.25a2.121 2.121 0 003 3l4.636 4.636" />
    </svg>
);

export const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.14-2.72a3 3 0 00-4.682 2.72 9.094 9.094 0 003.741.479m7.14-2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m-7.14 2.72a3 3 0 01-4.682 2.72 9.094 9.094 0 013.741-.479M12 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const BtcIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.12 12.33c.33.64-.04 1.38-.72 1.58-.19.05-.39.07-.58.05h-1.63v2.04c0 .55-.45 1-1 1s-1-.45-1-1v-2.04h-1.3c-.55 0-1-.45-1-1s.45-1 1-1h1.3v-3.3h-1.3c-.55 0-1-.45-1-1s.45-1 1-1h1.3V7c0-.55.45-1 1-1s1 .45 1 1v2.02h1.63c.68.21 1.05.95.72 1.58l-1.02 2.03-2.3-1.15.51-1.02H10.7v3.3h2.32l.51-1.02 2.59 1.3z" />
    </svg>
);
export const EthIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.12 15.69l-4.24-2.45v-4.9l4.24 2.45v4.9zm0-6.1l-4.24-2.45 4.24-2.45 4.24 2.45-4.24 2.45zm.25 6.1v-4.9l4.24-2.45v4.9l-4.24 2.45z" />
    </svg>
);
export const ShellIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.346 1.01 4.464 2.634 5.938.16.146.33.284.506.412A8.008 8.008 0 0012 20a8.008 8.008 0 006.86-3.65c.176-.128.347-.266.507-.412C18.99 16.464 20 14.346 20 12z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a2 2 0 100-4 2 2 0 000 4z"></path>
    </svg>
);
export const WifiIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556A5.5 5.5 0 0112 15c1.472 0 2.822.55 3.889 1.556M4.444 12.889A9.5 9.5 0 0112 11c2.5 0 4.8.956 6.556 2.889M12 19h.01"></path>
    </svg>
);
export const HomeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
export const MastercardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" fill="none" role="img" aria-labelledby="pi-mastercard">
    <circle cx="12" cy="12" r="12" fill="#EA001B"/>
    <circle cx="26" cy="12" r="12" fill="#F79E1B" fillOpacity=".8"/>
  </svg>
);
export const VisaIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.98 6.13H18.4V3.19a.66.66 0 00-.66-.66H15.6a.66.66 0 00-.66.66V6.13H11.8V3.19a.66.66 0 00-.66-.66h-2.1a.66.66 0 00-.66.66V6.13H1.02a1.02 1.02 0 00-1.02 1.02v9.7a1.02 1.02 0 001.02 1.02h21.96a1.02 1.02 0 001.02-1.02v-9.7a1.02 1.02 0 00-1.02-1.02zM8.42 15.34H6.05l-1.6-6.4h2.46l1.04 4.82.2.98.54-3.64.44-2.16h2.24L8.42 15.34zm8.02-4.1c0 .9-.54 1.34-1.3 1.6l-1.12.38c-.46.16-.62.3-.62.52 0 .2.18.36.5.36a2.1 2.1 0 001.3-.46l.34.82a2.8 2.8 0 01-1.84.64c-1.2 0-1.84-.52-1.84-1.4 0-.82.5-1.22 1.22-1.5l1.06-.36c.56-.2.7-.4.7-.6 0-.24-.26-.4-.6-.4a1.85 1.85 0 00-1.3.48L11.5 9.7a2.76 2.76 0 011.88-.7c1.16 0 1.8.54 1.8 1.44zm4.4-2.3h-1.6l-1.32 6.4h2.4l.28-1.5h1.56l.16 1.5h2.24L20.84 8.94zm-1.18 4.1l.54-2.82.26-1.5h.04l.26 1.5.56 2.82z"/>
    </svg>
);
export const TvIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v2a1 1 0 001 1h4a1 1 0 001-1v-2M5 12V7a2 2 0 012-2h10a2 2 0 012 2v5m-14 0h14" />
    </svg>
);
export const SatelliteDishIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-5.25l-2.522 2.522a.75.75 0 01-1.06-1.06L12 12.87l2.832-2.832a.75.75 0 111.06 1.06L13.28 14.25v5.25m3.75-6.75a.75.75 0 000-1.5h-2.25a.75.75 0 000 1.5h2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const AppleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.132 7.132c.31-.926.183-1.89-.37-2.735-.747-1.14-2-1.787-3.262-1.787-1.439 0-2.8.76-3.694 1.956-.84 1.123-1.487 2.656-1.25 4.132.027.17.054.34.08.512.082.541.223 1.07.416 1.583.183.486.394.95.63 1.39.24.44.507.86.796 1.26.33.45.69.87 1.07 1.27.48.51 1.02.94 1.6 1.31.57.36 1.18.66 1.8.89.09.03.18.06.27.09.1.03.19.06.29.09.11.03.22.06.33.08.18.04.36.07.55.1.18.03.36.05.54.06.21.02.42.03.63.03.11 0 .22 0 .33-.01.19-.01.37-.02.56-.04.18-.02.37-.05.55-.08.11-.02.22-.04.33-.06.1-.03.2-.05.29-.08.1-.03.19-.06.28-.09.6-.24 1.19-.55 1.76-.94.55-.38 1.08-.83 1.55-1.35.37-.4.72-.82 1.04-1.27.28-.4.55-.82.78-1.26.23-.44.44-.904.62-1.39.19-.51.33-1.04.41-1.58.02-.17.05-.34.07-.51.2-1.45-.44-2.95-1.25-4.08-.82-1.12-2.12-1.85-3.52-1.9zM15.02 2.1c.36-.01.72.08 1.05.25.32.18.6.43.83.74.01.01 0 .02-.01.02-.45.42-1.04.67-1.68.67-.52 0-1.01-.16-1.43-.44-.2-.13-.39-.29-.55-.47-.18-.2-.34-.43-.48-.67-.12-.22-.22-.45-.29-.69-.02-.07-.03-.13-.03-.2.29-.21.6-.36.93-.45.24-.07.48-.1.73-.1z"/>
    </svg>
);
export const AppleWalletIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1zM17.43 15.43c.12-.13.2-.28.26-.45.05-.17.08-.34.08-.52 0-.41-.14-.76-.41-1.04-.27-.29-.66-.43-1.15-.43-.51 0-.93.15-1.28.45-.33.29-.53.67-.58 1.14h3.08zm-3.23-4.33c.47-.53.8-1.2 1-2h-1.6c-.16.54-.42 1-.76 1.32-.36.33-.8.5-1.3.5-.53 0-.98-.17-1.32-.5-.34-.33-.58-.8-.7-1.4H6.5c.33 1.25.92 2.25 1.75 3 .85.74 1.9 1.12 3.15 1.12.87 0 1.63-.22 2.28-.65z" />
    </svg>
);

export const LightningBoltIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);
export const LicensedPartnerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.636 4.636a2.121 2.121 0 01-3 3L3 17.25a2.121 2.121 0 013-3l4.636-4.636m0 0l2.496-3.03c.317-.384.74-.664 1.208-.766m-1.208.766L9.153 5.25a2.121 2.121 0 00-3-3L3 5.25a2.121 2.121 0 003 3l4.636 4.636" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l1.5-1.5" />
    </svg>
);
export const DataEncryptionIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h18M3 10.5h18" />
    </svg>
);
export const ComplianceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const FundsProtectedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12" />
    </svg>
);
export const PlaidLogoIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="currentColor"/></svg>);
export const FdicInsuredIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h2v6H7V9zm4 0h2v6h-2V9zm4 0h2v6h-2V9z" fill="currentColor"/></svg>);
export const PciDssIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7v5.5C2 17.1 6.5 22 12 22s10-4.9 10-9.5V7l-10-5zm-1 15l-3.5-3.5 1.4-1.4L11 14.2l5.6-5.6L18 10l-7 7z" fill="currentColor"/></svg>);
export const Soc2Icon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-1c-.83 0-1.5-.67-1.5-1.5v-4zM12 8c-.83 0-1.5-.67-1.5-1.5S11.17 5 12 5s1.5.67 1.5 1.5S12.83 8 12 8z" fill="currentColor"/></svg>);
export const ServerIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0V10.5m13.5 3.75V10.5m-13.5 0V3.75h13.5v6.75m-13.5 0h13.5M3.75 20.25h16.5" /></svg>);
export const XSocialIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
export const LinkedInIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-11 5H5v9h3V8zm-1.5-2.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 8h-2c-1.1 0-2 .9-2 2v1h-1v2h1v4h3v-4h1.5v-2H14v-1c0-.55.45-1 1-1h2V8z" /></svg>);
export const InstagramIcon = ({ className }: { className?: string }) => (<svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-7 0c0-1.65 1.35-3 3-3s3 1.35 3 3-1.35 3-3 3-3-1.35-3-3zm6-5h-2v2h2V5z" /></svg>);
export const EnvelopeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
export const ArrowDownTrayIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
export const ArrowPathIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.182-3.182m0 0v4.992m0 0h-4.992m4.993 0l-3.181-3.182a8.25 8.25 0 00-11.667 0l-3.182 3.182" /></svg>);
export const PiggyBankIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-12 6h.008v.008H9v-.008zm.328 5.482c.196.196.45.293.707.293s.512-.098.707-.293l.354-.353a.75.75 0 10-1.06-1.06l-.354.353-.707-.707a.75.75 0 00-1.06 1.06l.707.707zm-2.122-4.416a.75.75 0 10-1.06-1.06l-.353.353-.707-.707a.75.75 0 00-1.06 1.06l.707.707.353-.353a.75.75 0 101.06 1.06l-.707-.707-.353.353a.75.75 0 101.06 1.06l.353-.353.707.707a.75.75 0 101.06-1.06l-.707-.707.353-.353zM15 6h.008v.008H15V6z" /></svg>);
export const BuildingOfficeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>);
export const PayPalIcon = ({ className }: { className?: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M8.22 6.54L6.1 16.27c-.24 1.15.54 1.63 1.35 1.63.85 0 1.25-.63 1.48-1.59.04-.15.07-.3.12-.45l.93-3.95c.1-.45.06-.63-.3-.63h-1.3c-.5 0-.6-.1-.5-.5l.48-1.89c.1-.5.05-.6-.35-.6H6.18c-.4 0-.45 0-.35-.5l.6-2.25c.1-.5 0-.6-.4-.6H4.2c-.4 0-.45.05-.35.5l2.12 9.78c.24 1.15-.54 1.63-1.35 1.63-.85 0-1.25-.63-1.48-1.59-.04-.15-.07-.3-.12-.45l-.92-3.96c-.1-.45-.06-.63.3-.63h1.3c.5 0 .6-.1.5-.5L4.1 7.1c-.1-.5-.05-.6.35-.6h1.4c.4 0 .45 0 .35.5l-.6 2.25c-.1.5 0 .6.4.6h1.42c.4 0 .45-.05.35-.5zM20 6.54L17.88 16.27c-.24 1.15.54 1.63 1.35 1.63.85 0 1.25-.63 1.48-1.59.04-.15.07-.3.12-.45l.92-3.96c.1-.45.06-.63-.3-.63h-1.3c-.5 0-.6-.1-.5-.5l.48-1.89c.1-.5.05-.6-.35-.6h-1.42c-.4 0-.45 0-.35-.5l.6-2.25c.1-.5 0-.6-.4-.6h-1.42c-.4 0-.45.05-.35-.5z"/></svg>);
export const CashAppIcon = ({ className }: { className?: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 13.5h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V7h2v2zm3 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V7h2v2zm3 6h-2v-2h2v2zm0-3h-2v-2h2v2zm0-3h-2V7h2v2z"/></svg>);
export const ZelleIcon = ({ className }: { className?: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>);
export const WesternUnionIcon = ({ className }: { className?: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z"/></svg>);
export const MoneyGramIcon = ({ className }: { className?: string }) => (<svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-4h8v-2H8v2zm0-3h8v-2H8v2zm0-3h8V8H8v2z"/></svg>);
export const PlusCircleIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
export const CalendarDaysIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>);
export const PuzzlePieceIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75a6 6 0 10-8.5 8.5 6 6 0 008.5-8.5zm-5.25 5.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75c-1.126 0-2.206-.41-3.033-1.125a3 3 0 01-1.125-3.033c0-1.126.41-2.206 1.125-3.033A3 3 0 016.75 7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75c1.126 0 2.206.41 3.033 1.125a3 3 0 011.125 3.033c0 1.126-.41 2.206-1.125 3.033a3 3 0 01-3.033 1.125" /></svg>);

// --- HELPER FUNCTIONS ---
export const getBankIcon = (bankName: string): React.ComponentType<{ className?: string }> => {
    // For this app, we'll return a generic bank icon for all banks.
    // In a real app, you could have a switch statement for major banks.
    return BankIcon;
};

export const getServiceIcon = (serviceName: string): React.ComponentType<{ className?: string, [key: string]: any }> => {
    switch(serviceName) {
        case 'PayPal': return PayPalIcon;
        case 'CashApp': return CashAppIcon;
        case 'Zelle': return ZelleIcon;
        case 'Western Union': return WesternUnionIcon;
        case 'MoneyGram': return MoneyGramIcon;
        default: return BankIcon;
    }
};

// FIX: Add missing icons
export const UberIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 13h-2v-4h-2v4H9v-5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v5z"/>
    </svg>
);

export const StarbucksIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-3.09-6.32L2.61 9.5l6.32-3.09L12 2.61l3.09 6.32L21.39 9.5l-6.32 3.09L12 17z"/>
    </svg>
);

export const ChatBubbleLeftRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72A2.25 2.25 0 019 16.5v-4.286c0-.97.616-1.813 1.5-2.097m6.75 0a2.25 2.25 0 00-2.25-2.25H9a2.25 2.25 0 00-2.25 2.25m6.75 0v.165c0 .256-.223.465-.498.465H9.498a.498.498 0 01-.498-.465v-.165m6.75 0h-6.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12.604V7.5c0-1.136.847-2.1 1.98-2.193l3.72-3.72a.75.75 0 011.06 0l3.72 3.72A2.25 2.25 0 0115 7.5v5.104" />
    </svg>
);

export const CurrencyDollarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.25 10.5c0-1.518 1.232-2.75 2.75-2.75h-2.5a.75.75 0 000 1.5h2.5a1.25 1.25 0 01-1.25 1.25H10.5a.75.75 0 000 1.5h1.5a1.25 1.25 0 011.25 1.25v.75a.75.75 0 001.5 0v-.75a2.75 2.75 0 00-2.75-2.75H11.25z" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816A4.503 4.503 0 008.625 9.75H7.5a.75.75 0 000 1.5h1.125A4.503 4.503 0 0011.25 14.184V15a.75.75 0 001.5 0v-.816A4.503 4.503 0 0015.375 11.25H16.5a.75.75 0 000-1.5h-1.125A4.503 4.503 0 0012.75 6.816V6z" clipRule="evenodd" />
    </svg>
);

export const BanknotesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-12 6h.008v.008H9v-.008zm.328 5.482c.196.196.45.293.707.293s.512-.098.707-.293l.354-.353a.75.75 0 10-1.06-1.06l-.354.353-.707-.707a.75.75 0 00-1.06 1.06l.707.707zm-2.122-4.416a.75.75 0 10-1.06-1.06l-.353.353-.707-.707a.75.75 0 00-1.06 1.06l.707.707.353-.353a.75.75 0 101.06 1.06l-.707-.707-.353.353a.75.75 0 101.06 1.06l.353-.353.707.707a.75.75 0 101.06-1.06l-.707-.707.353-.353zM15 6h.008v.008H15V6z" />
    </svg>
);

export const MapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.25l-4.5-3.75-4.5 3.75m18 0l-4.5-3.75-4.5 3.75m4.5-3.75V3.75c0-1.036-.84-1.875-1.875-1.875H5.625A1.875 1.875 0 003.75 3.75v12.75m12.75 0V3.75M9 20.25v-4.5m0-11.25h6" />
    </svg>
);

export const ListBulletIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const CrosshairsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3-3m0 0l3 3m-3-3v6m-4.5-9H5.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H9.75M9.75 3.75h4.5M9.75 20.25h4.5M4.5 9.75v4.5M20.25 9.75v4.5M9.75 20.25H5.625c-.621 0-1.125-.504-1.125-1.125v-1.5c0 .621.504 1.125 1.125 1.125H9.75M20.25 3.75H14.25M20.25 20.25H14.25" />
    </svg>
);