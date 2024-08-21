import React from "react";
import { loginUserOut } from "../../store/User";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    const hasLoggedOff = loginUserOut();
    if (hasLoggedOff) {
        toast.success('Thank you for visiting us...bye.');
        navigate("/entrance/login");
    } else {
        toast.error('Something went wrong');
        navigate('/entrance/login');
    }
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          Tasks
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {/* <a className="button is-primary">
                <strong>Sign up</strong>
              </a> */}
              <a className="button is-danger" onClick={handleLogOut}>
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
