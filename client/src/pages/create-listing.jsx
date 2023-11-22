export default function CreateListingPage() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-8 flex-wrap'>
            <div className='flex gap-2'>
              <input className='w-5' type='checkbox' id='sale' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input className='w-5' type='checkbox' id='rent' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input className='w-5' type='checkbox' id='parking' />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input className='w-5' type='checkbox' id='furnished' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input className='w-5' type='checkbox' id='offer' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='bedrooms'
                min={1}
                max={10}
                required
                className='py-2 px-3 border border-gray-300 rounded-lg'
              />
              <p className=''>Beds</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='bedrooms'
                min={1}
                max={10}
                required
                className='py-2 px-3 border border-gray-300 rounded-lg'
              />
              <p className=''>Baths</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='retail'
                min={1}
                max={10}
                required
                className='py-2 px-3 border w-[100px] border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p className=''>Retail Price </p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='discount'
                min={1}
                max={10}
                required
                className='py-2 px-3 w-[100px] border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p className=''>Discount Price</p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2 text-sm'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button className='p-3 text-green-700 border transition border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              Upload
            </button>
          </div>
          <button className='p-3 mt-2 bg-slate-700 text-white rounded-lg uppercase transition hover:opacity-90 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
