

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
export const GroupCard: React.FC<{ group: Group; onManage: (group: Group) => void }> = ({ group, onManage }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
  >
    <div>
      <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">{group.name}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-gray-400 text-sm gap-2">
          <FiUsers />
          <span>{group.memberCount} members</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {group.members.map(member => (
            <span key={member.id} className="text-xs bg-white/10 px-2 py-1 rounded-full">
              {member.name}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => onManage(group)}
        className="flex-1 h-11 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold"
      >
        Manage
      </button>
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

const schema: yup.ObjectSchema<CreateGroupFormData> = yup.object().shape({
  name: yup.string().required('Group name is required').min(3, 'Must be at least 3 characters'),
  members: yup.string()
    .transform((value) => value ? value.trim() : '')
    .test(
      'is-emails',
      'Please enter valid, comma-separated emails',
      (value) => {
        if (!value) return true; // Allow empty
        const emails = value.split(',').map(e => e.trim()).filter(Boolean);
        return emails.every(email => yup.string().email().isValidSync(email));
      }
    )
}); export const CreateGroupModal: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (data: { name: string, members: string[] }) => Promise<void> }> = ({ isOpen, onClose, onCreate }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      members: ''
    }
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

// --- Manage Group Modal ---
interface AddMembersFormData {
  members: string;
}

const addMembersSchema: yup.ObjectSchema<AddMembersFormData> = yup.object().shape({
  members: yup.string()
    .required('Please enter at least one email address')
    .transform((value) => value ? value.trim() : '')
    .test(
      'is-emails',
      'Please enter valid, comma-separated emails',
      (value) => {
        if (!value) return false; // Don't allow empty since it's required
        const emails = value.split(',').map(e => e.trim()).filter(Boolean);
        return emails.length > 0 && emails.every(email => yup.string().email().isValidSync(email));
      }
    )
});

interface ManageGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onUpdateGroup: (groupId: string, data: { name: string, newMembers: string[] }) => Promise<void>;
  onRemoveMember: (groupId: string, memberId: string) => Promise<void>;
}

export const ManageGroupModal: React.FC<ManageGroupModalProps> = ({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
  onRemoveMember
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AddMembersFormData>({
    resolver: yupResolver(addMembersSchema),
    defaultValues: {
      members: ''
    }
  });

  const handleSubmitForm = async (data: AddMembersFormData) => {
    if (!group) return;
    const newMembers = data.members ? data.members.split(',').map(e => e.trim()).filter(Boolean) : [];
    await onUpdateGroup(group.id, { name: group.name, newMembers });
    reset();
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!group) return;
    await onRemoveMember(group.id, memberId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Group">
      {group && (
        <div className="space-y-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4">{group.name}</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Current Members</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.members.map(member => (
                    <div key={member.id} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <span className="text-sm">{member.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            <Input
              label="Add New Members by Email"
              register={register('members')}
              error={errors.members?.message}
              placeholder="alice@example.com, bob@example.com"
            />
            <p className="text-xs text-gray-400">Separate multiple emails with a comma.</p>
            <Button type="submit" isLoading={isSubmitting}>
              Add Members
            </Button>
          </form>

          <div>
            <h4 className="font-medium text-gray-300 mb-2">Group Invite Code</h4>
            <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg">
              <code className="flex-1">{group.inviteCode}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(group.inviteCode);
                  toast.success('Invite code copied!');
                }}
                className="text-[var(--color-secondary-accent)] hover:text-[var(--color-secondary-accent-hover)]"
              >
                <FiCopy />
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};