import React from "react";
import { UpdatedUser, UpdatedUserModalProps } from "../../types";
import { updateUser, UsersObs } from "../../store/User";
import toast from "react-hot-toast";

const UpdateUserModal = ({
  id,
  action,
  state,
}: UpdatedUserModalProps): React.ReactElement => {
  const [name, setName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [userId, setUserId] = React.useState<string>("");
  const [accountType, setAccountType] = React.useState<string>("");
  const [pwd, resetPwd] = React.useState<string>("");
  const [toReset, setToReset] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (id && state === true) {
      console.log('in wrong');
      const usersObs = UsersObs.asObservable().subscribe((usrs) => {
        const foundUser = usrs.filter((usr) => usr.userId === id)[0];
        setName(foundUser.name);
        setUserId(foundUser.userId);
        setUsername(foundUser.username);
        setAccountType(foundUser.isAdmin ? "Admin" : "User");
      });
      return () => {
        usersObs.unsubscribe();
      };
    }
  }, [id, state]);
  return (
    <div className={`modal ${state && id ? "is-active" : null}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h1>Update User</h1>
          <div className="columns">
            <div className="column">
              <label htmlFor="Name" className="label">
                Name
              </label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="column">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <label htmlFor="isadmin" className="label">
                Account Type
              </label>
              <div className="select">
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            <div className="column">
              <label htmlFor="password" className="label">
                Password reset
              </label>
              <input
                className="input"
                type="password"
                value={pwd}
                onChange={(e) => resetPwd(e.target.value)}
              />
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={toReset}
                  onChange={(e) => setToReset(e.target.checked)}
                />
                Update pssword?
              </label>
            </div>
          </div>
          <button
            className="button is-primary is-fullwidth"
            onClick={async () => {
              const updatedUser: UpdatedUser = {
                name,
                username,
                userId,
                isAdmin: accountType === "Admin" ? true : false,
                password: undefined,
              };
              if (toReset) {
                updatedUser.password = pwd;
              }
              const success = await updateUser(updatedUser);

              if (success > 220) toast.error("failed to update user.");
              else {
                action(false);
                setName("");
                setAccountType("User");
                setUsername("");
                setUserId("");
              }
            }}
          >
            Submit
          </button>
          <button
            className="button is-warning is-fullwidth mt-3"
            onClick={() => action(false)}
          >
            Cancel
          </button>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => action(false)}
      ></button>
    </div>
  );
};

export default UpdateUserModal;
