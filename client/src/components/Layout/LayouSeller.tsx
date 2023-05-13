import { Outlet } from 'react-router-dom';
import Header from '../header/header.js';
import Footer from '../footer/footer.js';

const LayoutSeller = () => {
    return (
        <main className='App'>
            <Header />
            <Outlet />
            <Footer />
        </main>
    )
}

export default LayoutSeller;