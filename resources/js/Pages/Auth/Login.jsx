import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        StaffID: '',
        Password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            
            onFinish: () => reset('Password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    
                    <InputLabel htmlFor="StaffID" value="Staff ID" />

                    <TextInput
                        id="StaffID"
                        type="text"
                        name="StaffID"
                        value={data.StaffID} 
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('StaffID', e.target.value)} 
                    />

                    
                    <InputError message={errors.StaffID} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="Password" value="Password" />

                    <TextInput
                        id="Password"
                        type="password"
                        name="Password"
                        value={data.Password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('Password', e.target.value)} 
                    />

                    <InputError message={errors.Password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}