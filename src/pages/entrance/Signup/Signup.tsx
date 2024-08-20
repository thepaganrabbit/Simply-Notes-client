import React from "react";
import { signUp } from "../../../store/User";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="container is-fullhd">
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Enter your full name."
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Enter a valid email"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => console.log(e.target.value.includes("@"))}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p className="help is-danger">This email is invalid</p>
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            type="password"
            placeholder="Must be 8 letters long"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="sub">hello</div>
        </div>
      </div>
      <div className="control">
        <button
          className="button is-link is-light"
          onClick={async () => {
            const user = {
              name,
              username,
              password,
            };
            const success = await signUp(user);
            if (success) navigate("/");
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default Signup;
