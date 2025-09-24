
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../context/SettingsContext';
import { GradientText, Input, Button } from '../components/ui';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const { currency, setCurrency, availableCurrencies } = useSettings();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const handleChangePassword = (data: any) => {
        console.log("Change password data:", data);
        // Implement password change logic here
    };

    return (
        <div>
            <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-8">
                Your <GradientText>Profile</GradientText>
            </h1>

            <div className="max-w-2xl mx-auto space-y-10">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex items-center gap-6">
                    <img
                        src={user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full border-2 border-[var(--color-secondary-accent)]"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold font-[var(--font-heading)] mb-6">Change Password</h3>
                    <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-6">
                        <Input
                            label="Current Password"
                            type="password"
                            register={register('currentPassword')}
                            error={errors.currentPassword?.message as string}
                        />
                        <Input
                            label="New Password"
                            type="password"
                            register={register('newPassword')}
                            error={errors.newPassword?.message as string}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            register={register('confirmNewPassword')}
                            error={errors.confirmNewPassword?.message as string}
                        />
                        <div className="flex justify-end">
                            <div className="w-1/2">
                                <Button type="submit" isLoading={isSubmitting}>Update Password</Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold font-[var(--font-heading)] mb-6">Currency Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400">Display Currency:</span>
                            <select
                                value={currency.code}
                                onChange={(e) => {
                                    const selected = availableCurrencies.find(c => c.code === e.target.value);
                                    if (selected) setCurrency(selected);
                                }}
                                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary-accent)]"
                            >
                                {availableCurrencies.map(curr => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.symbol} {curr.code} - {curr.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-sm text-gray-400">
                            Note: Amounts will be displayed in the selected currency format. Default is Indian Rupee (₹).
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={logout} className="text-gray-400 hover:text-[var(--color-danger)] transition-colors font-semibold">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
