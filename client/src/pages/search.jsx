export default function SearchPage() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-bold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label className='font-bold'>Type:</label>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='all' className='w-5' />
              <span className='text-sm'>Rent & Sell</span>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='rent' className='w-5' />
              <span className='text-sm'>Rent</span>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='sell' className='w-5' />
              <span className='text-sm'>Sell</span>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='offer' className='w-5' />
              <span className='text-sm'>Offer</span>
            </div>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <label className='font-bold'>Ammenities:</label>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='parking' className='w-5' />
              <span className='text-sm'>Parking</span>
            </div>
            <div className='flex items-center gap-2'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span className='text-sm'>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-bold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-3'>
              <option value=''>Price high to low</option>
              <option value=''>Price low to high</option>
              <option value=''>Latest</option>
              <option value=''>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg transition hover:opacity-90'>
            Search
          </button>
        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>
      </div>
    </div>
  );
}
