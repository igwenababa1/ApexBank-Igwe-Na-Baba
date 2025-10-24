import React, { useState } from 'react';
import { PayPalIcon, CashAppIcon, ZelleIcon, WesternUnionIcon, MoneyGramIcon, CheckCircleIcon } from './Icons';
import { LinkServiceModal } from './LinkServiceModal';

interface IntegrationsProps {
    linkedServices: Record<string, string>;
    onLinkService: (serviceName: string, identifier: string) => void;
}

const serviceProviders = [
    { name: 'PayPal', icon: PayPalIcon, description: 'Send money globally to any PayPal account.' },
    { name: 'CashApp', icon: CashAppIcon, description: 'Instantly send funds to a $Cashtag.' },
    { name: 'Zelle', icon: ZelleIcon, description: 'Send money directly to U.S. bank accounts.' },
    { name: 'Western Union', icon: WesternUnionIcon, description: 'Send cash for pickup at locations worldwide.' },
    { name: 'MoneyGram', icon: MoneyGramIcon, description: 'Reliable cash pickups and bank deposits.' },
];

export const Integrations: React.FC<IntegrationsProps> = ({ linkedServices, onLinkService }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');

    const handleLinkClick = (serviceName: string) => {
        setSelectedService(serviceName);
        setModalOpen(true);
    };

    const handleLink = (serviceName: string, identifier: string) => {
        onLinkService(serviceName, identifier);
        setModalOpen(false);
    };

    return (
        <>
            {modalOpen && (
                <LinkServiceModal
                    serviceName={selectedService}
                    onClose={() => setModalOpen(false)}
                    onLink={handleLink}
                />
            )}
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Integrations</h2>
                    <p className="text-sm text-slate-500 mt-1">Connect your favorite payment services to send money directly from ApexBank.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceProviders.map(service => {
                        const isLinked = linkedServices.hasOwnProperty(service.name);
                        const Icon = service.icon;
                        return (
                            <div key={service.name} className="bg-slate-200 rounded-2xl shadow-digital p-6 flex flex-col">
                                <div className="flex items-center space-x-4 mb-4">
                                    <Icon className="w-10 h-10" />
                                    <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
                                </div>
                                <p className="text-sm text-slate-600 flex-grow">{service.description}</p>
                                {isLinked ? (
                                    <div className="mt-6 flex items-center justify-center space-x-2 text-green-600 font-semibold p-3 bg-green-100 rounded-lg shadow-digital-inset">
                                        <CheckCircleIcon className="w-5 h-5"/>
                                        <span>Linked: {linkedServices[service.name]}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleLinkClick(service.name)}
                                        className="mt-6 w-full py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        Link Account
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};