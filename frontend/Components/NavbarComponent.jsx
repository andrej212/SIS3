import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

function NavbarComponent() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <nav className="flex justify-between items-center bg-gray-800 px-6 py-4">
            <Link to="/programs" className="text-white font-bold text-lg no-underline">
                SIS3
            </Link>
            <ul className="flex items-center gap-6 list-none m-0 p-0">
                <li>
                    <Link to="/programs" className="text-gray-300 hover:text-white no-underline text-sm font-medium">
                        Programs
                    </Link>
                </li>
                <li>
                    <Link to="/blogs" className="text-gray-300 hover:text-white no-underline text-sm font-medium">
                        Blog
                    </Link>
                </li>
                <li>
                    <Link to="/members" className="text-gray-300 hover:text-white no-underline text-sm font-medium">
                        Members
                    </Link>
                </li>
            </ul>
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-gray-300 text-sm">
                        {user.username}
                        {user.role === 'admin' && (
                            <span className="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                admin
                            </span>
                        )}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default NavbarComponent;
