import React from "react";
import moment from "moment";

import UserObs, {
  deleteUser,
  getUsersFromRemote,
  UsersObs,
  verifyAdmin,
} from "../../store/User";
import { useNavigate } from "react-router-dom";
import { Category, DictionaryItem, InUser, User } from "../../types";
import NavBar from "../../components/Navbar/Navbar";
import {
  CategoriesObs,
  deleteCategory,
  deleteWord,
  getCategories,
  getDict,
  WordDictObs,
} from "../../store/Content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import toast from "react-hot-toast";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import UpdateUserModal from "../../components/UpdateUserModal/UpdateUserModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import TaskList from "../../components/TaskList/TaskList";

const AdminArea = (): React.ReactElement => {
  const [user, setUser] = React.useState<User | null>(null);
  const [users, setUsers] = React.useState<InUser[] | null>(null);
  const [userId, setUsersId] = React.useState<string>("");

  const [dictionary, setDictionary] = React.useState<DictionaryItem[] | null>(
    null
  );
  const [categories, setCategories] = React.useState<Category[] | null>(null);

  const [called, setCalled] = React.useState<boolean>(false);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [youSure, setIfSure] = React.useState<boolean>(false);
const handleDeleteUser = async () => {
  const removeCategory = await deleteUser(userId);
  if (removeCategory > 240)
    toast.error("Failed to remove User");
}
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) navigate("/");
    await getUsersFromRemote();
    await getDict();
    await getCategories();
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
    const categoryObs = CategoriesObs.asObservable().subscribe((categorys) => {
      setCategories(categorys);
    });
    return () => {
      isAdminSub.unsubscribe();
      usersOb.unsubscribe();
      dictOBS.unsubscribe();
      categoryObs.unsubscribe();
    };
  }, [called]);

  return (
    <div className="container">
      <NavBar name={user?.name} />
      <div className="box">
        <h1 className="is-size-2">Users</h1>
        <UpdateUserModal id={userId} state={editMode} action={setEditMode} />
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
                    <td>
                      <ConfirmModal
                        modalState={youSure}
                        close={setIfSure}
                        action={handleDeleteUser}
                      />

                      <button
                        className="button is-ghost"
                        onClick={async () => {
                          setUsersId(usr.userId);
                          setIfSure(true);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          size="1x"
                          color="red"
                        />
                      </button>
                      <button
                        className="button is-ghost"
                        onClick={() => {
                          setUsersId(usr.userId);
                          setEditMode(true);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPencilAlt}
                          size="1x"
                          color="orange"
                        />
                      </button>
                    </td>
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
                      <td>
                        <button
                          className="button is-ghost"
                          onClick={async () => {
                            const removeWord = await deleteWord(word._id);
                            if (removeWord > 240)
                              toast.error("Failed to delete phrase.");
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            size="1x"
                            color="red"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>
                  <p>Dictionary is empty...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="box">
        <h1 className="is-size-2">Categories</h1>

        <table className="table">
          <thead>
            <tr>
              <th>
                <abbr title="Position">#</abbr>
              </th>
              <th>
                <abbr title="text">Text</abbr>
              </th>
              <th>
                <abbr title="AddedBy">Added By</abbr>
              </th>
              <th>
                <abbr title="dateCreated">Date Created</abbr>
              </th>
              <th>
                <abbr title="actions">actions</abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? (
              categories.map((category, idx) => {
                return (
                  <tr key={category._id}>
                    <th>{idx}</th>
                    <td>{category.text}</td>
                    <td>
                      {
                        users?.find(
                          (user) => user.userId === category.createdBy
                        )?.name
                      }
                    </td>
                    <td>
                      {category.added &&
                        moment(category.added).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    <td>
                      <button
                        className="button is-ghost"
                        onClick={async () => {
                          const removeCategory = await deleteCategory(
                            category._id
                          );
                          if (removeCategory > 240)
                            toast.error("Failed to delete category.");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          size="1x"
                          color="red"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>
                  <p>No known categories...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        <div className="box">
            <h1 className="title">All Tasks</h1>
        <TaskList />
        </div>
    </div>
  );
};

export default AdminArea;
