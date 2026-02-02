import React, { useState } from 'react';
import AddDealModal from '../../components/Modals/AddDealModal';
import { Plus } from 'lucide-react';

const AssociateDeals = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDealSuccess = () => {
        // Refresh deals list if implemented
        console.log("Deal created successfully");
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#4b49ac] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3f3da0] transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add Deal
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="text-center text-slate-400">
                    <p className="text-lg font-medium">Deals content will appear here</p>
                </div>
            </div>

            <AddDealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleDealSuccess}
            />
        </div>
    );
};

export default AssociateDeals;
