import React, { useState, Dispatch, SetStateAction } from "react";
import "./style/TextAreaModal.css";

interface Props {
  categoryLabels: { label: string; background: string }[];
  setCategoryLabels: (update: { label: string; background: string }[]) => void;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const CategoryEditor = ({
  categoryLabels,
  setCategoryLabels,
  show,
  setShow,
}: Props) => {
  const [labelInput, setLabelInput] = useState("");

  const [tempCategories, setTempCategories] =
    useState<{ label: string; background: string }[]>(categoryLabels);

  const deleteCategoryLabel = (event: React.MouseEvent) => {
    event.preventDefault();
    setTempCategories((previous) => [
      ...previous.filter((label) => label.label !== event.currentTarget.id),
    ]);
  };

  const handleAddLabel = (event: React.MouseEvent) => {
    if (categoryLabels.length < 5 && labelInput !== "") {
      setTempCategories((previous) => [
        ...previous,
        {
          label: labelInput,
          background: Math.floor(Math.random() * 16777215).toString(16),
        },
      ]);
    }
    setLabelInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShow(false);
    setCategoryLabels(tempCategories);
    setLabelInput("");
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShow(false);
    setLabelInput("");
  };

  return (
    <div className={`text-area-modal ${!show ? "text-area-modal--hide" : ""}`}>
      <form className="text-area-modal__form">
        <div className="text-area-modal__content">
          <label>
            <div className="text-area-modal__header">
              <h3 className="text-area-modal__title">Edit Categories</h3>
            </div>
          </label>
          <div className="text-area-modal__body">
            <input
              className="text-area-modal__textarea"
              value={labelInput}
              type="text"
              onChange={handleChange}
            />
            <button type="button" onClick={handleAddLabel}>
              Add
            </button>
          </div>
          <ul>
            {tempCategories.map((label) => {
              return (
                <li key={label.label} style={{ display: "flex" }}>
                  {label.label}
                  <button onClick={deleteCategoryLabel}>Delete</button>
                </li>
              );
            })}
          </ul>
          <div className="text-area-modal__footer">
            <button onClick={handleSubmit}>Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryEditor;
