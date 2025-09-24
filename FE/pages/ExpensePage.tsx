
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ExpenseForm from '../components/ExpenseForm';
import { GradientText } from '../components/ui';
import { createExpense, updateExpense, checkFraud } from '../services/api';
// Assuming an API function getExpenseById exists for editing
// import { getExpenseById } from '../services/api';

const ExpensePage: React.FC = () => {
    const { expenseId } = useParams();
    const isEditing = !!expenseId;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Mock data fetching for editing, replace with actual API call
    // const { data: expenseData, isLoading } = useQuery({
    //     queryKey: ['expense', expenseId],
    //     queryFn: () => getExpenseById(expenseId!),
    //     enabled: isEditing,
    // });

    const mutation = useMutation({
        mutationFn: (data: any) => {
            return isEditing ? updateExpense(expenseId, data) : createExpense(data);
        },
        onSuccess: async (data, variables) => {
            // After creating/updating, check for fraud
            const fraudResponse = await checkFraud(variables);
            if (fraudResponse.data.flagged) {
                toast.warn('This transaction has been flagged for review.');
                // Here you would open the FraudAlertModal
            } else {
                toast.success(`Expense ${isEditing ? 'updated' : 'created'} successfully!`);
            }
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            navigate('/dashboard');
        },
        onError: (error) => {
            console.error('Failed to save expense', error);
        }
    });

    const handleSubmit = async (data: any) => {
        await mutation.mutateAsync(data);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">
                {isEditing ? 'Edit' : 'Add New'} <GradientText>Expense</GradientText>
            </h1>
            <p className="text-gray-400 mb-8">
                {isEditing ? 'Update the details of your expense.' : 'Log a new shared expense for your group.'}
            </p>
            
            {/* {isEditing && isLoading ? <LoadingSpinner/> : <ExpenseForm onSubmit={handleSubmit} expense={expenseData} />} */}
            <ExpenseForm onSubmit={handleSubmit} />
        </div>
    );
};

export default ExpensePage;
