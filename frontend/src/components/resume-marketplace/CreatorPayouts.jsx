import { useEffect, useMemo, useRef, useState } from "react";
import { CircleDollarSign, Wallet } from "lucide-react";
import { readCreatorSales } from "../../data/creatorEarnings";
import { calculatePayoutBalances, CREATOR_PAYOUTS_UPDATED_EVENT, parsePayoutAmount, readCreatorPayoutRequests, requestDemoPayout } from "../../data/creatorPayouts";
import { formatRupees } from "../../data/creatorSubmissions";
import { readCreatorProfile } from "../../data/creatorProfile";
import { getUserProfile } from "../../utils/userAuth";

const EMPTY_BALANCES = { availableForPayoutPaise: 0, pendingPayoutPaise: 0, totalPaidOutPaise: 0, rejectedPayoutPaise: 0 };
const STATUS_LABELS = { pending: "Pending", approved: "Approved", rejected: "Rejected", paid: "Paid" };
const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" });

function creatorEmail() {
  return getUserProfile()?.email || readCreatorProfile().profile?.email || "";
}

export default function CreatorPayouts() {
  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState(EMPTY_BALANCES);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [submitMessage, setSubmitMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      const email = creatorEmail();
      const salesResult = readCreatorSales(email);
      const requestResult = readCreatorPayoutRequests(email);
      if (!active) return;
      const nextBalances = calculatePayoutBalances(salesResult.sales, requestResult.requests);
      setRequests(requestResult.requests);
      setBalances(requestResult.available ? nextBalances : EMPTY_BALANCES);
      setStorageError(salesResult.error || requestResult.error);
      setLoading(false);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("userauth-changed", refresh);
    window.addEventListener("creator-profile-updated", refresh);
    window.addEventListener("creator-sales-updated", refresh);
    window.addEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener("storage", refresh);
      window.removeEventListener("userauth-changed", refresh);
      window.removeEventListener("creator-profile-updated", refresh);
      window.removeEventListener("creator-sales-updated", refresh);
      window.removeEventListener(CREATOR_PAYOUTS_UPDATED_EVENT, refresh);
    };
  }, []);

  const filteredRequests = useMemo(() => filter === "all" ? requests : requests.filter((request) => request.status === filter), [requests, filter]);

  async function submit(event) {
    event.preventDefault();
    if (submittingRef.current || loading || storageError) return;
    setAmountError("");
    setSubmitMessage(null);
    const amountPaise = parsePayoutAmount(amount);
    if (!amountPaise) {
      setAmountError("Enter a valid amount greater than ₹0.00, using up to two decimal places.");
      return;
    }
    if (amountPaise > balances.availableForPayoutPaise) {
      setAmountError(`The amount cannot exceed your available balance of ${formatRupees(balances.availableForPayoutPaise)}.`);
      return;
    }
    const confirmed = window.confirm(`Submit a payout request for ${formatRupees(amountPaise)}? No payment will be sent.`);
    if (!confirmed) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const result = await requestDemoPayout(creatorEmail(), amountPaise);
      if (!result.ok) {
        setSubmitMessage({ type: "error", text: result.error });
        return;
      }
      setAmount("");
      setSubmitMessage({ type: "success", text: `Payout request ${result.request.requestId} saved as Pending. No money was transferred.` });
      const email = creatorEmail();
      const latestSales = readCreatorSales(email);
      const latestRequests = readCreatorPayoutRequests(email);
      setRequests(latestRequests.requests);
      setBalances(calculatePayoutBalances(latestSales.sales, latestRequests.requests));
      setStorageError(latestSales.error || latestRequests.error);
    } catch {
      setSubmitMessage({ type: "error", text: "The request could not be completed. Refresh the page and try again." });
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return <div className="creator-payouts-page">
    <section className="creator-panel" aria-labelledby="creator-payout-summary-title">
      <div className="creator-panel-heading"><div><p className="eyebrow">Creator Studio</p><h2 id="creator-payout-summary-title">Payout Summary</h2><p>Balances use the same eligible sales records as Earnings.</p></div></div>
      {storageError && <p className="creator-payout-alert" role="alert">{storageError}</p>}
      <div className="creator-payout-summary" aria-live="polite">
        <article><span>Available for Payout</span><strong>{formatRupees(balances.availableForPayoutPaise)}</strong><small>Available earnings after active payout holds</small></article>
        <article><span>Pending Payout Requests</span><strong>{formatRupees(balances.pendingPayoutPaise)}</strong><small>Pending and approved requests</small></article>
        <article><span>Total Paid Out</span><strong>{formatRupees(balances.totalPaidOutPaise)}</strong><small>Recorded paid statuses only</small></article>
        <article><span>Total Rejected</span><strong>{formatRupees(balances.rejectedPayoutPaise)}</strong><small>Rejected requests release reserved funds</small></article>
      </div>
    </section>

    <div className="creator-payout-columns">
      <section className="creator-panel" aria-labelledby="creator-payout-details-title">
        <div className="creator-panel-heading"><div><h2 id="creator-payout-details-title"><Wallet size={19} aria-hidden="true" /> Payout Details</h2><p>No payout provider or payment method is configured for this project.</p></div></div>
        <div className="creator-payout-notice" role="note"><strong>No bank or UPI details are collected or saved.</strong><p>Payment transfers are not supported. A secure payout provider and backend storage must be configured before adding real payment details.</p></div>
      </section>

      <section className="creator-panel" aria-labelledby="creator-request-payout-title">
        <div className="creator-panel-heading"><div><h2 id="creator-request-payout-title">Request a Payout</h2><p>Submit a request within your available balance.</p></div></div>
        {balances.availableForPayoutPaise <= 0 && !loading && <p className="creator-payout-empty-note">No eligible funds are currently available. A request will be enabled when available earnings are recorded.</p>}
        <form className="creator-payout-form" onSubmit={submit}>
          <label htmlFor="creator-payout-amount">Payout amount (INR)
            <input id="creator-payout-amount" name="amount" type="text" inputMode="decimal" autoComplete="off" placeholder="e.g. 500.00" value={amount} onChange={(event) => { setAmount(event.target.value); setAmountError(""); setSubmitMessage(null); }} aria-invalid={Boolean(amountError)} aria-describedby="creator-payout-available creator-payout-amount-error" />
          </label>
          {amountError && <p id="creator-payout-amount-error" className="creator-error-text" role="alert">{amountError}</p>}
          <p id="creator-payout-available" className="creator-payout-balance">Available balance: <strong>{formatRupees(balances.availableForPayoutPaise)}</strong>. No minimum payout amount is configured.</p>
          <label htmlFor="creator-payout-method">Request method
            <select id="creator-payout-method" value="demo" disabled aria-describedby="creator-payout-method-note"><option value="demo">Browser request · no payment method</option></select>
          </label>
          <small id="creator-payout-method-note" className="creator-payout-hint">This records a request only; it does not start a transfer.</small>
          {submitMessage && <p className={`creator-payout-message ${submitMessage.type}`} role={submitMessage.type === "error" ? "alert" : "status"}>{submitMessage.text}</p>}
          {storageError && <p className="creator-payout-message error" role="alert">Payout requests are disabled until browser storage is available.</p>}
          <button className="btn btn-primary" type="submit" disabled={loading || submitting || Boolean(storageError) || balances.availableForPayoutPaise <= 0}>{loading ? "Loading balance…" : submitting ? "Submitting request…" : "Request Payout"}</button>
        </form>
      </section>
    </div>

    <section className="creator-panel" aria-labelledby="creator-payout-history-title">
      <div className="creator-panel-heading"><div><h2 id="creator-payout-history-title"><CircleDollarSign size={19} aria-hidden="true" /> Payout History</h2><p>Only requests associated with this signed-in creator are shown.</p></div><label className="creator-payout-filter">Filter status<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="paid">Paid</option></select></label></div>
      {loading ? <p className="creator-payout-empty" role="status">Loading payout history…</p> : storageError ? <p className="creator-payout-empty" role="alert">Payout history is unavailable until the storage issue is resolved.</p> : requests.length === 0 ? <div className="creator-payout-empty"><strong>No payout requests yet</strong><p>Requests you submit in this browser will appear here. No transfer is made.</p></div> : filteredRequests.length === 0 ? <p className="creator-payout-empty">No requests match this status filter.</p> : <div className="creator-payout-table-wrap"><table className="creator-payout-table"><thead><tr><th scope="col">Request ID</th><th scope="col">Request Date</th><th scope="col">Amount</th><th scope="col">Method</th><th scope="col">Status</th><th scope="col">Last Updated</th><th scope="col">Admin Note</th></tr></thead><tbody>{filteredRequests.map((request) => <tr key={request.requestId}><td>{request.requestId}</td><td>{DATE_FORMAT.format(request.createdAt)}</td><td>{formatRupees(request.amountPaise)}</td><td><span className="creator-payout-method-mask">No payment details</span></td><td><span className={`creator-sale-status is-${request.status === "paid" ? "paid_out" : request.status}`}>{STATUS_LABELS[request.status]}</span></td><td>{DATE_FORMAT.format(request.updatedAt)}</td><td>{request.adminNote || "—"}</td></tr>)}</tbody></table></div>}
      <p className="creator-payout-footnote">Requests are stored in this browser and can be modified or removed by anyone with browser access. They are not secure financial records or real payout instructions.</p>
    </section>
  </div>;
}
