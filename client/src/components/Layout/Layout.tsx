import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = () => {
    return (
        <main className='App'>
            <Header />
            <Outlet />
            <Footer />
        </main>
    )
}

export default Layout;