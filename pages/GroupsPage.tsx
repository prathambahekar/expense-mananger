

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserGroups, createGroup } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { GradientText, LoadingSpinner } from '../components/ui';
import { GroupCard, CreateGroupCard, CreateGroupModal } from '../components/Groups';
import { toast } from 'react-toastify';
import type { Group } from '../types';

const GroupsPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: groups, isLoading } = useQuery<Group[]>({
        queryKey: ['groups', user?.id],
        // FIX: Unwrapped the data from the API response to ensure the query returns Group[] as expected.
        queryFn: () => getUserGroups(user!.id).then(res => res.data),
        enabled: !!user,
    });

    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups', user?.id] });
            toast.success('Group created successfully!');
            setIsModalOpen(false);
        },
        onError: (error) => {
             // Toast is handled by interceptor
             console.error('Failed to create group', error);
        }
    });

    const handleCreateGroup = async (data: { name: string, members: string[] }) => {
        await createGroupMutation.mutateAsync(data);
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
                        <GroupCard key={group.id} group={group} />
                    ))}
                    <CreateGroupCard onClick={() => setIsModalOpen(true)} />
                </div>
            )}

            <CreateGroupModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onCreate={handleCreateGroup}
            />
        </div>
    );
};

export default GroupsPage;