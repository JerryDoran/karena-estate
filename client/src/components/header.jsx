import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-lg sm:text-2xl flex flex-wrap'>
            <span className='text-slate-500'>Karena</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-2 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-500' />
          </button>
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
