import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useSeller from '../../hooks/useSeller.js';
import useRefreshTokenSeller from '../../hooks/useRefreshTokenSeller.js';
import Loader from '../Loader/Loader.js';

const PersistLoginSeller = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshTokenSeller();
  const { seller } = useSeller();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
         await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    }
    !seller?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <>
      {
        isLoading ? <div className="flex justify-center items-center">
        <Loader />
      </div>
          : <Outlet />
      }
    </>
  )
}

export default PersistLoginSeller