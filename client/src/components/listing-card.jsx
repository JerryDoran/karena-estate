import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

/* eslint-disable react/prop-types */
export default function ListingCard({ listing }) {
  return (
    <div className='bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          className='w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300 ease-in-out'
          alt='listing cover'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='text-lg font-semibold text-slate-700 truncate'>
            {listing.title}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='text-green-700 h-4 w-4' />
            <p className='text-sm text-gray-600 w-full truncate'>
              {listing.address}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-1 font-semibold'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.retailPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs '>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className='font-bold text-xs '>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
