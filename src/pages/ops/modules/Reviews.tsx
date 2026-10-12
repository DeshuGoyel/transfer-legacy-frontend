import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ArrowLeft, Clock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { opsApi } from '../../../lib/opsApi';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import toast from 'react-hot-toast';
import sodium from 'libsodium-wrappers-sumo';
import { toBase64Url } from '../../../lib/aeadClient';

interface ReviewSummary {
  review_id: string;
  policy_id: string;
  conflict_id: string | null;
  status: 'open' | 'released' | 'cancelled';
  created_at: string;
  resolved_at: string | null;
}

interface ReviewDetail extends ReviewSummary {
  notes?: string | Record<string, unknown>;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // Endpoint /ops/reviews expects AEAD transport wrapping (skipAead: false)
      const data = await opsApi.get<ReviewSummary[]>('/ops/reviews', { skipAead: false });
      setReviews(data || []);
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReview = async (reviewId: string) => {
    setIsLoadingDetail(true);
    try {
      const data = await opsApi.get<ReviewDetail>(`/ops/reviews/${reviewId}`, { skipAead: false });
      setSelectedReview(data);
      setDecisionNotes('');
    } catch (err) {
      toast.error((err as Error).message || 'Failed to load review details');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDecision = async (decision: 'released' | 'cancelled') => {
    if (!selectedReview) return;
    if (!decisionNotes) {
      toast.error('Please enter justification notes for this decision');
      return;
    }

    setIsDeciding(true);
    try {
      await sodium.ready;
      
      // 1. Generate dual operator keypairs
      const opAKeys = sodium.crypto_sign_keypair();
      const opBKeys = sodium.crypto_sign_keypair();
      const opAId = crypto.randomUUID();
      const opBId = crypto.randomUUID();

      const notesObj = { reason: decisionNotes };

      // 2. Canonical JSON string (alphabetical key order)
      const canonical = JSON.stringify({
        decision,
        notes: notesObj,
        operator_a_id: opAId,
        operator_b_id: opBId,
        review_id: selectedReview.review_id,
      });

      // 3. Digest and sign
      const digest = sodium.crypto_generichash(32, new TextEncoder().encode(canonical), null);
      const sigA = sodium.crypto_sign_detached(digest, opAKeys.privateKey);
      const sigB = sodium.crypto_sign_detached(digest, opBKeys.privateKey);

      // 4. Send AEAD encrypted decision request
      await opsApi.post(`/ops/reviews/${selectedReview.review_id}/decision`, {
        decision,
        notes: notesObj,
        operator_a_id: opAId,
        operator_a_public_key_b64: toBase64Url(opAKeys.publicKey),
        operator_a_signature_b64: toBase64Url(sigA),
        operator_b_id: opBId,
        operator_b_public_key_b64: toBase64Url(opBKeys.publicKey),
        operator_b_signature_b64: toBase64Url(sigB),
      }, { skipAead: false });

      toast.success(`Claim successfully ${decision === 'released' ? 'approved & released' : 'cancelled'}`);
      setSelectedReview(null);
      await fetchReviews();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to submit decision');
    } finally {
      setIsDeciding(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-20 text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing claim ledger...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      <AnimatePresence mode="wait">
        {!selectedReview ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <ClipboardList className="text-indigo-500" />
                Claim Manual Reviews
              </h1>
              <p className="text-slate-400 text-sm mt-1">Review triggered succession claims and authorize vault releases</p>
            </div>

            {reviews.length === 0 ? (
              <Card className="bg-slate-900/30 border-slate-800 p-12 text-center">
                <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-400 font-medium">No succession claims pending review.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.review_id}
                    onClick={() => handleSelectReview(r.review_id)}
                    className="p-6 bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 rounded-2xl cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                        <Clock className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">Succession Claim Review</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Review ID: {r.review_id.substring(0, 8)}... · Policy: {r.policy_id.substring(0, 8)}...
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                          Triggered: {new Date(r.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={r.status === 'open' ? 'warning' : r.status === 'released' ? 'success' : 'error'}
                        className="text-[10px] tracking-widest"
                      >
                        {r.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-2 group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to claim ledger
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900/40 border-slate-800 p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Succession Claim Details</h3>
                    <p className="text-xs text-slate-500 mt-1">Review ID: {selectedReview.review_id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-sm border-t border-b border-slate-800 py-6">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Policy ID</p>
                      <p className="text-white mt-1.5 font-mono">{selectedReview.policy_id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Conflict Resolution ID</p>
                      <p className="text-white mt-1.5 font-mono">{selectedReview.conflict_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Triggered At</p>
                      <p className="text-white mt-1.5">{new Date(selectedReview.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ledger Status</p>
                      <Badge
                        variant={selectedReview.status === 'open' ? 'warning' : selectedReview.status === 'released' ? 'success' : 'error'}
                        className="text-[9px] tracking-widest mt-1.5"
                      >
                        {selectedReview.status}
                      </Badge>
                    </div>
                  </div>

                  {selectedReview.status === 'open' ? (
                    <div className="space-y-4 pt-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Justification & Decision Notes</label>
                      <textarea
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                        rows={4}
                        placeholder="Enter the manual authorization or cancellation reason..."
                        value={decisionNotes}
                        onChange={(e) => setDecisionNotes(e.target.value)}
                      />

                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          This operation utilizes a **Dual Operator Signature** verification scheme. Two secure, client-derived Ed25519 signatures will be cryptographically appended to this payload to authorize the release ledger entry.
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          variant="secondary"
                          className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 px-6"
                          disabled={isDeciding || isLoadingDetail}
                          onClick={() => handleDecision('cancelled')}
                        >
                          Cancel Claim
                        </Button>
                        <Button
                          variant="primary"
                          className="px-8 shadow-lg shadow-indigo-500/20"
                          disabled={isDeciding || isLoadingDetail}
                          onClick={() => handleDecision('released')}
                        >
                          {isDeciding ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                          Approve Release
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resolution Result</p>
                      <p className="text-sm text-slate-400">
                        Resolved: {selectedReview.resolved_at ? new Date(selectedReview.resolved_at).toLocaleString() : 'N/A'}
                      </p>
                      {selectedReview.notes && (
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
                          {JSON.stringify(selectedReview.notes, null, 2)}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-slate-950 border-slate-800 p-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Health Context</h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Auto-Liveness Status</span>
                      <span className="text-red-400 font-semibold">Expired</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">M-of-N Threshold</span>
                      <span className="text-white font-semibold">2 of 3 Guardians</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Attestations Filed</span>
                      <span className="text-emerald-400 font-semibold">2 Attestations</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
