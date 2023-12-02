import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-lg sm:text-2xl flex flex-wrap'>
            <span className='text-slate-500'>Karena</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <FaSearch className='text-slate-500' />
        </form>
        <nav>
          <ul className='flex items-center gap-4'>
            <Link to='/'>
              <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
                Home
              </li>
            </Link>

            <Link to='/about'>
              <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>
                About
              </li>
            </Link>

            <Link to='/profile'>
              {currentUser ? (
                <img
                  src={currentUser ? currentUser?.profilePicture : ''}
                  alt='profile picture'
                  className='h-8 rounded-full object-cover'
                />
              ) : (
                <li>Sign In</li>
              )}
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
