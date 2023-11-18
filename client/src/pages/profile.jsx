import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function ProfilePage() {
  const { currentUser } = useSelector((state) => state.user);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data) {
    try {
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const userData = await res.json();

      if (userData.success === false) {
        setError(true);
        reset();
        return;
      }
      reset();
      toast.success('Successfully registered!');
    } catch (error) {
      toast.error('Oops! Something went wrong.');
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <img
          src={currentUser.profilePicture}
          alt='profile'
          className='rounded-full h-24 object-cover cursor-pointer self-center mt-2'
        />
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-white p-3 rounded-lg'
          {...register('username')}
        />
        {errors.username?.message && (
          <p className='text-sm text-red-400 -mt-2'>
            {errors.username.message}
          </p>
        )}
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-white p-3 rounded-lg'
          {...register('email')}
        />
        {errors.email?.message && (
          <p className='text-sm text-red-400 -mt-2'>{errors.email.message}</p>
        )}
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-white p-3 rounded-lg'
          {...register('password')}
        />
        {errors.password?.message && (
          <p className='text-sm text-red-400 -mt-2'>
            {errors.password.message}
          </p>
        )}
        <button
          disabled={isSubmitting}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase transition duration-250 hover:opacity-95 disabled:opacity-80'
        >
          {isSubmitting ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between pt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {/* <p className='text-red-700 mt-5'>
        {error && 'Oops something went wrong!'}
      </p> */}
    </div>
  );
}
