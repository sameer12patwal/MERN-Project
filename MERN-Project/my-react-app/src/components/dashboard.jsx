// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState, useEffect} from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [myData, setData] = useState('');

  useEffect(()=>{
    if(!sessionStorage.getItem('UserId'))
    {
        navigate("/")
    }
},[])

  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [zip, setzip] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [refreshEffect, setRefreshEffect] = useState(false);


useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const user = sessionStorage.getItem('UserId');

    const response = await axios.get(`http://localhost:5000/user/${user}`, {
      
    });
    const thisData = response.data.user;
    setData(thisData);
    setFirstname(thisData.Name)
    setEmail(thisData.email)
    setzip(thisData.Zip)
    setMobile(thisData.mobile)
    setProfileImage(thisData.attachments[0])
    sessionStorage.setItem('Email', thisData.email);
    sessionStorage.setItem('Name', thisData.Name);
    sessionStorage.setItem('Mobile', thisData.mobile);
    sessionStorage.setItem('Zip', thisData.Zip);
    sessionStorage.setItem('ProfilePic', thisData.attachments[0]);
    console.log(thisData)
  } catch (error) {
    console.error('Error fetching data', error);
  }
};


  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  
const updateDetails = async (e) => {
  e.preventDefault();
  try{
    var userid = sessionStorage.getItem('UserId')

        const formData = new FormData();

        formData.append('Name', firstname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('mobile', mobile);
        formData.append('Zip', zip);
        formData.append('attachments', profileImage);

        const response = await axios.put(`http://localhost:5000/user/updateData/${userid}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
        console.log('Profile Updated:', response.data);

        fetchData();
        setShowModal(false);
        setRefreshEffect(true);
        
        

      } catch (error) {
        console.error('Login failed', error);
        // setLoading(false);
        // setShowErrorPopup(true);
        }

    
};

  

  
  return (
    <section className='dashboard-Mytask'>
      <div className='d-flex align-items-center justify-content-between mb-4'>
          <h6 className='m-0'><strong>User Profile Details</strong></h6>
          <button className="btn btn-primary Editbtn" onClick={() => setShowModal(true)}>Edit Profile</button>
      </div>
       
       <div>
          <div className='Profile-area'>
              <div>
                  <img src={`http://localhost:5000/${sessionStorage.getItem('ProfilePic')}`} alt="Profile Picture" className='profileimagebox'/>
              </div>
              <div className='d-flex align-items-center gap-3 mb-2'>
                  <Icon icon="ph:user-bold" />
                  <p className='p-0 m-0'>{sessionStorage.getItem('Name')}</p>
              </div>
              <div className='d-flex align-items-center gap-3 mb-2'>
                  <Icon icon="ic:outline-email" />
                  <p className='p-0 m-0'>{sessionStorage.getItem('Email')}</p>
              </div>
              <div className='d-flex align-items-center gap-3 mb-2'>
                  <Icon icon="clarity:mobile-solid" />
                  <p className='p-0 m-0'> {sessionStorage.getItem('Mobile')}</p>
              </div>
              <div className='d-flex align-items-center gap-3 mb-2'>
                  <Icon icon="fa6-regular:address-card" />
                  <p className='p-0 m-0'>{sessionStorage.getItem('Zip')}</p>
              </div>
          </div>
          
      </div>
      {/* Modal */}
      {showModal && myData && (
            <div className="modal" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Profile</h5>
                    <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <form>
                    <div className="modal-body">
                      {/* Form inputs */}
                      <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                          <label className='lableInput'>Name</label>
                          <input type="text" class="form-control loginBox" placeholder="Enter Full Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                      </div>
                      <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                          <label className='lableInput'>Email</label>
                          <input type="email" class="form-control loginBox" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                          <label className='lableInput'>Mobile No.</label>
                          <input type="text" class="form-control loginBox" placeholder="Enter Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)}/>
                      </div>
                      <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                          <label className='lableInput'>Zip</label>
                          <input type="text" class="form-control loginBox" placeholder="Enter Zip" value={zip} onChange={(e) => setzip(e.target.value)} />
                      </div>
                      <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                          <label className='lableInput'>Password</label>
                          <input type="password" class="form-control loginBox" id="exampleInputPassword1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                      </div>
                      <div class="form-group w-100 p-1">
                          <label className='p-0' for="exampleFormControlTextarea1" style={{fontSize: '14px'}}>Profile Image</label>
                          <div className="custom-file w-100 mt-1 p-1">
                          <input
                          type="file"
                          className="custom-file-input"
                          id="profileImage"
                          onChange={handleProfileImageChange}
                          />
                          </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary cancel" onClick={updateDetails}>Close</button>
                      <button type="submit" className="btn btn-primary Editbtn" onClick={updateDetails}>Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
    </section>
  );
};

export default Dashboard;