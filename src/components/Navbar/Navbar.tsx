import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./Navbar.scss";
import UserObs, { loginUserOut } from "../../store/User";
import { User } from "../../types";

interface NavBarProps {
  name?: string;
}

const NavBar: React.FC<NavBarProps> = ({ name }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [USER , setUser] = React.useState<User | null>(null)
  const handleLogOut = () => {
    const hasLoggedOff = loginUserOut();
    if (hasLoggedOff) {
      toast.success("Thank you for visiting us...bye.");
      navigate("/entrance/login");
    } else {
      toast.error("Something went wrong");
      navigate("/entrance/login");
    }
  };

  React.useEffect(()=> {
    const userObs = UserObs.asObservable().subscribe((usr) => {
      setUser(usr)
    });
    console.log(USER);
    return () => {
      userObs.unsubscribe();
    }
  },[USER])
  
  if(!USER) {
    return <button className="button is-loading"></button>
  }
  return (
    <nav
      className="navbar "
      role="navigation"
      aria-label="main navigation"
      style={{ marginBottom: 54 }}
    >
      <div className="navbar-brand">
        <a className="navbar-item cus-title" href="/">
          {name} Tasks
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
              <a className="button is-danger adj-left" onClick={handleLogOut}>
                Log out
              </a>
              {!location.pathname.match(/(admin)/gm) && USER.isAdmin? (
                <a
                  className="button is-success adj-left"
                  onClick={() => {
                    navigate("/administration");
                  }}
                >
                  Administration
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
