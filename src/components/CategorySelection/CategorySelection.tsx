import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { CategorySelectionProps } from "../../types";
import { addCategory } from "../../store/Content";
import toast from "react-hot-toast";

const CategorySelection = ({modalState,onHandleModalState}: CategorySelectionProps): React.ReactElement => {
    const [category, setCategory] = React.useState<string>('');

  return (
    <div className={`modal ${modalState ? 'is-active' : null}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box is-large">
          <label htmlFor="newcatagoryy">New Category</label>
          <div style={{ display: "flex" }}>
            <input type="text" className="input is-large" value={category} onChange={(e) => setCategory(e.target.value)}/>
            <button className="button is-dark ml-4" onClick={async () => {
                  const success = await addCategory(category);
                  if(success > 240) toast.error('Something went wrong could not add category...');
                  setCategory('');
                  onHandleModalState(!modalState);
            }}>
              <FontAwesomeIcon icon={faSquarePlus} size={"2x"} />
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={() => onHandleModalState(!modalState)}></button>
    </div>
  );
};

export default CategorySelection;
