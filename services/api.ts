
import axios from 'axios';
import { toast } from 'react-toastify';
import type { AuthResponse, DashboardData, Group, Expense, User } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:5000', // As per requirements
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';

        if (error.response?.status === 401) {
            // This is a simplified logout. In a real app, you might use an event emitter or context method.
            localStorage.removeItem('SEM_TOKEN');
            localStorage.removeItem('SEM_USER');
            setAuthToken(null);
            window.location.hash = '/auth'; // Using hash for HashRouter
            toast.error("Session expired. Please log in again.");
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);


// --- MOCK API IMPLEMENTATION ---
// NOTE: This section replaces real network calls with mock data to allow the UI to run without a backend.
// This is to resolve the "Network Error".

const mockUsers: User[] = [
    { id: 'u1', name: 'Alice', email: 'alice@example.com', avatarUrl: null },
    { id: 'u2', name: 'Bob', email: 'bob@example.com', avatarUrl: null },
    { id: 'u3', name: 'Charlie', email: 'charlie@example.com', avatarUrl: null },
];
const mockUser = mockUsers[0]; // Alice is our logged-in user


let mockGroups: Group[] = [
    { id: 'g1', name: 'Trip to Mars', memberCount: 2, members: [mockUsers[0], mockUsers[1]], inviteCode: 'MARS2025' },
    { id: 'g2', name: 'Project Vortexa', memberCount: 1, members: [mockUsers[0]], inviteCode: 'VRTXWIN' },
];

let mockExpenses: Expense[] = [
    { id: 'e1', date: '2025-09-01T12:00:00.000Z', description: 'Dinner', amount: 2500, currency: 'INR', payer: { id: 'u2', name: 'Bob' }, shares: [{ userId: 'u1', share: 1250 }, { userId: 'u2', share: 1250 }], groupId: 'g1' },
    { id: 'e2', date: '2025-08-28T12:00:00.000Z', description: 'Groceries', amount: 1875.50, currency: 'INR', payer: { id: 'u1', name: 'Alice' }, shares: [{ userId: 'u1', share: 937.75 }, { userId: 'u2', share: 937.75 }], groupId: 'g1' },
    { id: 'e3', date: '2025-08-25T12:00:00.000Z', description: 'Movie Tickets', amount: 750, currency: 'INR', payer: { id: 'u1', name: 'Alice' }, shares: [{ userId: 'u1', share: 750 }], groupId: 'g2' },
    { id: 'e4', date: '2025-09-02T12:00:00.000Z', description: 'Unusually large purchase', amount: 30000, currency: 'INR', payer: { id: 'u2', name: 'Bob' }, shares: [{ userId: 'u1', share: 15000 }, { userId: 'u2', share: 15000 }], groupId: 'g1' },
];

const mockDashboardData: DashboardData = {
    balances: [{ groupId: 'g1', groupName: 'Trip to Mars', net: -625.50, currency: 'INR' }],
    expenses: mockExpenses,
    settlementSuggestions: [{ from: 'Alice (You)', to: 'Bob', amount: 312.25, currency: 'INR' }],
    fraudAlerts: [{ id: 'f1', expenseId: 'e4', score: 0.92, reason: 'Unusually large amount for this group.' }],
};

const mockApiCall = <T>(data: T, delay = 500): Promise<{ data: T }> => {
    return new Promise(resolve => {
        setTimeout(() => resolve({ data }), delay);
    });
};

// --- API Functions ---

// Auth
export const registerUser = (data: any) => mockApiCall<AuthResponse>({ token: 'mock-jwt-token', user: { id: 'u1', name: data.name, email: data.email } });
export const loginUser = (data: any) => mockApiCall<AuthResponse>({ token: 'mock-jwt-token', user: mockUser });

// Dashboard
export const getDashboardData = (userId: string) => {
    // Make sure the dashboard data has the most recent expenses
    mockDashboardData.expenses = mockExpenses;
    return mockApiCall<DashboardData>(mockDashboardData);
}

