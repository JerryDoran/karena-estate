import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import OAuth from '../components/OAuth';

const formSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUpPage() {
  const navigate = useNavigate();
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

  const [error, setError] = useState(false);

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
      navigate('/sign-in');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-10'>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
          {isSubmitting ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500 underline'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>
        {error && 'Oops something went wrong!'}
      </p>
    </div>
  );
}
