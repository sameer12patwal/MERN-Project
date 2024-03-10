// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState, useEffect} from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const NearBy = () => {

  const navigate = useNavigate();

  const [myData, setData] = useState('');

  useEffect(()=>{
   if(!sessionStorage.getItem('UserId'))
    {
        navigate("/")
    }
},[])


useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
    try {
      const userId = sessionStorage.getItem('UserId');
      const userZip = sessionStorage.getItem('Zip');
  
      const response = await axios.get(`http://localhost:5000/users`);
      const allUsers = response.data.users; // Access the 'users' array from the response data
  
      // Remove the current user from the list based on userID
      const filteredUsers = allUsers.filter(user => user.userId !== parseInt(userId));
  
      // Filter users based on their Zip codes
      const filteredByZip = filteredUsers.filter(user => user.Zip === parseInt(userZip));

      // Limit the number of entries to 5 if there are more than 5 users
      let limitedUsers = filteredByZip;
      if (filteredByZip.length > 5) {
        limitedUsers = filteredByZip.slice(0, 5);
        setData(limitedUsers);
      }
      console.log(filteredByZip);
    } catch (error) {
      console.error('Error fetching data', error);
    }
};
  

  return (
    <section className='dashboard-Mytask'>
       <h6 className='mb-4'><strong>People Nearby Me</strong></h6>
       <div>
            {myData && (
            <div className='Profile-area'>
                <div className='row d-flex'>
                {myData.map(item => (
                    <div className='col-lg-6' key={item._id}>
                        <div className='box-details'>
                            <div className='d-flex align-items-center gap-3'>
                                <img src={`http://localhost:5000/${item.attachments[0]}`} alt="User" className='imgProfileNearby' />
                                <div>
                                    <div className='d-flex align-items-center gap-3 mb-2'>
                                        <Icon icon="ph:user-bold" />
                                        <p className='p-0 m-0'>{item.Name}</p>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 mb-2'>
                                        <Icon icon="ic:outline-email" />
                                        <p className='p-0 m-0'>{item.email}</p>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 mb-2'>
                                        <Icon icon="clarity:mobile-solid" />
                                        <p className='p-0 m-0'>{item.mobile}</p>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
    </section>
  );
};

export default NearBy;