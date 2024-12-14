import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState, useContext } from 'react';
import { PacmanLoader } from 'react-spinners';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../Components/Urls';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/csrf-token`, {
            credentials: 'include' // Include credentials in the request
        })
            .then(response => {
                console.log('CSRF Token Response:', response); // Log the response
                if (response.redirected) {
                    console.error('CSRF Token request was redirected to:', response.url);
                    throw new Error('User is not confirmed. Please confirm your email.');
                }
                return response.json();
            })
            .then(data => {
                console.log('CSRF Token Data:', data); // Log the data
                sessionStorage.setItem('csrf_token', data.csrf_token);
            })
            .catch(err => {
                console.error('Failed to fetch CSRF token', err);
                setError(err.message);
            });
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const csrfToken = sessionStorage.getItem('csrf_token');
            console.log('CSRF Token:', csrfToken); // Log CSRF token
            console.log('Login Data:', data); // Log login data
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data),
                credentials: 'include' // Include credentials in the request
            });

            const result = await response.json();
            console.log('Server Response:', result); // Log server response
            if (response.ok) {
                sessionStorage.setItem('authTokens', JSON.stringify(result.authTokens));
                setAuth(true);
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Login Error:', err); // Log the error
            setError('An error occurred. Please try again.');
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