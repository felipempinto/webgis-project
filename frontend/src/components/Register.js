import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/user';
import NavbarComponent from './include/Navbar';
import { Navigate } from 'react-router-dom';
import './Register.css'

function Register() {
  const dispatch = useDispatch();
  const { registered,  } = useSelector(state => state.user);
  const [registerError, setRegisterError] = useState('');
  const [formData,setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
  })

  const { username,email,password,password2 } = formData;

  const onChange = e => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const onSubmit = e => {
        e.preventDefault();
        dispatch(register({username,email,password,password2}))
        .then(data=>{
          console.log(data);
          if (data.meta.requestStatus==='rejected') {
            setRegisterError(data.payload.username || data.payload.email || data.payload.error || data.payload.non_field_errors);
          } else {
            console.log("SUCESS")          
          }        
        })
        .catch(error => {
          console.log("ERROR",error);
          console.error('Login error:', error);
    });};

  if (registered) return <Navigate to='/login'/>;

  var url = process.env.PUBLIC_URL

  return (
    <div className='overlay-register room-register register-position'>

      <div class="row">
        <div class="col s12 m5 offset-m4">
          <div class="card-panel rounded-card ">

            <div className='center'>
              <a href="/" className="brand-logo">
                <img className="img-logo" src={url + "/logo.png"} alt="Web GIS Logo" height={100} />
              </a>
            </div>
            <div className='container '>
            <h3 className='center'>Register</h3>
            
              <form onSubmit={onSubmit}>

                <div className='row'>
                  <div className='input-field col s12'>
                    <i class="material-icons prefix">account_circle</i>
                    <input
                      type="text"
                      // id="username"
                      id="icon_prefix"
                      name="username"
                      value={formData.username}
                      onChange={onChange}
                    />
                    <label for="icon_prefix">Username</label>
                  </div>
                
                  <div className='input-field col s12'>
                    <i class="material-icons prefix">email</i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                    />
                    <label for="email">Email</label>
                  </div>

                <div className='input-field col s12'>
                  <i class="material-icons prefix">lock</i>
                  {/* <label htmlFor="password">Password</label> */}
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                  />
                  <label for="password">Password</label>
                </div>
                <div className='input-field col s12'>
                  <i class="material-icons prefix">lock</i>
                  {/* <label htmlFor="password2">Confirm Password</label> */}
                  <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={onChange}
                  />
                  <label for="password2">Confirm password</label>
                </div>
                {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
                <div className='center'>
                  <button className="waves-effect waves-light btn purple" type="submit">Create Account</button>
                </div>
                <div className='section center'>
                  Already have an account? <a href="/login" class="col s12">Sign in</a>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
