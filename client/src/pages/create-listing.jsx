import { useState } from 'react';
import { storage } from '../firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-hot-toast';

export default function CreateListingPage() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  function handleFileUpload() {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setLoading(true);
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
          setLoading(false);
        })
        .catch((error) => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          toast.error('Failed to upload images.');
          setLoading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      toast.error('Exceeded max images!');
      setLoading(false);
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
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type='button'
              disabled={loading}
              onClick={handleFileUpload}
              className='p-3 text-green-700 border transition border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {loading ? 'Uploading...' : 'Upload'}
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
          <button className='p-3 mt-2 bg-slate-700 text-white rounded-lg uppercase transition hover:opacity-90 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
