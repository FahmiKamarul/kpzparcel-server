import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    // 1. Updated state to match your Database Columns exactly
    const { data, setData, post, processing, errors, reset } = useForm({
        StaffID: '',
        Name: '',
        PhoneNum: '',
        Address: '',
        Role: '',
        Password: '',
        Password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('Password', 'Password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                {/* --- StaffID --- */}
                <div>
                    <InputLabel htmlFor="StaffID" value="Staff ID" />

                    <TextInput
                        id="StaffID"
                        name="StaffID"
                        value={data.StaffID}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('StaffID', e.target.value)}
                        required
                    />

                    <InputError message={errors.StaffID} className="mt-2" />
                </div>

                {/* --- Name --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="Name" value="Name" />

                    <TextInput
                        id="Name"
                        name="Name"
                        value={data.Name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={(e) => setData('Name', e.target.value)}
                        required
                    />

                    <InputError message={errors.Name} className="mt-2" />
                </div>

                {/* --- PhoneNum --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="PhoneNum" value="Phone Number" />

                    <TextInput
                        id="PhoneNum"
                        name="PhoneNum"
                        value={data.PhoneNum}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('PhoneNum', e.target.value)}
                        required
                    />

                    <InputError message={errors.PhoneNum} className="mt-2" />
                </div>

                {/* --- Address --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="Address" value="Address" />

                    <TextInput
                        id="Address"
                        name="Address"
                        value={data.Address}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('Address', e.target.value)}
                        required
                    />

                    <InputError message={errors.Address} className="mt-2" />
                </div>

                {/* --- Role --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="Role" value="Role" />

                    {/* I used a simple Text Input, but you might want a Dropdown later */}
                    <TextInput
                        id="Role"
                        name="Role"
                        value={data.Role}
                        className="mt-1 block w-full"
                        placeholder="e.g. Staff or Manager"
                        onChange={(e) => setData('Role', e.target.value)}
                        required
                    />

                    <InputError message={errors.Role} className="mt-2" />
                </div>

                {/* --- Password --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="Password" value="Password" />

                    <TextInput
                        id="Password"
                        type="password"
                        name="Password"
                        value={data.Password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('Password', e.target.value)}
                        required
                    />

                    <InputError message={errors.Password} className="mt-2" />
                </div>

                {/* --- Confirm Password --- */}
                <div className="mt-4">
                    <InputLabel htmlFor="Password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="Password_confirmation"
                        type="password"
                        name="Password_confirmation"
                        value={data.Password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('Password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.Password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}