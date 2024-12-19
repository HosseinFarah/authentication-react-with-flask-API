import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';
import { PacmanLoader } from 'react-spinners';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../Components/Urls';
import { fetchCsrfToken } from '../utils/csrfUtils';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setAuth, setIsConfirmed, setAdmin, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            try {
                await fetchCsrfToken();
            } catch (err) {
                setError(err.message);
            }
        };
        fetchToken();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const csrfToken = sessionStorage.getItem('csrf_token');
            if (!csrfToken) {
                throw new Error('CSRF token is missing');
            }
            console.log('CSRF Token:', csrfToken);
            console.log('Login Data:', data);
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();
            console.log('Server Response:', result);
            if (response.ok) {
                if (data.remember) {
                    localStorage.setItem('authTokens', JSON.stringify(result.authTokens));
                } else {
                    sessionStorage.setItem('authTokens', JSON.stringify(result.authTokens));
                }
                setAuth(true);
                setAdmin(result.admin);
                if (result.user) {
                    console.log('User Data:', result.user); // Debug log for user data
                    setUser(result.user); // Set the logged-in user data
                } else {
                    console.error('User data is missing in the response');
                }

                if (result.admin) {
                    console.log('Logged in user is an admin.');
                } else {
                    console.log('Logged in user is a regular user.');
                }

                setIsConfirmed(result.confirmed);
                sessionStorage.setItem('isConfirmed', JSON.stringify(result.confirmed));
                if (result.confirmed) {
                    toast.success('Login successful');
                    navigate('/');
                } else {
                    toast.error('User is not confirmed. Please confirm your email.');
                    navigate('/confirm');
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '150px' }} className='container'>
            <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className='form-group'>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="email" className='form-label'>Email</label>
                            <input type="email" {...register('email', { required: 'Email is required' })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }} />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className='form-label' htmlFor="password">Password</label>
                            <input type="password" {...register('password', { required: 'Password is required' })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }} />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <input type="checkbox" {...register('remember')} style={{ marginLeft: '0.5rem' }} />
                            <label className='form-label ms-1' htmlFor="remember">Remember Me</label>
                        </div>
                        <button type="submit" disabled={loading} className='btn btn-primary' style={{ padding: '0.5rem 2rem' }}>
                            {loading ? <PacmanLoader color='white' size={10} /> : 'Login'}
                        </button>
                        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;