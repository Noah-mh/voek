import { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import useSeller from '../../hooks/useSeller';
import useAxiosPrivateSeller from '../../hooks/useAxiosPrivateSeller';


const ViewCustomerOrders = () => {

    const axiosPrivateSeller = useAxiosPrivateSeller();
    const { seller } = useSeller();
    const searchParams = new URLSearchParams(location.search);
    const orders_id: string | null = searchParams.get('orders_id');

    useEffect(() => {
        const getCustomerOrder = async () => {
            const result = await axiosPrivateSeller.get(`/seller/customer/${orders_id}/${seller.seller_id}`);
            console.log(result.data);
        }
        getCustomerOrder()
    }, [])

    return (
        <div>ViewCustomerOrders</div>
    )
}

export default ViewCustomerOrders