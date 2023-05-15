import { Outlet } from 'react-router-dom';
import Header from '../Header/header.js';
import Footer from '../Footer/Footer.js';

const LayoutSeller = () => {
    return (
        <main className='App'>
            <Header isSeller={true}/>
            <Outlet />
            <Footer />
        </main>
    )
}

export default LayoutSeller;