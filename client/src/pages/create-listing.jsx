import { useState } from 'react';
import { storage } from '../firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    retailPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  function handleFileUpload() {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageLoading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          toast.success('Image(s) successfully uploaded!');
          setImageLoading(false);
        })
        .catch((error) => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          toast.error('Failed to upload images.');
          setImageLoading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      toast.error('Exceeded max images!');
      setImageLoading(false);
    }
  }

  function handleDeleteImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const fileName = new Date().getTime() + file.name; // creates unique file name
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done.`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  }

  function handleChange(e) {
    if (e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        setError('At least one image must be selected.');
        toast.error('Please select at least one image.');
        return;
      }
      if (+formData.retailPrice < +formData.discountPrice) {
        setError('Discount price cannot be less than retail price.');
        toast.error('Discount price less than retail price.');
        return;
      }
      setLoading(true);
      setError(false);

      const response = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success === false) {
        console.log(data);
        toast.error('Oops...Something went wrong.');
        setError(data.error);
      }
      toast.success('Listing created.');
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Title'
            className='border p-3 rounded-lg'
            id='title'
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-8 flex-wrap'>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='sell'
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='rent'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='parking'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='furnished'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                className='w-5'
                type='checkbox'
                id='offer'
                onChange={handleChange}
                checked={formData.offer}
              />
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
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className=''>Beds</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='bathrooms'
                min={1}
                max={10}
                required
                className='py-2 px-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className=''>Baths</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='retailPrice'
                min='50'
                max='10000000'
                required
                className='py-2 px-3 border w-[100px] border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.retailPrice}
              />
              <div className='flex flex-col items-center'>
                <p className=''>Retail Price </p>
                <span className='text-xs'>($ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className='flex gap-2 items-center'>
                <input
                  type='number'
                  id='discountPrice'
                  min={0}
                  max={5000000}
                  required
                  className='py-2 px-3 w-[100px] border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p className=''>Discount Price</p>
                  <span className='text-xs'>($ / Month)</span>
                </div>
              </div>
            )}
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
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type='button'
              disabled={imageLoading}
              onClick={handleFileUpload}
              className='p-3 text-green-700 border transition border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {imageLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-cover rounded-lg'
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  type='button'
                  className='p-2 bg-red-700 text-white transition rounded-lg text-xs uppercase hover:opacity-90 focus:border focus:border-red-800'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || imageLoading}
            className='p-3 mt-2 bg-slate-700 text-white rounded-lg uppercase transition hover:opacity-90 disabled:opacity-80'
          >
            {loading ? 'Creating Listing...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}
