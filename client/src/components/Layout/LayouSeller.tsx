import { Outlet } from 'react-router-dom';
import Header from '../header/Header.js';
import Footer from '../footer/footer.js';

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