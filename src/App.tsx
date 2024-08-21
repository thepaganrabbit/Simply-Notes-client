import React, { useEffect } from "react";
import "./App.scss";
import UserObs from "./store/User";
import { User } from "./types";
import withAuth from "./HOC/withAuth";
import NavBar from "./components/Navbar/Navbar";

const App = () => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    const sub = UserObs.asObservable().subscribe((user) => {
      setUser(user);
    });
    return () => sub.unsubscribe();
  }, [user]);
  return (
    <>
      <NavBar />
      <h1>hello {user?.name}</h1>
    </>
  );
};

export default withAuth(App);
