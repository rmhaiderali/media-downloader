import { useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import Download from "./Download";
import * as bootstrap from "bootstrap";
import "./App.scss";

export default function () {
  const globle = useRef({});
  const paths = ["instagram", "threads"];
  const random = paths[Math.floor(Math.random() * paths.length)];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover={true}
        theme="light"
        limit={3}
      />
      <Header />
      <div className="main">
        <Routes>
          {paths.map((path) => (
            <Route
              key={path}
              path={import.meta.env.BASE_URL + path}
              element={<Download key={path} platform={path} globle={globle} />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to={import.meta.env.BASE_URL + random} />}
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
