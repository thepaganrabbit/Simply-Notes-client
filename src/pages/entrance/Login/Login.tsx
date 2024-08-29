import React from "react";
import { loginUser } from "../../../store/User";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SLForm from "../../../components/SLForm/SLForm";
import { FormType } from "../../../types";

const Login = () => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const navigate = useNavigate();
  const clearOldSession = () => {
    window.sessionStorage.removeItem("notes_session");
  };

  const handleLogin = async () => {
    const user = {
      username,
      password,
    };
    const success = await loginUser(user);
    if (success) navigate("/");
    else toast.error("Credentials provided do not match...");
  };

  React.useEffect(() => {
    clearOldSession();
  }, []);
  return (
    <SLForm
      type={FormType.LOGIN}
      inputOne={username}
      inputTwo={password}
      setOne={setUsername}
      setTwo={setPassword}
      handleSubmit={handleLogin}
    />
  );
};

export default Login;
