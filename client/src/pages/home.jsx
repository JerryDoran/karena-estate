import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingCard from '../components/listing-card';
import 'swiper/css/bundle';

export default function HomePage() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  console.log(saleListings);

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const response = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await response.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchRentListings() {
      try {
        const response = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await response.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    async function fetchSaleListings() {
      try {
        const response = await fetch('/api/listing/get?type=sell&limit=4');
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto items-center sm:items-start'>
        <h1 className='text-slate-700 font-bold text-center sm:text-left text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-600 text-lg text-center sm:text-left sm:text-xl w-[80%]'>
          Karena Estate is the best place to find your next perfect place to
          live. We have a wide range of properties to choose from.
        </div>
        <Link
          to='/search'
          className=' text-white rounded-lg bg-slate-700 w-fit py-3 px-6 font-semibold transition hover:bg-slate-800'
        >
          Let&apos;s start now...
        </Link>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings */}
      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600 pb-2'>
                Recent Offers
              </h2>
              <Link
                className='text-sm text-sky-800 bg-sky-100 px-3 py-2 rounded-full hover:bg-sky-200'
                to='/search?offer=true'
              >
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600 pb-2'>
                Recent places for rent
              </h2>
              <Link
                className='text-sm text-sky-800 bg-sky-100 px-3 py-2 rounded-full hover:bg-sky-200'
                to='/search?type=rent'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-4'>
              <h2 className='text-2xl font-semibold text-slate-600 pb-2'>
                Recent places for sale
              </h2>
              <Link
                className='text-sm text-sky-800 bg-sky-100 px-3 py-2 rounded-full hover:bg-sky-200'
                to='/search?sell=true'
              >
                Show more sales listings
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
