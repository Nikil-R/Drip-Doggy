import { useState, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  TrendingUp,
  AlertTriangle,
  Truck,
  DollarSign,
  FileCheck,
  RotateCcw,
  Upload,
  Download,
  X,
  Plus,
  Coins,
  ShieldCheck,
  CalendarDays
} from "lucide-react";

const RS = "₹";

interface CODTransaction {
  id: string;
  customer: string;
  awb: string;
  courier: string;
  date: string;
  amount: number;
  status: "Settled" | "Courier" | "Returned";
  disputeStatus?: "None" | "Raised" | "Resolved";
  disputeReason?: string;
  reconciledAmount?: number;
  auditLog?: string[];
}

const initialCODTransactions: CODTransaction[] = [
  { id: "DD-ORD-6545", customer: "Ananya Sharma", awb: "DLV-9834213", courier: "Delhivery", date: "2026-06-22", amount: 9000, status: "Settled", disputeStatus: "None", reconciledAmount: 9000, auditLog: ["2026-06-22 10:15 - Packed and Shipped via Delhivery", "2026-06-23 14:00 - NEFT Cash Settled from Delhivery"] },
  { id: "DD-ORD-5412", customer: "Rahul Verma", awb: "BD-4569103", courier: "Blue Dart", date: "2026-06-22", amount: 6400, status: "Courier", disputeStatus: "None" },
  { id: "DD-ORD-6622", customer: "Priya Kapoor", awb: "XB-8823412", courier: "Xpressbees", date: "2026-06-22", amount: 3400, status: "Courier", disputeStatus: "None" },
  { id: "DD-ORD-6462", customer: "Arjun Mehta", awb: "DLV-9834190", courier: "Delhivery", date: "2026-06-21", amount: 10800, status: "Settled", disputeStatus: "None", reconciledAmount: 10800 },
  { id: "DD-ORD-6710", customer: "Neha Gupta", awb: "SF-3129845", courier: "Shadowfax", date: "2026-06-21", amount: 4200, status: "Courier", disputeStatus: "None" },
  { id: "DD-ORD-6832", customer: "Vikram Singh", awb: "DLV-9834012", courier: "Delhivery", date: "2026-06-21", amount: 12700, status: "Courier", disputeStatus: "Raised", disputeReason: "Courier reported weight mismatch" },
  { id: "DD-ORD-6901", customer: "Isha Patel", awb: "BD-4569089", courier: "Blue Dart", date: "2026-06-20", amount: 9000, status: "Settled", disputeStatus: "None", reconciledAmount: 9000 },
  { id: "DD-ORD-7012", customer: "Aditya Kumar", awb: "XB-8823301", courier: "Xpressbees", date: "2026-06-20", amount: 6900, status: "Settled", disputeStatus: "None", reconciledAmount: 6900 },
  { id: "DD-ORD-7123", customer: "Sanya Khanna", awb: "SF-3129701", courier: "Shadowfax", date: "2026-06-19", amount: 3900, status: "Returned", disputeStatus: "None" },
  { id: "DD-ORD-7234", customer: "Rohan Desai", awb: "DLV-9833910", courier: "Delhivery", date: "2026-06-19", amount: 8400, status: "Courier", disputeStatus: "None" },
  { id: "DD-ORD-7345", customer: "Devendra Patil", awb: "BD-4569010", courier: "Blue Dart", date: "2026-06-18", amount: 4200, status: "Settled", disputeStatus: "None", reconciledAmount: 4200 },
  { id: "DD-ORD-7456", customer: "Kiara Advani", awb: "XB-8823102", courier: "Xpressbees", date: "2026-06-18", amount: 7900, status: "Courier", disputeStatus: "None" }
];

const courierStatsInitial = [
  { partner: "Delhivery", transactions: 442, revenue: 824000, percentage: 44, color: "bg-[#224870]" },
  { partner: "Blue Dart", transactions: 245, revenue: 580000, percentage: 31, color: "bg-[#8c6239]" },
  { partner: "Xpressbees", transactions: 112, revenue: 310000, percentage: 16, color: "bg-[#717182]" },
  { partner: "Shadowfax", transactions: 43, revenue: 150000, percentage: 9, color: "bg-amber-600" }
];

function CodStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Settled: "text-green-700 bg-green-50 border-green-200",
    Courier: "text-amber-700 bg-amber-50 border-amber-200",
    Returned: "text-red-700 bg-red-50 border-red-200"
  };

  const labelMap: Record<string, string> = {
    Settled: "Settled (Bank)",
    Courier: "With Courier",
    Returned: "Returned (RTO)"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 border text-[7.5px] font-bold tracking-widest uppercase rounded-none ${styles[status] || 'text-neutral-500 bg-neutral-50 border-neutral-200'}`}>
      {labelMap[status] || status}
    </span>
  );
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<CODTransaction[]>(initialCODTransactions);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtering & Search
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals & Panels State
  const [reconcileTarget, setReconcileTarget] = useState<CODTransaction | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<CODTransaction | null>(null);
  const [auditTarget, setAuditTarget] = useState<CODTransaction | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  // Forms state
  const [reconcileCashInput, setReconcileCashInput] = useState("");
  const [disputeReasonInput, setDisputeReasonInput] = useState("");
  const [adjustmentForm, setAdjustmentForm] = useState({ orderId: "", amount: "", desc: "", courier: "Delhivery" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getKPIs = useMemo(() => {
    const totalCODVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const cashSettled = transactions.filter(t => t.status === "Settled").reduce((sum, t) => sum + t.amount, 0);
    const withCouriers = transactions.filter(t => t.status === "Courier").reduce((sum, t) => sum + t.amount, 0);
    const failedRefused = transactions.filter(t => t.status === "Returned").reduce((sum, t) => sum + t.amount, 0);

    return [
      { label: "Total COD Shipped", value: RS + totalCODVolume.toLocaleString("en-IN"), trend: "up", change: "+14.2%", subtitle: "Cumulative COD volume" },
      { label: "Cash Settled (Bank)", value: RS + cashSettled.toLocaleString("en-IN"), trend: "up", change: "+18.7%", subtitle: "Remitted to bank ledger" },
      { label: "Pending with Couriers", value: RS + withCouriers.toLocaleString("en-IN"), trend: "down", change: "-5.4%", subtitle: "Awaiting bank deposits" },
      { label: "Failed Returns (RTO)", value: RS + failedRefused.toLocaleString("en-IN"), trend: "up", change: "+2.1%", subtitle: "RTO parcel variance" }
    ];
  }, [transactions]);

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (activeTab === "Settled" && t.status !== "Settled") return false;
      if (activeTab === "Courier" && t.status !== "Courier") return false;
      if (activeTab === "Returned" && t.status !== "Returned") return false;

      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;

      const q = searchQuery.toLowerCase();
      return (
        t.customer.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.courier.toLowerCase().includes(q) ||
        t.awb.toLowerCase().includes(q)
      );
    });
  }, [transactions, activeTab, searchQuery, startDate, endDate]);

  // Reconcile collection cash submission
  const submitReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileTarget) return;

    const cashValue = Number(reconcileCashInput);
    setTransactions(prev => prev.map(t => {
      if (t.id === reconcileTarget.id) {
        const log = t.auditLog ? [...t.auditLog] : [];
        log.push(`${new Date().toISOString().split("T")[0]} - Cash Reconciled manually: ₹${cashValue.toLocaleString()} settled.`);
        return {
          ...t,
          status: "Settled",
          reconciledAmount: cashValue,
          auditLog: log
        };
      }
      return t;
    }));
    setReconcileTarget(null);
    setReconcileCashInput("");
  };

  // Submit dispute handler
  const submitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeTarget) return;

    setTransactions(prev => prev.map(t => {
      if (t.id === disputeTarget.id) {
        const log = t.auditLog ? [...t.auditLog] : [];
        log.push(`${new Date().toISOString().split("T")[0]} - Dispute Raised: ${disputeReasonInput}`);
        return {
          ...t,
          disputeStatus: "Raised",
          disputeReason: disputeReasonInput,
          auditLog: log
        };
      }
      return t;
    }));
    setDisputeTarget(null);
    setDisputeReasonInput("");
  };

  // Submit adjustment entry
  const submitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const adjustVal = Number(adjustmentForm.amount);
    const newTx: CODTransaction = {
      id: adjustmentForm.orderId.trim() || `DD-ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: "Admin Adjustment",
      awb: "ADJ-NONE",
      courier: adjustmentForm.courier,
      date: new Date().toISOString().split("T")[0],
      amount: adjustVal,
      status: "Settled",
      disputeStatus: "None",
      reconciledAmount: adjustVal,
      auditLog: [`Adjustment posted: ${adjustmentForm.desc}`]
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAdjustmentOpen(false);
    setAdjustmentForm({ orderId: "", amount: "", desc: "", courier: "Delhivery" });
  };

  // CSV Statement import parser simulation
  const handleBankCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTransactions(prev => prev.map(t => {
          if (t.status === "Courier" && Math.random() > 0.4) {
            return {
              ...t,
              status: "Settled",
              reconciledAmount: t.amount,
              auditLog: [...(t.auditLog || []), "Settled automatically via bank statement import."]
            };
          }
          return t;
        }));
      };
      reader.readAsText(files[0]);
    }
  };

  // Export CSV settlement ledger report
  const handleExportCSV = () => {
    const headers = ["Order ID,Customer,AWB,Courier,Date,Amount Billed,Status,Dispute,Settled Amount"];
    const rows = filteredTransactions.map(t => `"${t.id}","${t.customer}","${t.awb}",${t.courier},${t.date},${t.amount},${t.status},${t.disputeStatus || "None"},${t.reconciledAmount || 0}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cod-settlements-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#224870]" /> Payments Ledger
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Monitor Cash on Delivery collections, courier deposits, and bank settlements
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleBankCSVImport} accept=".csv" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[#615e56] text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> Import Statement
          </button>
          <button 
            onClick={() => setIsAdjustmentOpen(true)} 
            className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Manual Entry
          </button>
        </div>
      </div>

      {/* Remittance Alert Warning */}
      {transactions.filter(t => t.status === "Returned").length > 0 && (
        <div className="bg-red-50 border border-red-200/60 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-widest">RTO Reconciliation Action Required</h4>
            <p className="text-[9px] text-red-700 font-bold uppercase tracking-wider mt-1">
              There are failed courier parcel remittances. Courier fees for RTO (Return to Origin) must be audited within 7 business days to dispute charge penalties.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards (Matches Dashboard style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getKPIs.map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{stat.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{stat.value}</span>
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 border rounded-sm whitespace-nowrap ${stat.trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {stat.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5 rotate-180" />}
                {stat.change}
              </span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Workspace split columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Ledger Table */}
        <div className="lg:col-span-9 bg-card border border-neutral-200/80 p-5 space-y-4">
          
          <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-200/60">
            <div>
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase block">COD Settlement Ledger</span>
              <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-0.5">{filteredTransactions.length} items matching</p>
            </div>
            <button 
              onClick={handleExportCSV} 
              className="bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[#615e56] text-[8.5px] font-bold uppercase px-3 py-1.5 cursor-pointer rounded-none transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export Ledger
            </button>
          </div>

          {/* Filters Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            
            {/* Status Tabs */}
            <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5 flex-wrap">
              {["All", "Settled", "Courier", "Returned"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-[8.5px] font-bold uppercase tracking-widest border-none cursor-pointer rounded-full transition-all ${
                    activeTab === tab ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Date range picker */}
            <div className="flex items-center gap-1.5 border border-neutral-200 px-2.5 py-1.5 bg-card rounded-sm flex-wrap">
              <CalendarDays className="h-3.5 w-3.5 text-[#615e56] shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-[9.5px] font-bold uppercase tracking-wider focus:outline-none w-[100px] text-[#382d24]"
              />
              <span className="text-[10px] text-neutral-300 font-bold">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-[9.5px] font-bold uppercase tracking-wider focus:outline-none w-[100px] text-[#382d24]"
              />
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(""); setEndDate(""); }} className="bg-transparent border-none text-neutral-400 hover:text-[#382d24] cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search AWB, Order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-neutral-200 pl-9 pr-3 py-2 text-[9.5px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#224870] placeholder-neutral-300 w-full rounded-none transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider divide-y divide-neutral-100">
              <thead>
                <tr className="border-b border-neutral-200 bg-card/60 text-[9.5px] text-[#615e56] tracking-[0.15em] font-black">
                  <th className="p-3 font-bold">Order Details</th>
                  <th className="p-3 font-bold">AWB / Courier</th>
                  <th className="p-3 font-bold">Date</th>
                  <th className="p-3 font-bold">Gross Amount</th>
                  <th className="p-3 font-bold">Reconciled</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-100/50 transition-colors">
                    <td className="p-3">
                      <div className="font-black text-[#224870] text-[11px] whitespace-nowrap tracking-wide">{tx.id}</div>
                      <span className="text-[10px] text-[#615e56] font-bold uppercase tracking-wider block mt-1">{tx.customer}</span>
                    </td>
                    <td className="p-3 text-[#382d24]">
                      <div className="font-mono text-[10px] font-bold">{tx.awb}</div>
                      <span className="text-[8px] text-[#615e56] font-semibold block mt-0.5">{tx.courier}</span>
                    </td>
                    <td className="p-3 text-neutral-500 font-mono text-[9.5px]">{tx.date}</td>
                    <td className="p-3 font-black text-[#382d24] text-[11px]">{RS}{tx.amount.toLocaleString()}</td>
                    <td className="p-3 font-black text-green-700 text-[11px]">
                      {tx.reconciledAmount ? `${RS}${tx.reconciledAmount.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <CodStatusBadge status={tx.status} />
                        {tx.disputeStatus === "Raised" && (
                          <span className="text-[6.5px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 uppercase tracking-widest block text-center rounded-sm">
                            Disputed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setReconcileTarget(tx)} 
                          className="text-[8px] font-bold border border-neutral-200 hover:border-[#224870] hover:text-[#224870] px-2 py-1 uppercase bg-card tracking-wider cursor-pointer rounded-sm transition-all"
                        >
                          Settle
                        </button>
                        <button 
                          onClick={() => setDisputeTarget(tx)} 
                          className="text-[8px] font-bold border border-neutral-200 hover:border-red-500 hover:text-red-600 px-2 py-1 uppercase bg-card tracking-wider cursor-pointer rounded-sm transition-all"
                        >
                          Dispute
                        </button>
                        <button 
                          onClick={() => setAuditTarget(tx)} 
                          className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-1.5 cursor-pointer bg-transparent border-none rounded-sm transition-all"
                          title="View audit logs"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Courier Partner Share Analytics */}
        <div className="lg:col-span-3 bg-card border border-neutral-200/80 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Courier Account Shares</span>
            <Truck className="w-4 h-4 text-[#224870]" />
          </div>

          <div className="space-y-4">
            {courierStatsInitial.map((cs, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-[9.5px] uppercase tracking-wider font-bold">
                  <span className="text-[#382d24]">{cs.partner}</span>
                  <span className="text-[#382d24]">{RS}{cs.revenue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-neutral-400 font-bold uppercase">
                  <span>{cs.transactions.toLocaleString()} parcels</span>
                  <span>{cs.percentage}% share</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-none overflow-hidden">
                  <div className={`h-full ${cs.color} transition-all`} style={{ width: `${cs.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200/60 pt-4 text-[9px] font-bold tracking-wider text-[#615e56] uppercase space-y-2">
            <div className="flex justify-between">
              <span>Last Cash Audit:</span>
              <span className="text-[#382d24] font-black">22 Jun 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Ledger Cycle:</span>
              <span className="text-[#382d24] font-black">Weekly (NEFT remitted)</span>
            </div>
            <div className="flex justify-between items-center gap-1.5">
              <span>Ledger Secure Guarantee:</span>
              <span className="text-[#224870] font-black flex items-center gap-0.5"><ShieldCheck className="w-3.5 h-3.5 text-green-700" /> Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Reconcile Cash Modal ─────────────────────────────────────── */}
      {reconcileTarget && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setReconcileTarget(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Reconcile Cash Remittance</span>
              <button onClick={() => setReconcileTarget(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitReconciliation} className="space-y-4">
              <div className="text-[9px] font-bold uppercase text-neutral-500 space-y-1 bg-neutral-50 p-3 border border-neutral-200/60">
                <div>Order Ref: <span className="text-[#382d24] font-black">{reconcileTarget.id}</span></div>
                <div>AWB: <span className="text-[#382d24] font-mono font-black">{reconcileTarget.awb}</span></div>
                <div>Gross Amount: <span className="text-[#382d24] font-black">{RS}{reconcileTarget.amount}</span></div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1.5">Actual Cash Remitted ({RS})</label>
                <input 
                  required 
                  type="number" 
                  value={reconcileCashInput} 
                  onChange={e => setReconcileCashInput(e.target.value)} 
                  placeholder={reconcileTarget.amount.toString()} 
                  className="w-full bg-card border border-neutral-200 text-[10px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button type="button" onClick={() => setReconcileTarget(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-all">Submit Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dispute Modal ────────────────────────────────────────────── */}
      {disputeTarget && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDisputeTarget(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Raise Courier Dispute</span>
              <button onClick={() => setDisputeTarget(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitDispute} className="space-y-4">
              <div className="text-[9px] font-bold uppercase text-neutral-500 bg-neutral-50 p-3 border border-neutral-200/60">
                Courier: <span className="text-[#382d24] font-black">{disputeTarget.courier}</span> | AWB: <span className="text-[#382d24] font-mono font-black">{disputeTarget.awb}</span>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1.5">Dispute Reason Details</label>
                <select name="reason" className="w-full bg-card border border-neutral-200 text-[10px] font-bold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] mb-2.5 transition-all">
                  <option value="Amount Mismatch">Amount Mismatch / Remittance Mismatch</option>
                  <option value="Fake Delivery Attempt">Fake Delivery Attempt / Refused False report</option>
                  <option value="Weight Mismatch">Parcel Weight Mismatch Variance</option>
                </select>
                <textarea 
                  required 
                  rows={3} 
                  value={disputeReasonInput} 
                  onChange={e => setDisputeReasonInput(e.target.value)} 
                  placeholder="Type details of mismatch variance..." 
                  className="w-full bg-card border border-neutral-200 text-[10px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button type="button" onClick={() => setDisputeTarget(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-all">File Dispute</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Audit Timeline Log Details ───────────────────────────────── */}
      {auditTarget && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setAuditTarget(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Audit Ledger Timeline</span>
              <button onClick={() => setAuditTarget(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-[9px] font-bold uppercase text-neutral-500 space-y-1 bg-neutral-50 p-3 border border-neutral-200/60">
                <div>Order reference: <span className="text-[#382d24] font-black">{auditTarget.id}</span></div>
                <div>Courier partner: <span className="text-[#382d24] font-black">{auditTarget.courier} ({auditTarget.awb})</span></div>
                <div>Variance amount: <span className="text-red-700 font-black">{RS}{auditTarget.amount - (auditTarget.reconciledAmount || 0)}</span></div>
              </div>

              {/* Timeline layout */}
              <div className="border border-neutral-200 p-4 bg-card max-h-48 overflow-y-auto space-y-3">
                {auditTarget.auditLog && auditTarget.auditLog.length > 0 ? (
                  auditTarget.auditLog.map((log, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-[8.5px] font-mono leading-relaxed text-neutral-500 border-l-2 border-[#224870]/20 pl-3 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#224870] absolute -left-[6px] top-1" />
                      <div>{log}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-[9px] text-neutral-400 uppercase font-bold text-center">No settlement logs found. Remittance currently {auditTarget.status}.</div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-neutral-100 pt-4">
              <button onClick={() => setAuditTarget(null)} className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-none border-none transition-all">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Manual Adjustment Modal ──────────────────────────────────── */}
      {isAdjustmentOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsAdjustmentOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Post Manual Cash Entry</span>
              <button onClick={() => setIsAdjustmentOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitAdjustment} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Order / Tx ID Ref (Optional)</label>
                <input type="text" placeholder="e.g. DD-ORD-ADJUST" value={adjustmentForm.orderId} onChange={e => setAdjustmentForm({ ...adjustmentForm, orderId: e.target.value })} className="w-full bg-card border border-neutral-200 text-[10px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Adjustment Amount (₹)</label>
                  <input required type="number" placeholder="e.g. -250" value={adjustmentForm.amount} onChange={e => setAdjustmentForm({ ...adjustmentForm, amount: e.target.value })} className="w-full bg-card border border-neutral-200 text-[10px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Courier Partner</label>
                  <select value={adjustmentForm.courier} onChange={e => setAdjustmentForm({ ...adjustmentForm, courier: e.target.value })} className="w-full bg-card border border-neutral-200 text-[10px] font-bold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                    <option value="Delhivery">Delhivery</option>
                    <option value="Blue Dart">Blue Dart</option>
                    <option value="Xpressbees">Xpressbees</option>
                    <option value="Shadowfax">Shadowfax</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Adjustment Description</label>
                <textarea required rows={2} placeholder="Settle shipping fee charge variation or bank charge adjustment..." value={adjustmentForm.desc} onChange={e => setAdjustmentForm({ ...adjustmentForm, desc: e.target.value })} className="w-full bg-card border border-neutral-200 text-[10px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button type="button" onClick={() => setIsAdjustmentOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Post Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
