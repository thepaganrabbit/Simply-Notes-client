import React, { useEffect } from 'react'
import './App.scss'
import UserObs from './store/User';
import { User } from './types';

function App() {
  const [user, setUser] = React.useState<User | null>(null);
  useEffect(() => {
    const sub = UserObs.asObservable().subscribe((user => {
      setUser(user);
      console.log(user);
  }))
  return () => sub.unsubscribe();
  }, [user]);
  return (
    <>
      <h1>hello {user?.name}</h1>
    </>
  )
}

export default App
