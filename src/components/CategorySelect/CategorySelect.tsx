import React from "react";
import { CategoriesObs, getCategories } from "../../store/Content";
import { Category, CategorySelectProps } from "../../types";
import CategorySelection from "../CategorySelection/CategorySelection";

const CategorySelect = ({
  action,
  state,
}: CategorySelectProps<string>): React.ReactElement => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [categories, setCetegories] = React.useState<Category[] | null>([]);
  const [modalState, setModalState] = React.useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    await getCategories();
  };

  React.useEffect(() => {
    if (!categories || categories.length <= 0) {
      fetchData();
    }
    const sub = CategoriesObs.asObservable().subscribe((obScategories) => {
      if (obScategories) setIsLoading(false);
      setCetegories(obScategories);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [categories, isLoading]);

  return (
    <>
      <CategorySelection
        modalState={modalState}
        onHandleModalState={setModalState}
      />
      <div className={`select is-large ${isLoading ? "is-loading" : null}`}>
        <select
          value={state}
          onChange={(e) => {
            if (e.target.value === "new") {
              setModalState(true);
            }
            action(e.target.value);
          }}
        >
          <option disabled>catagories</option>
          <option value="Default">Default</option>
          {categories &&
            categories.map((category) => (
              <option key={category._id} value={category.text}>{category.text}</option>
            ))}
          <option value="new">New Category</option>
        </select>
      </div>
    </>
  );
};

export default CategorySelect;
