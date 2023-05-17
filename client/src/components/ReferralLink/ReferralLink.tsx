import useCustomer from "../../hooks/UseCustomer"
import useAxiosPrivateCustomer from "../../hooks/useAxiosPrivateCustomer"
import { useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-svg-core'

const ReferralLink = () => {

    const [link, setLink] = useState<string>("");
    const { customer } = useCustomer();
    const axiosPrivateCustomer = useAxiosPrivateCustomer();
    const url = window.location.href;
    const text = url.split('//')[1].split('/')[0];

    useEffect(() => {
        const getLink = async () => {
            const { data } = await axiosPrivateCustomer.get(`/customer/referral-id/${customer.customer_id}`);
            setLink(`${text}/signup?referral_id=${data.referral_id}`);
        }
        getLink();
    }, [])


    return (
        <div className="flex flex-row items-center">
            <p className="mr-2">{link}</p>
            <CopyToClipboard text={link}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Copy Link
                </button>
            </CopyToClipboard>
        </div>
    )
}

export default ReferralLink