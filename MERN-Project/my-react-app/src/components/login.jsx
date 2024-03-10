import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/style.css'
import Loader from './loader';
import LoginLogo from '../images/Logo.png'
// import { useApi } from '../APIConfig/ApiContext';
import { Icon } from '@iconify/react';

function Login(){

    useEffect(()=>{
        if(sessionStorage.getItem('UserId'))
        {
            navigate("/Dashboard")
        }
        else if(!sessionStorage.getItem('UserId'))
        {
            navigate("/")
        }
    },[])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleEmailChange = (e) => {
        const enteredEmail = e.target.value;
        setEmail(enteredEmail);
    
        // Email validation using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValidEmail(emailRegex.test(enteredEmail));
      };


     const navigate = useNavigate();
      
        const loginbtn = async () => {
          try {
              if (!isValidEmail) {
                alert('Please enter a valid email address.');
                return;
              }
            // setLoading(true);
            const response = await axios.post(`http://localhost:5000/login`, {
              email: email,
              password: password
            });

            navigate("/Dashboard")

            console.log(response.data);
            sessionStorage.setItem('Email', response.data.user.email);
            sessionStorage.setItem('Name', response.data.user.Name);
            sessionStorage.setItem('UserId', response.data.user.userId);
            sessionStorage.setItem('Mobile', response.data.user.mobile);
            sessionStorage.setItem('Zip', response.data.user.Zip);
            sessionStorage.setItem('ProfilePic', response.data.user.attachments);

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

        const RegisterClicked = () => {
            navigate("/Register")
        }
        
     

    return(
    <>


        <section className='login-page'>
            <div className='login-page-up d-flex align-items-center justify-content-center'>
                <img src={LoginLogo} className='image-logo-login' alt='login-logo' />
            </div>
            <div className='login-page-box'>
                <div className='sign-up-form pt-3'>
                    <div className='text-center'>
                       <h3><strong>Log In</strong></h3>
                    </div>
                    <div className='form-box'>
                            <div className='row d-flex'>
                                <div className='col-lg-3'>

                                </div>
                                <div className='col-lg-6'>
                                   <form>
                                        <div class="form-group w-100 p-1 mb-4 mt-4" style={{position: 'relative'}}>
                                            <label className='lableInput'>Email</label>
                                            <input type="email" class="form-control loginBox" placeholder="Enter Email" value={email} onChange={handleEmailChange} />
                                        </div>

                                        <div class="form-group w-100 p-1 mb-4" style={{position: 'relative'}}>
                                            <label className='lableInput'>Password</label>
                                            <input type="password" class="form-control loginBox" id="exampleInputPassword1" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div className='text-center pt-2'>
                                            <button type="button" class="btn btn-primary login" onClick={loginbtn}>Login</button>
                                        </div>
                                   </form>
                                   <div className='mt-3'>
                                      <p className='NewUser p-0 m-0'>New User ?</p>
                                      <p className='RegisterNew p-0' onClick={RegisterClicked}>Register yourself</p>
                                   </div>
                                </div>
                                <div className='col-lg-3'>
                                    
                                </div>
                               
                            </div>
 
                           
                            
                    </div>
                </div>
            </div>
        </section>
    </>
   )
}

export default Login