import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function ProfilePage() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  async function handleFileUpload(image) {
    setUploadError(false);
    const fileName = new Date().getTime() + image.name; // creates unique file name
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
        toast.error('Image upload failed.');
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        // dispatch(updateUserFailure(data));
        return;
      }
      // dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      // dispatch(updateUserFailure(error));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='rounded-full h-24 object-cover cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {uploadError ? (
            <span className='text-red-600'>
              Error uploading image (must be less than 2MB
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-600'>{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-600'>Image upload successful</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-white p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-white p-3 rounded-lg'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-white p-3 rounded-lg'
          onChange={handleChange}
        />

        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase transition duration-250 hover:opacity-95 disabled:opacity-80'>
          Update
          {/* {loading ? 'Loading...' : 'Update'} */}
        </button>
      </form>
      <div className='flex justify-between pt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {/* <p className='text-red-700 mt-5'>
        {error && 'Oops something went wrong!'}
      </p> */}
    </div>
  );
}
