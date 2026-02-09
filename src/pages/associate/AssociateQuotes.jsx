import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, Eye, Download, Plus, Pencil, Trash2 } from 'lucide-react';
import { getSecureItem } from '../../utils/secureStorage';
import { format } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';

const AssociateQuotes = () => {
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const user = getSecureItem("partnerUser") || {};
            const companyId = user.Companies?.[0]?.CompanyID || null;
            const AssociateID = localStorage.getItem("AssociateID");

            // Fetch quotes using the getLatestQuotes endpoint
            const response = await axiosInstance.post('/getLatestQuotes', {
                CompanyID: companyId,
                AssociateID: AssociateID,
                isAssociate: true
                // Add more filters as needed
            });
            console.log("response", response.data);

            if (response.data?.data) {
                setQuotes(response.data.data || []);
            }
        } catch (err) {
            console.error("fetchQuotes error", err);
            setError("An error occurred while fetching quotes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('draft')) return 'bg-gray-50 text-gray-600 border-gray-200';
        if (s.includes('sent')) return 'bg-blue-50 text-blue-600 border-blue-200';
        if (s.includes('approved')) return 'bg-green-50 text-green-600 border-green-200';
        if (s.includes('rejected')) return 'bg-red-50 text-red-600 border-red-200';
        return 'bg-slate-50 text-slate-600 border-slate-200';
    };

    const filteredQuotes = quotes.filter(quote =>
        quote.QuoteCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.QuoteName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Quotes</h1>
                    <p className="text-sm text-slate-500 mt-1">View and manage your quotes</p>
                </div>
                <button
                    onClick={() => navigate('/associate/deals')}
                    className="flex items-center gap-2 bg-[#4b49ac] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#3f3da0] transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Quote from Deal
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search quotes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4b49ac]/20 focus:border-[#4b49ac] transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">

                        {/* HEADER */}
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                                <th className="px-4 py-3">S.No</th>
                                <th className="px-4 py-3">Quote ID</th>
                                <th className="px-4 py-3">Quote Date</th>
                                <th className="px-4 py-3">Company Name</th>
                                <th className="px-4 py-3">Primary Customer</th>
                                <th className="px-4 py-3">Origin</th>
                                <th className="px-4 py-3">Services Type</th>
                                <th className="px-4 py-3">Quote Cre</th>
                                <th className="px-4 py-3">Quote Value</th>
                                <th className="px-4 py-3">Quote Status</th>
                                <th className="px-4 py-3">IsApproved</th>
                                <th className="px-4 py-3">Ageing</th>
                                <th className="px-4 py-3">Created By</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-slate-200">

                            {filteredQuotes.map((quote, index) => (
                                <tr
                                    key={quote.QuoteID}
                                    className="hover:bg-slate-50 transition"
                                >

                                    <td className="px-4 py-3">{index + 1}</td>

                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        {quote.QuoteCode}
                                    </td>

                                    <td className="px-4 py-3">
                                        {format(new Date(quote.QuoteDate), "dd/MM/yyyy")}
                                    </td>

                                    <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                                        {quote.CompanyName}
                                    </td>

                                    <td className="px-4 py-3 text-blue-600 underline cursor-pointer">
                                        {quote.PrimaryCustomer}
                                    </td>

                                    <td className="px-4 py-3">{quote.Origin || "-"}</td>

                                    <td className="px-4 py-3">{quote.ServiceType}</td>

                                    <td className="px-4 py-3">{quote.CreatedBy}</td>

                                    <td className="px-4 py-3 font-medium">
                                        ₹{Number(quote.TotalAmount).toLocaleString("en-IN")}
                                    </td>

                                    {/* STATUS BADGE */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-md ${quote.QuoteStatus === "Draft"
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-emerald-100 text-emerald-700"
                                                }`}
                                        >
                                            {quote.QuoteStatus}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {quote.IsApproved ? "Yes" : "No"}
                                    </td>

                                    <td className="px-4 py-3">{quote.AgeingDays}</td>

                                    <td className="px-4 py-3">{quote.CreatedBy}</td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-md">
                                                <Pencil className="w-4 h-4 text-slate-600" />
                                            </button>

                                            <button className="p-2 bg-red-50 hover:bg-red-100 rounded-md">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Footer/Pagination */}
                {!loading && filteredQuotes.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900">{filteredQuotes.length}</span> quotes
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50" disabled>
                                Prev
                            </button>
                            <button className="px-3 py-1.5 bg-white text-[#4b49ac] border border-slate-200 rounded-lg text-xs font-bold shadow-sm">1</button>
                            <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssociateQuotes;
