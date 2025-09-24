

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserGroups, createGroup, updateGroup, removeGroupMember } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { GradientText, LoadingSpinner } from '../components/ui';
import { GroupCard, CreateGroupCard, CreateGroupModal, ManageGroupModal } from '../components/Groups';
import { toast } from 'react-toastify';
import type { Group } from '../types';

const GroupsPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [manageGroup, setManageGroup] = useState<Group | null>(null);

    const { data: groups, isLoading } = useQuery<Group[]>({
        queryKey: ['groups', user?.id],
        queryFn: () => getUserGroups(user!.id).then(res => res.data),
        enabled: !!user,
    });

    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', user?.id] });
            toast.success('Group created successfully!');
            setIsCreateModalOpen(false);
        },
        onError: (error) => {
            console.error('Failed to create group', error);
        }
    });

    const updateGroupMutation = useMutation({
        mutationFn: async ({ groupId, data }: { groupId: string; data: { name: string; newMembers: string[] } }) => {
            const response = await updateGroup(groupId, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', user?.id] });
            toast.success('Group updated successfully!');
            setManageGroup(null);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update group');
        }
    });

    const removeMemberMutation = useMutation({
        mutationFn: async ({ groupId, memberId }: { groupId: string; memberId: string }) => {
            const response = await removeGroupMember(groupId, memberId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', user?.id] });
            toast.success('Member removed successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove member');
        }
    });

    const handleCreateGroup = async (data: { name: string, members: string[] }) => {
        await createGroupMutation.mutateAsync(data);
    };

    const handleUpdateGroup = async (groupId: string, data: { name: string, newMembers: string[] }) => {
        await updateGroupMutation.mutateAsync({ groupId, data });
    };

    const handleRemoveMember = async (groupId: string, memberId: string) => {
        await removeMemberMutation.mutateAsync({ groupId, memberId });
    };

    return (
        <div>
            <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">
                Your <GradientText>Groups</GradientText>
            </h1>
            <p className="text-gray-400 mb-8">Manage your shared expense circles.</p>

            {isLoading ? (
                <div className="flex justify-center mt-20"><LoadingSpinner /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups?.map(group => (
                        <GroupCard
                            key={group.id}
                            group={group}
                            onManage={setManageGroup}
                        />
                    ))}
                    <CreateGroupCard onClick={() => setIsCreateModalOpen(true)} />
                </div>
            )}

            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateGroup}
            />

            <ManageGroupModal
                isOpen={!!manageGroup}
                onClose={() => setManageGroup(null)}
                group={manageGroup}
                onUpdateGroup={handleUpdateGroup}
                onRemoveMember={handleRemoveMember}
            />
        </div>
    );
};

export default GroupsPage;