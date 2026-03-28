import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token    = params.get('token');
        const username = params.get('username');
        const email    = params.get('email');
        const avatar   = params.get('avatar');

        if (token) {
            // Store JWT token
            localStorage.setItem('eco_token', token);

            // Store user info (compatible with existing eco_user shape)
            const userSession = { name: username, email, picture: avatar, authenticated: true };
            localStorage.setItem('eco_user', JSON.stringify(userSession));

            // Notify any listeners (Navbar re-reads auth state)
            window.dispatchEvent(new Event('auth_change'));

            navigate('/app');
        } else {
            navigate('/login?error=auth_failed');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111111]">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#008B8B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-medium">Logging you in...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
