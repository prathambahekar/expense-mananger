
import React from 'react';
import type { FraudAlert, Expense } from '../../types';
import { Modal, Button } from '../ui';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

interface FraudAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: FraudAlert | null;
  expense: Expense | null;
}

const FraudAlertModal: React.FC<FraudAlertModalProps> = ({ isOpen, onClose, alert, expense }) => {
  if (!alert || !expense) return null;

  const scorePercentage = (alert.score * 100).toFixed(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Fraud Alert">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <FiAlertTriangle className="text-6xl text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold">Potentially Fraudulent Activity Detected</h3>
          <p className="text-gray-400 mt-1">Our AI system has flagged this transaction for review.</p>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold mb-2">Transaction Details</h4>
          <div className="text-sm space-y-1 text-gray-300">
            <p><strong>Description:</strong> {expense.description}</p>
            <p><strong>Amount:</strong> {expense.amount} {expense.currency}</p>
            <p><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
            <h4 className="font-semibold mb-2 text-red-300">AI Analysis</h4>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Fraud Score</span>
                <span className="font-bold text-lg text-red-300">{scorePercentage}%</span>
            </div>
            <div className="w-full bg-red-900/50 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{width: `${scorePercentage}%`}}></div>
            </div>
            <p className="text-sm mt-3 text-red-300"><strong>Reason:</strong> {alert.reason}</p>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          If you recognize this transaction and believe it's legitimate, you can mark it as safe. Otherwise, please investigate further.
        </p>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => { /* Handle Mark as Safe */ onClose(); }}>
            <FiCheckCircle className="mr-2" /> Mark as Safe
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FraudAlertModal;
