import React, { useState } from 'react';
import { 
    ApexBankLogo, 
    GlobeAltIcon, 
    LightBulbIcon, 
    ScaleIcon, 
    ShieldCheckIcon,
    LicensedPartnerIcon,
    DataEncryptionIcon,
    ComplianceIcon,
    FundsProtectedIcon,
    PlaidLogoIcon,
    FdicInsuredIcon,
    PciDssIcon,
    Soc2Icon,
    LightningBoltIcon,
    TrendingUpIcon,
    ServerIcon
} from './Icons';
import { LoginModal } from './LoginModal';

interface WelcomeProps {
  onLogin: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-primary-50 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{children}</p>
  </div>
);

export const Welcome: React.FC<WelcomeProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <ApexBankLogo />
                <h1 className="text-2xl font-bold text-slate-800">ApexBank</h1>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign In / Create Account
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="text-center py-20 lg:py-32 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                The Future of Global Banking.
                <span className="block text-primary">Today.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
                Send money across borders with unparalleled speed, transparency, and security. Welcome to the new standard in international finance.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="mt-10 px-8 py-4 text-lg font-bold text-white bg-primary rounded-lg hover:bg-primary-600 transition-transform hover:scale-105"
              >
                Get Started for Free
              </button>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-800">Why Professionals Choose ApexBank</h2>
                  <p className="mt-3 text-slate-600">Everything you need to manage international payments with confidence.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FeatureCard icon={<GlobeAltIcon className="w-6 h-6 text-primary"/>} title="Seamless Global Transfers">
                      Move money to over 5 supported countries effortlessly. Our network is built for speed and reliability.
                  </FeatureCard>
                  <FeatureCard icon={<ScaleIcon className="w-6 h-6 text-primary"/>} title="Transparent Pricing">
                      No hidden fees. Ever. See a clear, all-inclusive fee and a guaranteed exchange rate before you send.
                  </FeatureCard>
                  <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6 text-primary"/>} title="Bank-Grade Security">
                      Your funds are protected with industry-leading security protocols and through our regulated partners.
                  </FeatureCard>
                  <FeatureCard icon={<LightBulbIcon className="w-6 h-6 text-primary"/>} title="Real Simulation UI">
                      Visually track your transfer's journey from start to finish. Know where your money is every step of the way.
                  </FeatureCard>
              </div>
            </div>
          </section>

          {/* CEO Message Section */}
          <section className="bg-white py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3 text-center">
                  <img 
                      src={`https://i.pravatar.cc/150?u=ceo`}
                      alt="Eleanor Vance, CEO of ApexBank"
                      className="w-40 h-40 rounded-full mx-auto shadow-lg"
                  />
              </div>
              <div className="md:w-2/3">
                  <blockquote className="text-xl text-slate-800 italic relative">
                  <svg className="w-16 h-16 text-primary-100 absolute -top-4 -left-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.333 8h-4.667v-4h4.667v4zM27.333 8h-4.667v-4h4.667v4zM22.667 12v12h9.333v-12h-9.333zM4.667 12v12h9.333v-12h-9.333z"></path>
                  </svg>
                  <p className="relative">"We founded ApexBank in 2024 with a simple mission: to eliminate the friction and frustration of international finance for professionals and businesses worldwide. We believe your money should move as freely and efficiently as you do."</p>
                  </blockquote>
                  <p className="mt-6 font-semibold text-slate-900">Eleanor Vance</p>
                  <p className="text-slate-600">CEO & Founder, ApexBank</p>
              </div>
            </div>
          </section>

          {/* Trust & Security Section */}
          <section className="py-20 lg:py-24 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-800">Security You Can Bank On</h2>
                  <p className="mt-3 text-slate-600 max-w-3xl mx-auto">We are committed to the highest standards of security and compliance, partnering with licensed institutions to ensure your money is always safe.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                        <LicensedPartnerIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-slate-800">Licensed & Regulated</h3>
                    <p className="text-sm text-slate-600 mt-1">Services are provided by licensed financial partners in each jurisdiction.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                        <DataEncryptionIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-slate-800">End-to-End Encryption</h3>
                    <p className="text-sm text-slate-600 mt-1">Your data and transactions are secured with AES-256 encryption.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                        <ComplianceIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-slate-800">Globally Compliant</h3>
                    <p className="text-sm text-slate-600 mt-1">We adhere to strict KYC and AML regulations to prevent fraud.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                        <FundsProtectedIcon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-slate-800">Funds Safeguarded</h3>
                    <p className="text-sm text-slate-600 mt-1">Customer funds are held in segregated accounts at top-tier banks.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Section */}
          <section className="py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800">Performance You Can Count On</h2>
                <p className="mt-3 text-slate-600 max-w-3xl mx-auto">Our infrastructure is built for speed, scale, and reliability, ensuring your financial operations run smoothly around the clock.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-slate-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
                    <LightningBoltIcon className="w-8 h-8 text-primary"/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Transfers in Minutes</h3>
                  <p className="text-sm text-slate-600 mt-2">Many of our popular transfer routes are completed in minutes, not days. Get your money where it needs to be, faster.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
                    <TrendingUpIcon className="w-8 h-8 text-primary"/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Millions Processed Securely</h3>
                  <p className="text-sm text-slate-600 mt-2">We process millions of dollars in transactions securely every day, with a proven track record of safety and success.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 mx-auto">
                    <ServerIcon className="w-8 h-8 text-primary"/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">99.99% Uptime</h3>
                  <p className="text-sm text-slate-600 mt-2">Our platform is built on resilient, highly-available infrastructure, ensuring you have access to your funds when you need them.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Partners & Certifications Section */}
          <section className="py-20 lg:py-24 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-800">Our Trusted Partners & Certifications</h2>
                  <p className="mt-3 text-slate-600 max-w-3xl mx-auto">We partner with industry leaders and adhere to global standards to ensure the integrity of our platform and the safety of your funds.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <div className="flex flex-col items-center text-center p-4">
                  <PlaidLogoIcon className="h-12 w-auto text-slate-800 filter grayscale hover:grayscale-0 transition duration-300" />
                  <p className="text-sm text-slate-600 mt-4">Securely connect your bank accounts with Plaid's industry-leading technology.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <FdicInsuredIcon className="h-12 w-auto text-slate-800 filter grayscale hover:grayscale-0 transition duration-300" />
                  <p className="text-sm text-slate-600 mt-4">Eligible funds are FDIC insured up to $250,000 through our partner banks.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <PciDssIcon className="h-12 w-auto text-slate-800 filter grayscale hover:grayscale-0 transition duration-300" />
                  <p className="text-sm text-slate-600 mt-4">PCI DSS compliance ensures your sensitive payment information is handled securely.</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <Soc2Icon className="h-12 w-auto text-slate-800 filter grayscale hover:grayscale-0 transition duration-300" />
                  <p className="text-sm text-slate-600 mt-4">SOC 2 certified infrastructure demonstrates our commitment to data security.</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-slate-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} ApexBank. All rights reserved.</p>
              <p className="mt-2">ApexBank is a financial technology company, not a bank. Banking services are provided by our licensed partners.</p>
          </div>
        </footer>
      </div>
      {isLoginModalOpen && (
        <LoginModal 
            onLogin={onLogin} 
            onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </>
  );
};