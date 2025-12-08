import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Welcome({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
            TrackingNum: '',
        });
    
        const submit = (e) => {
            e.preventDefault();
    
            post(route('parcel.track'));
        };
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <header className="grid grid-cols-2 items-center gap-2 py-10 ">
                    
                    <nav className="-mx-3 flex flex-1 justify-end">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                    
                </header>
                <main>
                    <form onSubmit={submit}>
                        <div>
                            
                            <InputLabel htmlFor="TrackingNum" value="TrackingNum" />
        
                            <TextInput
                                id="TrackingNum"
                                type="text"
                                name="TrackingNum"
                                value={data.TrackingNum} 
                                className="mt-1 block w-full text-gray-600"
                                autoComplete="TrackingNum"
                                isFocused={true}
                                onChange={(e) => setData('TrackingNum', e.target.value)} 
                            />
        
                            
                            <InputError message={errors.TrackingNum} className="mt-2" />
                        </div>
        
                        <div className="mt-4">
        
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Check Parcel
                            </PrimaryButton>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
