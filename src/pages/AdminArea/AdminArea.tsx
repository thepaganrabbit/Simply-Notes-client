import React from "react";
import UserObs, {
  getUsersFromRemote,
  UsersObs,
  verifyAdmin,
} from "../../store/User";
import { useNavigate } from "react-router-dom";
import { DictionaryItem, InUser, User } from "../../types";
import NavBar from "../../components/Navbar/Navbar";
import { getDict, WordDictObs } from "../../store/Content";

const AdminArea = (): React.ReactElement => {
  const [user, setUser] = React.useState<User | null>(null);
  const [users, setUsers] = React.useState<InUser[] | null>(null);
  const [dictionary, setDictionary] = React.useState<DictionaryItem[] | null>(
    null
  );

  const [called, setCalled] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) navigate("/");
    await getUsersFromRemote();
    await getDict();
  };
  React.useEffect(() => {
    if (!called) {
      fetchUsers();
      setCalled(true);
    }
    const isAdminSub = UserObs.asObservable().subscribe((loggedInUser) => {
      setUser(loggedInUser);
    });
    const usersOb = UsersObs.asObservable().subscribe((usrs) => setUsers(usrs));
    const dictOBS = WordDictObs.asObservable().subscribe((words) => {
      setDictionary(words);
    });
    return () => {
      isAdminSub.unsubscribe();
      usersOb.unsubscribe();
      dictOBS.unsubscribe();
    };
  }, [called]);

  return (
    <div className="container">
      <NavBar name={user?.name} />
      <div className="box">
        <h1 className="is-size-2">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>
                <abbr title="Position">#</abbr>
              </th>
              <th>
                <abbr title="name">Name</abbr>
              </th>
              <th>
                <abbr title="username">Usernamee</abbr>
              </th>
              <th>
                <abbr title="isAdmin">IsAdmin</abbr>
              </th>
              <th>
                <abbr title="actions">actions</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((usr, idx) => {
                return (
                  <tr key={usr.userId}>
                    <th>{idx}</th>
                    <td>{usr.name}</td>
                    <td>{usr.username}</td>
                    <td>{usr.isAdmin ? "Admin" : "User"}</td>
                    <td>Action</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="box">
        <h1 className="is-size-2">Dictionary</h1>

        <table className="table">
          <thead>
            <tr>
              <th>
                <abbr title="Position">#</abbr>
              </th>
              <th>
                <abbr title="text">Phrase/Words</abbr>
              </th>
              <th>
                <abbr title="commonality">Commonality</abbr>
              </th>
              <th>
                <abbr title="actions">actions</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {dictionary && dictionary.length > 0 ? (
              dictionary
                .sort((a, b) => a.commonality - b.commonality)
                .map((word, idx) => {
                  return (
                    <tr key={word._id}>
                      <th>{idx}</th>
                      <td>{word.text}</td>
                      <td>{word.commonality}</td>
                      <td>Action</td>
                    </tr>
                  );
                })
            ) : (
              <p>Dictionary is empty...</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArea;
