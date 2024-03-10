import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/style.css'
import Loader from './loader';
import LoginLogo from '../images/Logo.png'
// import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';

function Register(){

    useEffect(()=>{
        if(sessionStorage.getItem('UserId'))
        {
            navigate("/Dashboard")
        }
        else if(!sessionStorage.getItem('UserId'))
        {
            navigate("/Register")
        }
    },[])

    const [success, setSuccess] = useState(false)

    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [zip, setzip] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidMobile, setIsValidMobile] = useState(true);

    const handleEmailChange = (e) => {
        const enteredEmail = e.target.value;
        setEmail(enteredEmail);
    
        // Email validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(enteredEmail));
      };

      const handleMobileChange = (e) => {
        const enteredMobile = e.target.value;
        setMobile(enteredMobile);
    
        // Mobile number validation using a regular expression
        const mobileRegex = /^\d{10}$/;
        setIsValidMobile(mobileRegex.test(enteredMobile));
      };

     const navigate = useNavigate();
      
        const loginbtn = async () => {
          try {
            if (firstname.trim() === '' || email.trim() === '' || mobile.trim() === '' || zip.trim() === '' || password.trim() === '') {
                alert('Please fill in all fields before submitting.');
                return;
              }
              if (!isValidEmail) {
                alert('Please enter a valid email address.');
                return;
              }
              if (!isValidMobile) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
              }

            const formData = new FormData();
            formData.append('Name', firstname);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('mobile', mobile);
            formData.append('Zip', zip);
            formData.append('attachments', profileImage);

            const response = await axios.post(`http://localhost:5000/register`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
        
            console.log('Profile Updated:', response.data);

            setSuccess(true);
            
            

          } catch (error) {
            console.error('Login failed', error);
            // setLoading(false);
            // setShowErrorPopup(true);
           }
           //finally {
        //     // setLoading(false);
        //   }
        }

        
    function setOk(){
        setSuccess(true);
        navigate("/")
    }
       

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const backtoLogin = () =>{
        navigate("/")
    }

        
     

    return(
    <>
        {success &&(
            <div className='box-full-popup'>
                <div className="error-popup">
                    <Icon icon="ep:success-filled" className='error-login' />
                    <p className='projectDetailsp redp mt-3 mb-0'>Success</p>
                    <p className='projectDetailsp'>Details Registered Successfully, Press Ok </p>
                    <button className='btn btn-primary' onClick={setOk}>Ok</button>
                </div>
            </div>
        )}

        <section className='login-page'>
            <div className='login-page-up d-flex align-items-center justify-content-center'>
                <img src={LoginLogo} className='image-logo-login' alt='login-logo' />
            </div>
            <div className='login-page-box'>
                <div className='sign-up-form pt-3'>
                    <div className='text-center'>
                       <h3><strong>Register Yourself</strong></h3>
                    </div>
                    <div className='form-box'>
                        <form>
                            <div className='d-flex mb-3'>
                                <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                                    <label className='lableInput'>Name <span style={{color:'red'}}>*</span></label>
                                    <input type="text" class="form-control loginBox" placeholder="Enter First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                </div>
                                <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                                    <label className='lableInput'>Email <span style={{color:'red'}}>*</span></label>
                                    <input type="email" class="form-control loginBox" placeholder="Enter Email" value={email} onChange={handleEmailChange} />
                                </div>
                            </div>
                            <div className='d-flex mb-3'>
                                <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                                    <label className='lableInput'>Mobile No. <span style={{color:'red'}}>*</span></label>
                                    <input type="text" class="form-control loginBox" placeholder="Enter Mobile Number" value={mobile} onChange={handleMobileChange}/>
                                </div>
                                <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                                    <label className='lableInput'>Zip <span style={{color:'red'}}>*</span></label>
                                    <input type="text" class="form-control loginBox" placeholder="Enter Last Name" value={zip} onChange={(e) => setzip(e.target.value)} />
                                </div>
                            </div>
                            <div className='d-flex mb-3'>
                               <div class="form-group w-100 p-1" style={{position: 'relative'}}>
                                    <label className='lableInput'>Password <span style={{color:'red'}}>*</span></label>
                                    <input type="password" class="form-control loginBox" id="exampleInputPassword1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                                <div class="form-group w-100 p-1">
                                    {/* <label className='p-0' for="exampleFormControlTextarea1" style={{fontSize: '14px'}}>Profile Image</label> */}
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
                            <div className='text-center pt-2'>
                               <button type="button" class="btn btn-primary login" onClick={loginbtn}>Submit</button>
                            </div>
                        </form>
                        <div className='mt-3'>
                            <p className='NewUser p-0 m-0'>Already Registered ?</p>
                            <p className='RegisterNew p-0' onClick={backtoLogin}>Back to Login</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
   )
}

export default Register