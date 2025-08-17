import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthProvider"; // Assuming this path is correct
import "./Navbar.css";

export default function Navbar({ page }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  // --- Responsive hamburger menu logic ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Close dropdown when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown exists and the click is outside of it, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dropdownRef.current.removeAttribute("open");
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs only once

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    if (dropdownRef.current) {
        dropdownRef.current.removeAttribute("open");
    }
  }

  return (
    <header className="navbar">
      <div className="logo">
        <a href="/">CodeQuest</a>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="nav-links">
          <li>
            <a href="/" className={page == 'home' ? "active" : ""} onClick={closeMenu}>
              Home
            </a>
          </li>
            {user ? (
                <li>
                    <a href="/dashboard" className={page == 'dashboard' ? "active" : ""} onClick={closeMenu}>
                        Dashboard
                    </a>
                </li>
            ) : ( null )
        }
        </ul>
      </nav>

      {/* --- User Authentication Section --- */}
      <div className="auth-section">
        {user ? (
          <div className="dropdown-container">
            <details className="dropdown right" ref={dropdownRef}>
              <summary className="avatar">
                {/* Using a placeholder avatar, you can replace src with user.avatarUrl */}
                <img
                  src="https://gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                  alt="User avatar"
                />
              </summary>
              <ul>
                <li>
                  <p>
                    <span className="block bold">{user.name}</span>
                    {/* Assuming user object has an email property */}
                    <span className="block italic">{user.email}</span>
                  </p>
                </li>
                <li className="divider"></li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span> Logout
                  </a>
                </li>
              </ul>
            </details>
          </div>
        ) : (
          <a href="/login" className={`${page == 'login' ? "active" : ""} login-button`} onClick={closeMenu}>
            Login
          </a>
        )}
      </div>


      {/* --- Hamburger Menu Icon --- */}
      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
          }
        }}
        role="button"
        aria-label="Toggle menu"
        tabIndex={0}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
}