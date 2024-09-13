import React from "react";
import { ConfirmModalProps } from "../../types";

const ConfirmModal = ({
  modalState,
  close,
  action,
}: ConfirmModalProps): React.ReactElement => {
  return (
    <div className={`modal ${modalState ? "is-active" : null}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <h1 className="title">Are you sure you want to delete tis item?</h1>
        <button
          className="button is-danger is-fullwidth"
          onClick={() => {
            action();
            close(false);
          }}
        >
          Yes
        </button>
        <button
          className="button is-success is-fullwidth"
          onClick={() => close(false)}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
