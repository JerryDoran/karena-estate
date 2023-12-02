import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { storage } from '../firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUser,
} from '../redux/user/userSlice';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function ProfilePage() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  // const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

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
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        toast.error(error.error);
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success('Profile successfully updated');
      // setUpdateSuccess(true);
    } catch (error) {
      toast.error('Could not update your profile information.');
      dispatch(updateUserFailure(error));
    }
  }

  async function handleDeleteAccount() {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.error);
        return;
      }

      dispatch(deleteUserSuccess(data));
      toast.success('Your account has been deleted.');
    } catch (error) {
      dispatch(deleteUserFailure(error));
      console.log(error);
      toast.error('Something went wrong.');
    }
  }

  async function handleSignout() {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOutUser());
      toast.success('You are signed out.');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong.');
    }
  }

  async function handleShowListings() {
    try {
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();
      console.log(data);

      if (data.success === false) {
        toast.error('Could not fetch your listings');
        return;
      }

      setUserListings(data);
      console.log(userListings);
    } catch (error) {
      console.log(error);
      toast.error('Could not display your listings');
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
          defaultValue={currentUser.username}
        />

        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-white p-3 rounded-lg'
          onChange={handleChange}
          defaultValue={currentUser.email}
        />

        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-white p-3 rounded-lg'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase transition duration-250 hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90'
          to='/create-listing'
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between pt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      {/* <p className='text-red-700 mt-5'>{error ? error.error : ''}</p> */}
      {/* <p className='text-green-700 mt-5'>{updateSuccess ? 'User successfully updated' : ''}</p> */}
      <div className='w-full flex justify-center p-5'>
        <button
          className='text-white text-sm hover:opacity-90 bg-green-700 rounded-md w-fit py-2 px-3 text-center'
          onClick={handleShowListings}
        >
          Show Listings
        </button>
      </div>
      <div className='pt-10'>
        <h1 className='font-semibold text-xl pb-2'>Your Listings</h1>
        {userListings &&
          userListings.length > 0 &&
          userListings.map((listing) => (
            <div
              key={listing._id}
              className='flex justify-between items-center space-x-5 border p-3'
            >
              <Link
                to={`/listing/${listing._id}`}
                className='flex items-center gap-10 w-full'
              >
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='w-24 object-contain rounded-md'
                />
                <p className='font-semibold flex-1 hover:underline truncate'>
                  {listing.title}
                </p>
              </Link>
              <FaTrash className='cursor-pointer text-gray-700' />
              <FaEdit className='cursor-pointer text-gray-700' />
            </div>
          ))}
      </div>
    </div>
  );
}
