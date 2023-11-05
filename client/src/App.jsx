import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SignInPage from './pages/sign-in';
import SignUpPage from './pages/sign-up';
import AboutPage from './pages/about';
import ProfilePage from './pages/profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
