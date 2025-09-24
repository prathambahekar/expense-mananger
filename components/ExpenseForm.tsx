

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Expense, SplitType as SplitTypeEnum, User } from '../types';
import { CURRENCIES } from '../types';
import { Input, Button, FileUpload } from './ui';
import { FiPlus, FiTrash, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionDiv = motion.div;

interface ExpenseFormData {
    amount: number;
    currency: string;
    description: string;
    date: string;
    payerId: string;
    splitType: SplitTypeEnum;
    participants: {
        userId: string;
        share: number;
    }[];
}

const schema = yup.object().shape({
    description: yup.string().required('Description is required').min(3),
    amount: yup.number().required('Amount is required').positive('Amount must be positive'),
    currency: yup.string().required('Currency is required'),
    date: yup.string().required('Date is required'),
    payerId: yup.string().required('Payer is required'),
    splitType: yup.string().required(),
    participants: yup.array().of(
        yup.object().shape({
            userId: yup.string().required(),
            share: yup.number().min(0).required(),
        })
    ).min(1, 'At least one participant is required'),
});

const mockUsers: User[] = [
    { id: 'u1', name: 'Alice', email: 'alice@ex.com' },
    { id: 'u2', name: 'Bob', email: 'bob@ex.com' },
    { id: 'u3', name: 'Charlie', email: 'charlie@ex.com' },
];

interface ExpenseFormProps {
    expense?: Expense;
    onSubmit: (data: any) => Promise<void>;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSubmit }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch, setError } = useForm<ExpenseFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            description: expense?.description || '',
            amount: expense?.amount || 0,
            currency: expense?.currency || 'INR',
            date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            payerId: expense?.payer.id || mockUsers[0].id,
            splitType: 'equal' as SplitTypeEnum,
            participants: expense?.shares || [{ userId: mockUsers[0].id, share: 0 }]
        }
    });

    const { fields, append, remove, update } = useFieldArray({ control, name: "participants" });
    const watchAmount = watch('amount');
    const participantIds = fields.map(f => f.userId);

    // Add all users not already in participants
    const handleAddAll = () => {
        const toAdd = mockUsers.filter(u => !participantIds.includes(u.id));
        if (toAdd.length === 0) return;
        toAdd.forEach(u => append({ userId: u.id, share: 0 }));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold mb-6 font-[var(--font-heading)]">Expense Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Description" register={register('description')} error={errors.description?.message} placeholder="Dinner with friends" />
                    <Input label="Date" type="date" register={register('date')} error={errors.date?.message} />
                    <div className="flex gap-2">
                        <div className="flex-grow">
                            <Input label="Amount" type="number" step="0.01" register={register('amount')} error={errors.amount?.message} placeholder="100.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                            <select {...register('currency')} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)] transition-all h-[46px]">
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Paid by</label>
                        <select {...register('payerId')} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)] transition-all h-[46px]">
                            {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <FileUpload onFileChange={(file) => console.log(file)} />
                </div>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 p-8 rounded-2xl border border-white/10">
                <div className="mb-6">
                    <h3 className="text-xl font-bold font-[var(--font-heading)] flex items-center gap-3"><FiUsers /> Split Between</h3>
                    <div className="flex gap-3 mt-4">
                        <Button type="button" variant="secondary" className="!w-auto px-4 !h-10" onClick={() => append({ userId: '', share: 0 })}>
                            <FiPlus className="mr-2" /> Add Person
                        </Button>
                        <Button type="button" variant="secondary" className="!w-auto px-4 !h-10" onClick={handleAddAll}>
                            <FiUsers className="mr-2" /> Add All
                        </Button>
                    </div>
                </div>
                {fields.map((field, index) => {
                    // Prevent duplicate user selection
                    const otherIds = fields.filter((_, i) => i !== index).map(f => f.userId);
                    return (
                        <div key={field.id} className="flex items-center gap-4 mb-4">
                            <Controller
                                control={control}
                                name={`participants.${index}.userId`}
                                render={({ field: selectField }) => (
                                    <select {...selectField} className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)]"
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (otherIds.includes(val)) {
                                                setError(`participants.${index}.userId`, { type: 'manual', message: 'User already added' });
                                            } else {
                                                selectField.onChange(e);
                                            }
                                        }}>
                                        <option value="">Select User</option>
                                        {mockUsers.map(u => <option key={u.id} value={u.id} disabled={otherIds.includes(u.id)}>{u.name}</option>)}
                                    </select>
                                )}
                            />
                            <Controller
                                control={control}
                                name={`participants.${index}.share`}
                                render={({ field }) => (
                                    <input {...field} type="number" step="0.01" className="w-40 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)]" />
                                )}
                            />
                            <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-400 p-2"><FiTrash /></button>
                        </div>
                    );
                })}
                {fields.length < mockUsers.length ? (
                    <button
                        type="button"
                        onClick={() => append({ userId: '', share: 0 })}
                        className="mt-2 px-6 py-2 rounded-lg bg-[var(--color-primary-accent)] text-[var(--color-background)] font-semibold shadow hover:bg-[var(--color-secondary-accent)] transition-colors duration-150 flex items-center gap-2"
                    >
                        <FiPlus style={{ fontSize: 18 }} /> Add More People
                    </button>
                ) : (
                    <div className="mt-2 text-sm text-gray-400">All people have been added.</div>
                )}
                <div className="mt-4 text-sm text-gray-400">Total amount to split: {watchAmount}</div>
            </MotionDiv>

            <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-end pt-4">
                <div className="w-full md:w-1/3">
                    <Button type="submit" isLoading={isSubmitting}>
                        {expense ? 'Update Expense' : 'Create Expense'}
                    </Button>
                </div>
            </MotionDiv>
        </form>
    );
};

export default ExpenseForm;