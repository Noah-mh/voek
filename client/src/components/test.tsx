import React, { useEffect } from 'react'
import useAxiosPrivateCustomer from '../hooks/useAxiosPrivateCustomer'
import { Link } from 'react-router-dom'

const Test = () => {
    const axiosPrivateCustomer = useAxiosPrivateCustomer()
    useEffect(() => {
       axiosPrivateCustomer.get('/Test')
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }, [])
  return (
    <div><Link to='/monkey'>Test</Link></div>
  )
}

export default Test