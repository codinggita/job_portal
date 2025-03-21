import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant.js';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice.js';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "", // This is to hold the user type (student or recruiter)
    });

    const { loading, user } = useSelector(store => store.auth); // Access the loading state
    const [userType, setUserType] = useState('student');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle input change for email and password
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    };

    // Handle radio button change for user type
    const handleRadioChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
            ...input,
            role: userType, // Include role (userType) based on selected radio button
        };
    
        try {
            dispatch(setLoading(true)); // Set loading state to true
            const res = await axios.post(`${USER_API_END_POINT}/login`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
    
            if (res.data.success) {
                console.log('Success:', res.data.message);
                toast.success(res.data.message);  
    
                // Store studentId only if the role is 'student'
                if (res.data.user.role === 'student') {
                    localStorage.setItem('studentId', res.data.user._id);
                }   
    
                // Redirect after a short delay (if needed)
                setTimeout(() => navigate("/"), 1000);
            
                dispatch(setUser(res.data.user));
            }
    
        } catch (error) {
            console.log(error);
    
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred, please try again!');
            }
    
        } finally {
            dispatch(setLoading(false));
        }
    
        // Validate form fields
        if (!input.email || !input.password) {
            alert('Please fill in all the fields.');
            return;
        }
    };
    
    useEffect(() => {
        if(user){
            navigate('/');
        }
    });

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
                <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="font-bold text-3xl text-center text-[#1876D1] mb-6">Login</h1>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Address */}
                        <div>
                            <TextField
                                id="email"
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Radio Buttons for user type */}
                        <div>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    aria-label="user-type"
                                    name="user-type"
                                    value={userType}
                                    onChange={handleRadioChange}
                                    row
                                >
                                    <FormControlLabel
                                        value="student"
                                        control={<Radio />}
                                        label="Student"
                                    />
                                    <FormControlLabel
                                        value="recruiter"
                                        control={<Radio />}
                                        label="Recruiter"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        {/* Login Button */}
                        {loading ? (
                            <Button className='w-full my-4' disabled>
                                <CircularProgress size={24} color="inherit" />
                            </Button> // Show spinner
                        ) : (
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </div>
                        )}

                        {/* Sign Up link */}
                        <div className="text-center text-sm text-gray-500 mt-4">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#1876D1] hover:text-[#1568B1]">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </>
    );
}

export default Login;
