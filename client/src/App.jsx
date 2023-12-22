import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import SignUpPage from './pages/sign-up';
import AboutPage from './pages/about';
import ProfilePage from './pages/profile';
import Header from './components/header';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/private-route';
import CreateListingPage from './pages/create-listing';
import UpdateListingPage from './pages/update-listing';
import ListingPage from './pages/listing';
import SearchPage from './pages/search';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/listing/:listingId' element={<ListingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/create-listing' element={<CreateListingPage />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListingPage />}
          />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
