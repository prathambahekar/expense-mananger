

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardData, settleGroupDebts } from '../services/api'; // Re-using dashboard data for suggestions
import { useAuth } from '../hooks/useAuth';
import { GradientText, LoadingSpinner, Button } from '../components/ui';
import { formatCurrency } from '../utils';
import { FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SettlementsPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    // For simplicity, we'll pull settlement suggestions from the main dashboard data endpoint.
    // A real app might have a dedicated /settlements endpoint.
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard', user?.id], 
        // FIX: Unwrapped the data from the API response to match the expected type for `useQuery`.
        queryFn: () => getDashboardData(user!.id).then(res => res.data),
        enabled: !!user,
    });
    
    const settleMutation = useMutation({
        mutationFn: (groupId: string) => settleGroupDebts(groupId),
        onSuccess: () => {
            toast.success("Group settled successfully!");
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
    });

    // Use the first group ID from balances as the target for settlement.
    const firstGroupIdWithBalance = data?.balances[0]?.groupId;

    return (
        <div>
            <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">
                Settle <GradientText>Up</GradientText>
            </h1>
            <p className="text-gray-400 mb-8">View suggested transfers to balance your group's expenses.</p>

            {isLoading ? (
                <div className="flex justify-center mt-20"><LoadingSpinner /></div>
            ) : (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                    <h2 className="text-xl font-bold font-[var(--font-heading)]">Suggested Transfers</h2>
                    {data?.settlementSuggestions && data.settlementSuggestions.length > 0 ? (
                        data.settlementSuggestions.map((s, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">{s.from}</span>
                                    <FiArrowRight className="text-[var(--color-primary-accent)]"/>
                                    <span className="font-medium">{s.to}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-white font-mono">{formatCurrency(s.amount, s.currency)}</p>
                                    <p className="text-xs text-gray-400">In {s.currency}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-8">No settlements needed. Everyone is balanced!</p>
                    )}

                    {data?.settlementSuggestions && data.settlementSuggestions.length > 0 && firstGroupIdWithBalance && (
                        <div className="pt-4 border-t border-white/10">
                            <Button 
                                onClick={() => settleMutation.mutate(firstGroupIdWithBalance)}
                                isLoading={settleMutation.isPending}
                            >
                                Mark Group as Settled
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SettlementsPage;