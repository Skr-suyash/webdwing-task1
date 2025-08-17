import React, { useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import "./CategoryCard.css";

const CategoryCard = ({ category, index }) => {
  const [open, setOpen] = useState(false);
  const questions = category.questions;
  // const questions = category.questions.slice(0, 5);

  return (
    <div className="category-card">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="category-header"
      >
        <span>{`Topic - ${index + 1}:  ${category.title}`}</span>

        <span className={`dropdown-icon ${open ? "rotate" : ""}`}>&#9662;</span>
      </div>

      {open && (
        <ul className="question-list">
          {questions.map((q) => (
            <QuestionCard question={q} key={q._id} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryCard;
