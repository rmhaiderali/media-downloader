import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./Header"
import Footer from "./Footer"
import Download from "./Download"
import * as bootstrap from "bootstrap"
import "./App.scss"

export default function () {
  const platforms = ["instagram", "threads"]
  const random = platforms[Math.floor(Math.random() * platforms.length)]

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
          {platforms.map((platform) => (
            <Route
              key={platform}
              path={BASE + "experimental/" + platform}
              element={<Download platform={platform} platforms={platforms} />}
            />
          ))}
          <Route
            path="*"
            element={
              <Navigate to={BASE + "experimental/" + random} replace={true} />
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
