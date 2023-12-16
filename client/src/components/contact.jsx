import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

Contact.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getLandlord() {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {
        toast.error('Could not get landlord data');
      }
    }
    getLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            <span className='font-semibold'>Contact {landlord.username} </span>
            for the{' '}
            <span className='font-semibold'>
              {listing.title.toLowerCase()}
            </span>{' '}
            listing
          </p>
          <textarea
            className='w-full p-4 rounded-lg'
            placeholder='Type your message here'
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?Subject=Regarding ${listing.title}&body=${message}`}
            className='bg-slate-700 text-center p-3 text-white uppercase rounded-lg transition hover:opacity-90'
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
