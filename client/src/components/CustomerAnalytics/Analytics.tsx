import { useEffect, useState } from 'react';
import useCustomer from '../../hooks/UseCustomer';
import useAxiosPrivateCustomer from '../../hooks/useAxiosPrivateCustomer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

interface TotalSpent {
    total_spent: number;
    orders_id: number;
    orders_date: string;
}

const Analytics = () => {

    const { customer } = useCustomer();
    const axiosPrivateCustomer = useAxiosPrivateCustomer();

    const [totalSpentFilter, setTotalSpentFilter] = useState<number>(0);
    const [totalSpent, setTotalSpent] = useState<TotalSpent[]>([]);

    const getTotalSpentAllTime = async () => {
        try {
            const { data } = await axiosPrivateCustomer.get(`/customer/orders/allTime/${customer.customer_id}`);
            setTotalSpent(data.customer_spent);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTotalSpentAllTime();
        console.log(totalSpent)
    }, [])

    return (
        <div style={{ height: 400, width: 1000 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={totalSpent}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="orders_date" />
                    <YAxis domain={['dataMin', 'dataMax']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_spent" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Analytics