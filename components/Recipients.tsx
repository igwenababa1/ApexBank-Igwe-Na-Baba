
import React, { useState } from 'react';
import { Recipient } from '../types';
import { AddRecipientModal } from './AddRecipientModal';

interface RecipientsProps {
    recipients: Recipient[];
    addRecipient: (recipient: Omit<Recipient, 'id'>) => void;
}

export const Recipients: React.FC<RecipientsProps> = ({ recipients, addRecipient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleAddRecipient = (recipient: Omit<Recipient, 'id'>) => {
        addRecipient(recipient);
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="bg-white shadow-md rounded-lg">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Recipients</h2>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600">
                        Add Recipient
                    </button>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th scope="col" className="py-3 px-6">Name</th>
                                <th scope="col" className="py-3 px-6">Bank</th>
                                <th scope="col" className="py-3 px-6">Country</th>
                                <th scope="col" className="py-3 px-6">Account Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipients.map(r => (
                                <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                                    <td className="py-4 px-6 font-semibold text-slate-800">{r.fullName}</td>
                                    <td className="py-4 px-6 text-slate-600">{r.bankName}</td>
                                    <td className="py-4 px-6 text-slate-600">{r.country.name}</td>
                                    <td className="py-4 px-6 text-slate-600 font-mono">{r.accountNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AddRecipientModal onClose={() => setIsModalOpen(false)} onAddRecipient={handleAddRecipient} />}
        </>
    );
};
