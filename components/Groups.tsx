

import React from 'react';
import type { Group } from '../types';
import { FiUsers, FiPlus, FiCopy } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Modal, Input, Button } from './ui';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// FIX: Alias motion components to local variables to help TypeScript with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

// --- Group Card ---
export const GroupCard: React.FC<{ group: Group }> = ({ group }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
  >
    <div>
      <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">{group.name}</h3>
      <div className="flex items-center text-gray-400 text-sm gap-2">
        <FiUsers />
        <span>{group.memberCount} members</span>
      </div>
    </div>
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold">Manage</button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(group.inviteCode);
            toast.success('Invite code copied!');
          }}
          className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
        >
          <FiCopy />
          <span>{group.inviteCode}</span>
        </button>
    </div>
  </MotionDiv>
);

// --- Create Group Card ---
export const CreateGroupCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <MotionButton
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="bg-transparent p-6 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400 hover:border-[var(--color-primary-accent)] hover:text-white transition-all"
    >
        <FiPlus className="text-4xl mb-2" />
        <span className="font-bold">Create New Group</span>
    </MotionButton>
);


// --- Create Group Modal ---
interface CreateGroupFormData {
  name: string;
  members: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Group name is required').min(3, 'Must be at least 3 characters'),
  members: yup.string().test(
    'is-emails',
    'Please enter valid, comma-separated emails',
    (value) => {
        if (!value) return true; // Allow empty
        return value.split(',').every(email => yup.string().email().isValidSync(email.trim()));
    }
  ),
});

export const CreateGroupModal: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (data: { name: string, members: string[] }) => Promise<void> }> = ({ isOpen, onClose, onCreate }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateGroupFormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: CreateGroupFormData) => {
        const members = data.members ? data.members.split(',').map(e => e.trim()).filter(Boolean) : [];
        await onCreate({ name: data.name, members });
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Group">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input 
                    label="Group Name" 
                    register={register('name')} 
                    error={errors.name?.message}
                    placeholder="e.g., Trip to Mars"
                />
                <Input 
                    label="Add Members by Email" 
                    register={register('members')} 
                    error={errors.members?.message}
                    placeholder="alice@example.com, bob@example.com"
                />
                <p className="text-xs text-gray-400">Separate multiple emails with a comma.</p>
                <Button type="submit" isLoading={isSubmitting}>
                    Create Group
                </Button>
            </form>
        </Modal>
    );
};