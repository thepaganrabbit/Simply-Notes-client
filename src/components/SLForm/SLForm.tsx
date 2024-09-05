import React from "react";
import { FormType } from "../../types";
import toast from "react-hot-toast";

export interface SLFormProps {
  inputOne: string;
  inputTwo: string;
  setOne: (e: string) => void;
  setTwo: (e: string) => void;
  handleSubmit: () => void;
  type: FormType;
  inputThree?: string;
  setThree?: (e: string) => void;
}

const SLForm = ({
  inputOne,
  inputTwo,
  setOne,
  setTwo,
  handleSubmit,
  type,
  inputThree,
  setThree,
}: SLFormProps): React.ReactElement => {
  const [passCount, setPassCount] = React.useState<number>(0);
  const [isAnEmail, setIsAnAEmail] = React.useState<boolean>(true);
  const [isValidName, setIsValidName] = React.useState<boolean>(true);

  const VALIDATON = () => {
    if (type === FormType.SIGNUP) {
      if (isAnEmail && isValidName && passCount >= 8) return true;
      else return false;
    } else {
      if (isAnEmail && passCount >= 8) return true;
      else return false;
    }
  };

  return (
    <div className="container is-fullhd" style={{ marginTop: "30Vh" }}>
      {type === FormType.SIGNUP && (
        <div className="field">
          <label className="label">Full Name</label>
          <div className="control">
            <input
              className="input"
              type="email"
              placeholder="Enter Your Full Name"
              value={inputThree}
              onChange={(e) => setThree && setThree(e.target.value)}
              onBlur={(e) => {
                if (
                  e.target.value.length < 5 &&
                  e.target.value.split(" ").length > 1
                ) {
                  setIsValidName(false);
                } else {
                  setIsValidName(true);
                }
              }}
            />
            {!isValidName && (
              <p className="helps" style={{ color: "red" }}>
                Please enter a valid full name.
              </p>
            )}
          </div>
        </div>
      )}
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            placeholder="Enter a valid email"
            value={inputOne}
            onChange={(e) => setOne(e.target.value)}
            onBlur={(e) => {
              if (
                !e.target.value.includes("@") &&
                !e.target.value.includes(".")
              ) {
                setIsAnAEmail(false);
              } else {
                setIsAnAEmail(true);
              }
            }}
          />
          {!isAnEmail && (
            <p className="helps" style={{ color: "red" }}>
              This email is invalid
            </p>
          )}
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
        </div>
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            type="password"
            placeholder="Must be 8 letters long"
            value={inputTwo}
            onChange={(e) => setTwo(e.target.value)}
            onKeyUp={async (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (
                e.nativeEvent.key === "Backspace" ||
                (e.nativeEvent.key === "Delete")
              ) {
                if(passCount !== 0){
                  setPassCount(passCount - 1);
                }
              } else if (e.nativeEvent.key === "Enter") {
                if (VALIDATON()) {
                  await handleSubmit();
                } else {
                  toast.error("Invalid credentials and/or rules not followed.");
                }
              } else {
                setPassCount(passCount + 1);
              }
            }}
          />
          {passCount !== 0 && (
            <div
              className="sub"
              style={{ color: passCount >= 8 ? "" : "red", marginTop: 7 }}
            >
              Must be 8 characters long. Count: {passCount}
            </div>
          )}
        </div>
      </div>
      <div className="control">
        <div className="columns">
          <div className="column">
            <button
              className="button is-link is-light"
              onClick={async () => {
                if (VALIDATON()) {
                  await handleSubmit();
                } else {
                  toast.error("Invalid credentials and/or rules not followed.");
                }
              }}
            >
              submit
            </button>
          </div>
          <div className="column">
            {type === FormType.LOGIN ? (
              <a href="/entrance">Not a member? Sign up here!</a>
            ) : (
              <a href="/entrance/login">Already a member? Sign in here!</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLForm;
