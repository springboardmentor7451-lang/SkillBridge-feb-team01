import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    // const { login, setUser } = useContext(AuthContext);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const userData=await login(email, password);
            if (userData.role === 'volunteer') {
                navigate('/dashboard');
            } else if (userData.role === 'ngo') {
                navigate('/profile');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
//     const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//         // 🔥 TEMP MOCK LOGIN (No backend required)
//         const mockUser = {
//             name: "Adeela Azeez",
//             email: email,
//             role: email.includes("ngo") ? "ngo" : "volunteer",
//             skills: ["React", "UI/UX", "Problem Solving"]
//         };
//         setUser(mockUser);
//         // Simulate small delay
//         await new Promise((resolve) => setTimeout(resolve, 800));

//         // Redirect based on role
//         if (mockUser.role === "volunteer") {
//             navigate("/dashboard");
//         } else {
//             navigate("/profile");
//         }

//     } catch (err) {
//         setError("Login failed.");
//     } finally {
//         setIsLoading(false);
//     }
// };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue to SkillBridge</p>

                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 8 }}></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In →'
                        )}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
