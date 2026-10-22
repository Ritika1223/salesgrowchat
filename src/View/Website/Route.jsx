import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Success from './Pages/Success';
import Contact from './Pages/Contact';
import HeaderPage from './Components/Header';
import About from './Pages/About';
import Footer from './Components/Footer';
import IntroLanding from './Pages/IntroLanding';
import GuestStart from './Pages/GuestStart';

const withHeaderFooter = (Component) => (
    <>
        {/* <HeaderPage /> */}
        <Component />
        {/* <Footer /> */}
    </>
);

const Routes = [
    {
        path: '/',
        element: withHeaderFooter(IntroLanding)
    },
    {
        path: '/guest',
        element: withHeaderFooter(GuestStart)
    },
    {
        path: '/home',
        element: withHeaderFooter(Home)
    },
    {
        path: '/contact',
        element: withHeaderFooter(Contact)
    },
    {
        path: '/about',
        element: withHeaderFooter(About)
    },
    {
        path: '/login',
        element: withHeaderFooter(IntroLanding)
    },
    {
        path: '/signup',
        element: withHeaderFooter(Signup)
    },
    {
        path: '/success',
        element: withHeaderFooter(Success)
    },
];

export default Routes;