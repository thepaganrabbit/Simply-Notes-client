import React from "react";
import { useNavigate } from "react-router-dom";
import { checkToken, verifyToken } from "../store/User";

const withAuth = (WrappedComponent: any) => (props: any) => {
  const [isAllowedIn, setIsAllowedIn] = React.useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  React.useEffect(() => {
    const tokenExists = checkToken();
    if (!tokenExists) navigate("/entrance/login");
    else {
      const checkValidityOfToken = async () => {
        const is_expired = await verifyToken(tokenExists as string) 
        if(!is_expired) {
          navigate('/entrance/login')
        }
       setIsAllowedIn(is_expired); 
      };
      checkValidityOfToken();

    }
  }, [isAllowedIn]);
  return isAllowedIn !== null ? <WrappedComponent {...props} /> : null;
};

export default withAuth;
