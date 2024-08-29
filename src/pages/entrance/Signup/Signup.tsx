import React from "react";
import { signUp } from "../../../store/User";
import { useNavigate } from "react-router-dom";
import { FormType } from "../../../types";
import SLForm from "../../../components/SLForm/SLForm";

const Signup = () => {
  const [name, setName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const user = {
      name,
      username,
      password,
    };
    const success = await signUp(user);
    if (success) navigate("/");
  };

  return (
    <SLForm
      type={FormType.SIGNUP}
      inputOne={username}
      inputTwo={password}
      inputThree={name}
      setOne={setUsername}
      setTwo={setPassword}
      setThree={setName}
      handleSubmit={handleSubmit}
    />
  );
};

export default Signup;
