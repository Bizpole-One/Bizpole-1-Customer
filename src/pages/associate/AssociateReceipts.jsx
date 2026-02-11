import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import { getSecureItem } from '../../utils/secureStorage';
import { format } from 'date-fns';
import { listAssociateReceipts } from '../../api/AssociateApi';
import { useNavigate } from 'react-router-dom';

const AssociateReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReceipts, setTotalReceipts] = useState(0);
    const pageSize = 10;

    const navigate = useNavigate();

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const user = getSecureItem("partnerUser") || {};
            const AssociateID = user.id || localStorage.getItem("AssociateID");

            // We use the new API endpoint which enforces isVerified=1
            const response = await listAssociateReceipts({
                isAssociate: true,
                AssociateID: AssociateID,
                limit: pageSize,
                page: currentPage,
                search: searchTerm,
                // isVerified: true // API enforces this, but no harm sending
            });

            console.log("receipts response", response);

            if (response.success) {
                setReceipts(response.data);
                setTotalReceipts(response.total);
            }
        } catch (err) {
            console.error("fetchReceipts error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, [currentPage]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            fetchReceipts();
        }
    };

    const totalPages = Math.ceil(totalReceipts / pageSize);

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Receipts</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and track verified payments</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search receipts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4b49ac]/20 focus:border-[#4b49ac] transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={fetchReceipts} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#4b49ac] text-white rounded-xl text-sm font-medium hover:bg-[#3f3e91] transition-colors">
                        Search
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-slate-500">
                                <th className="px-4 py-4 text-center">S.No</th>
                                <th className="px-4 py-4">Payment ID</th>
                                <th className="px-4 py-4">Quote ID</th>
                                <th className="px-4 py-4 text-right">Total Amount</th>
                                <th className="px-4 py-4 text-right">Gov Fee</th>
                                <th className="px-4 py-4 text-right">Vendor Fee</th>
                                <th className="px-4 py-4 text-right">Contractor Fee</th>
                                <th className="px-4 py-4 text-right">Professional Fee</th>
                                <th className="px-4 py-4">Transaction ID</th>
                                <th className="px-4 py-4">Payment Status</th>
                                <th className="px-4 py-4">Created By</th>
                                <th className="px-4 py-4">Created At</th>
                                <th className="px-4 py-4">Transaction Date</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="14" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#4b49ac]" />
                                            <span>Loading receipts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : receipts.length === 0 ? (
                                <tr>
                                    <td colSpan="14" className="px-6 py-12 text-center text-slate-400">
                                        No receipts found
                                    </td>
                                </tr>
                            ) : (
                                receipts.map((receipt, index) => (
                                    <tr key={receipt.PaymentID} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-center text-slate-400">{(currentPage - 1) * pageSize + index + 1}</td>
                                        <td className="px-4 py-4 font-bold text-slate-700">{receipt.PaymentID}</td>
                                        <td className="px-4 py-4 text-slate-500">{receipt.QuoteCode || receipt.QuoteID}</td>
                                        <td className="px-4 py-4 text-right font-bold text-slate-800">₹{parseFloat(receipt.TotalAmount || 0).toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right text-slate-600">₹{parseFloat(receipt.GovFee || 0).toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right text-slate-600">₹{parseFloat(receipt.VendorFee || 0).toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right text-slate-600">₹{parseFloat(receipt.ContractorFee || 0).toFixed(2)}</td>
                                        <td className="px-4 py-4 text-right text-slate-600">₹{parseFloat(receipt.ProfessionalFee || receipt.ProfFee || 0).toFixed(2)}</td>
                                        <td className="px-4 py-4 text-slate-600">{receipt.TransactionID}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${(receipt.PaymentStatus || '').toLowerCase() === 'success' ? 'text-green-600' : 'text-orange-600'
                                                }`}>
                                                {receipt.PaymentStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{receipt.CreatedByName || 'N/A'}</td>
                                        <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                                            {receipt.PaymentDate ? format(new Date(receipt.PaymentDate), "dd/MM/yyyy") : "--"}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                                            {/* Assuming TransactionDate exists or using CreatedAt/PaymentDate */}
                                            {receipt.TransactionDate ? format(new Date(receipt.TransactionDate), "dd/MM/yyyy") : (receipt.PaymentDate ? format(new Date(receipt.PaymentDate), "dd/MM/yyyy") : "--")}
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                                                    Receipt
                                                </button>
                                                <button className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                                                    Download
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Showing page {currentPage} of {totalPages || 1}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === i + 1 ? 'bg-[#f59e0b] text-white' : 'hover:bg-slate-50 text-slate-600 border border-slate-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssociateReceipts;
