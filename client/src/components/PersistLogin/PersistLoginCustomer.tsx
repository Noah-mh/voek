import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useRefreshTokenCustomer from '../../hooks/useRefreshTokenCustomer';
import useCustomer from '../../hooks/UseCustomer';

const PersistLoginCustomer = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshTokenCustomer();
  const { customer } = useCustomer();

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
    !customer?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    }
  }, [])

  return (
    <>
      {
        isLoading ? <p>Loading...</p>
          : <Outlet />
      }
    </>
  )
}

export default PersistLoginCustomer