// Groups
export const getUserGroups = (userId: string) => mockApiCall<Group[]>(mockGroups);
export const createGroup = (data: { name: string; members: string[] }) => {
    const newGroup: Group = {
        id: `g${Date.now()}`,
        name: data.name,
        members: [mockUser, ...data.members.map((m, i) => ({ id: `new-user-${i}`, name: m.split('@')[0], email: m, avatarUrl: null }))],
        memberCount: 1 + data.members.length,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    mockGroups.push(newGroup);
    return mockApiCall<Group>(newGroup);
}

// Expenses
export const createExpense = (data: any) => {
    const newExpense: Expense = {
        id: `e${Date.now()}`,
        date: new Date(data.date).toISOString(),
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        payer: {
            id: data.payerId,
            name: mockUsers.find(u => u.id === data.payerId)?.name || 'Unknown Payer'
        },
        shares: data.participants, // Correctly map participants to shares
        groupId: 'g1', // Add a default group ID as the form doesn't specify one
    };
    mockExpenses.unshift(newExpense);
    return mockApiCall<Expense>(newExpense);
};

export const checkFraud = (expenseData: any) => {
    // Simulate fraud for amounts over 500
    if (expenseData.amount > 500) {
        return mockApiCall({ flagged: true, score: 0.92, reasons: ["Unusual large amount for this user/group."] });
    }
    return mockApiCall({ flagged: false });
};

export const updateExpense = (expenseId: string, data: any) => {
    const index = mockExpenses.findIndex(e => e.id === expenseId);
    if (index !== -1) {
        const updatedExpense: Expense = {
            ...mockExpenses[index],
            date: new Date(data.date).toISOString(),
            description: data.description,
            amount: data.amount,
            currency: data.currency,
            payer: {
                id: data.payerId,
                name: mockUsers.find(u => u.id === data.payerId)?.name || 'Unknown Payer'
            },
            shares: data.participants, // Also fix for update
        };
        mockExpenses[index] = updatedExpense;
        return mockApiCall<Expense>(mockExpenses[index]);
    }
    return Promise.reject({ message: "Expense not found" });
};

export const deleteExpense = (expenseId: string) => {
    mockExpenses = mockExpenses.filter(e => e.id !== expenseId);
    return mockApiCall({ message: 'Success' });
};

// Settlements
export const settleGroupDebts = (groupId: string) => {
    mockDashboardData.settlementSuggestions = [];
    return mockApiCall({ message: 'Group settled' });
};

// Additional Group Management Functions
export const updateGroup = (groupId: string, data: { name: string; newMembers: string[] }) => {
    const groupIndex = mockGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return Promise.reject({ message: 'Group not found' });

    // Add new members
    const newMemberObjects = data.newMembers.map((email, i) => ({
        id: `new-user-${Date.now()}-${i}`,
        name: email.split('@')[0],
        email: email,
        avatarUrl: null
    }));

    mockGroups[groupIndex] = {
        ...mockGroups[groupIndex],
        name: data.name,
        members: [...mockGroups[groupIndex].members, ...newMemberObjects],
        memberCount: mockGroups[groupIndex].members.length + newMemberObjects.length
    };

    return mockApiCall(mockGroups[groupIndex]);
};

export const removeGroupMember = (groupId: string, memberId: string) => {
    const groupIndex = mockGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return Promise.reject({ message: 'Group not found' });

    // Don't allow removing the last member
    if (mockGroups[groupIndex].members.length <= 1) {
        return Promise.reject({ message: 'Cannot remove the last member of a group' });
    }

    // Don't allow removing the user if they have active expenses in the group
    const hasExpenses = mockExpenses.some(e =>
        e.groupId === groupId &&
        (e.payer.id === memberId || e.shares.some(s => s.userId === memberId))
    );

    if (hasExpenses) {
        return Promise.reject({
            message: 'Cannot remove member with active expenses. Please settle all expenses first.'
        });
    }

    mockGroups[groupIndex] = {
        ...mockGroups[groupIndex],
        members: mockGroups[groupIndex].members.filter(m => m.id !== memberId),
        memberCount: mockGroups[groupIndex].members.length - 1
    };

    return mockApiCall({ message: 'Member removed successfully' });
};

// Function to join a group with an invite code
export const joinGroup = (inviteCode: string, userId: string) => {
    const group = mockGroups.find(g => g.inviteCode === inviteCode);
    if (!group) return Promise.reject({ message: 'Invalid invite code' });

    if (group.members.some(m => m.id === userId)) {
        return Promise.reject({ message: 'You are already a member of this group' });
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) return Promise.reject({ message: 'User not found' });

    group.members.push(user);
    group.memberCount = group.members.length;

    return mockApiCall(group);
};

export { api };
