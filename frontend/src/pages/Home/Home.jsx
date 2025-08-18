import { use } from "react";
import React, { useState, useEffect } from "react";
import './Home.css';
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:3000/categories");
        if (res.status !== 200) {
          throw new Error("Something went wrong while fetching questions");
        }
        console.log(res);
        setQuestions(res.data);
      } catch (err) {
        toast.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);
  return (
    <div className="home-container">
      <Navbar page="home"/>
      <ToastContainer />
      <div className="home-header">
        <h1 className="home-hero">Questions</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.toString()} </p>}
        <div>
          {questions.map((category, index) => (
            <CategoryCard index={index} category={category} key={category._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
