import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { CREATOR_SALES_UPDATED_EVENT, readCreatorSales, summarizeCreatorSales } from "../../data/creatorEarnings";
import { formatRupees } from "../../data/creatorSubmissions";
import { readCreatorProfile } from "../../data/creatorProfile";
import { calculatePayoutBalances, CREATOR_PAYOUTS_UPDATED_EVENT, readCreatorPayoutRequests } from "../../data/creatorPayouts";
import { getUserProfile } from "../../utils/userAuth";

const EMPTY_SUMMARY = { eligibleSales: 0, grossPaise: 0, totalCreatorPaise: 0, availablePaise: 0, pendingPaise: 0, paidOutPaise: 0, platformPaise: 0 };
const EMPTY_PAYOUT_BALANCES = { availableForPayoutPaise: 0, pendingPayoutPaise: 0, totalPaidOutPaise: 0, rejectedPayoutPaise: 0 };
const STATUS_LABELS = { pending: "Pending", available: "Available", paid_out: "Paid out", refunded: "Refunded", reversed: "Reversed" };
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" });

function currentCreatorEmail() {
  return getUserProfile()?.email || readCreatorProfile().profile?.email || "";
}

export default function EarningsView() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [payoutBalances, setPayoutBalances] = useState(EMPTY_PAYOUT_BALANCES);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    let active = true;
    const refresh = () => {
      const result = readCreatorSales(currentCreatorEmail());
      const payoutResult = readCreatorPayoutRequests(currentCreatorEmail());
      if (!active) return;
      setSales(result.sales);
      const salesSummary = summarizeCreatorSales(result.sales);
      const balances = calculatePayoutBalances(result.sales, payoutResult.requests);
      setPayoutBalances(balances);
      setSummary({ ...salesSummary, availablePaise: payoutResult.available ? balances.availableForPayoutPaise : 0, paidOutPaise: balances.totalPaidOutPaise });
      setStorageError(result.error || payoutResult.error);
      setLoading(false);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CREATOR_SALES_UPDATED_EVENT, refresh);
    window.addEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refresh);
    window.addEventListener("userauth-changed", refresh);
    window.addEventListener("creator-profile-updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CREATOR_SALES_UPDATED_EVENT, refresh);
      window.removeEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refresh);
      window.removeEventListener("userauth-changed", refresh);
      window.removeEventListener("creator-profile-updated", refresh);
    };
  }, []);

  const filteredSales = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const cutoff = period === "30" ? Date.now() - 30 * 86400000 : period === "90" ? Date.now() - 90 * 86400000 : 0;
    return sales.filter((sale) =>
      (!normalizedQuery || sale.templateName.toLowerCase().includes(normalizedQuery)) &&
      (status === "all" || sale.status === status) &&
      sale.timestamp >= cutoff,
    );
  }, [sales, query, status, period]);

  return <section className="creator-panel" aria-labelledby="creator-earnings-title">
    <div className="creator-panel-heading"><div><p className="eyebrow">Creator Studio</p><h2 id="creator-earnings-title">Earnings</h2><p>Sales records with the 60% creator / 40% platform gross split.</p></div></div>
    {storageError && <p className="creator-earnings-alert" role="alert">{storageError}</p>}
    <div className="creator-earnings-grid" aria-live="polite">
      <article><span>Total Creator Earnings</span><strong>{formatRupees(summary.totalCreatorPaise)}</strong><small>Retained earnings from {summary.eligibleSales} eligible sale{summary.eligibleSales === 1 ? "" : "s"}; includes paid out</small></article>
      <article><span>Available Balance</span><strong>{formatRupees(summary.availablePaise)}</strong><small>After active payout holds; excludes uncleared and paid out</small></article>
      <article><span>Pending Balance</span><strong>{formatRupees(summary.pendingPaise)}</strong><small>Awaiting settlement clearance</small></article>
      <article><span>Platform Share</span><strong>{formatRupees(summary.platformPaise)}</strong><small>40% share of eligible gross sales</small></article>
    </div>
    <p className="creator-earnings-note">Gross shares before payment fees, taxes or other deductions. Total creator earnings reconcile as available {formatRupees(summary.availablePaise)} + pending payout requests {formatRupees(payoutBalances.pendingPayoutPaise)} + uncleared sales {formatRupees(summary.pendingPaise)} + paid out {formatRupees(summary.paidOutPaise)}. Refunded and reversed sales are excluded. There is no connected payment backend; browser records are not authoritative financial data.</p>

    <div className="creator-sales-heading"><h3><CircleDollarSign size={19} aria-hidden="true" /> Sales History <span>{summary.eligibleSales} eligible</span></h3></div>
    <div className="creator-sales-filters">
      <label>Search template<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by template name" /></label>
      <label>Transaction status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="available">Available</option><option value="paid_out">Paid out</option><option value="refunded">Refunded</option><option value="reversed">Reversed</option></select></label>
      <label>Date range<select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="all">All time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
    </div>

    {loading ? <p className="creator-sales-empty" role="status">Loading sales records…</p> : storageError ? <p className="creator-sales-empty" role="alert">Sales history is unavailable until the storage issue is resolved.</p> : sales.length === 0 ? <div className="creator-sales-empty"><strong>No sales recorded yet</strong><p>When verified sales records are connected, they will appear here. Template uploads and listed prices are not counted as sales.</p></div> : filteredSales.length === 0 ? <p className="creator-sales-empty">No sales match the selected search and filters.</p> : <div className="creator-sales-table-wrap"><table className="creator-sales-table"><thead><tr><th scope="col">Template Name</th><th scope="col">Sale Date</th><th scope="col">Gross Sale Amount</th><th scope="col">Creator Share (60%)</th><th scope="col">Platform Share (40%)</th><th scope="col">Transaction Status</th></tr></thead><tbody>{filteredSales.map((sale) => <tr key={sale.id}><td>{sale.templateName}</td><td>{DATE_FORMAT.format(sale.timestamp)}</td><td>{formatRupees(sale.grossPaise)}</td><td>{formatRupees(sale.creatorPaise)}</td><td>{formatRupees(sale.platformPaise)}</td><td><span className={`creator-sale-status is-${sale.status}`}>{STATUS_LABELS[sale.status]}</span></td></tr>)}</tbody></table></div>}
  </section>;
}
