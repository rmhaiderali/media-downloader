import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Logic from "./Logic";

export default function ({ route, platforms }) {
  const globle = useRef({});
  const conditional = (boolean, value) => (boolean ? " " + value : "");

  const toggleItems = platforms.map((platform) => (
    <li className="nav-item" key={platform}>
      <Link
        to={import.meta.env.BASE_URL + platform}
        className="text-decoration-none"
      >
        <button
          className={
            "nav-link rounded-5" + conditional(platform === route, "active")
          }
        >
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </button>
      </Link>
    </li>
  ));

  useEffect(() => {
    document.body.classList.add(route);
    return () => document.body.classList.remove(route);
  }, [route]);

  return (
    <div className="download">
      <div className="container">
        <div className="p-3">
          <div className="py-3">
            <div className="row">
              <div>
                <div className="d-grid gap-2 col-md-6 mx-auto mt-3 mb-4">
                  <div className="p-1 small rounded-5 shadow-sm toggle">
                    <ul className={"nav nav-pills nav-fill " + route}>
                      <div className="tab"></div>
                      {toggleItems}
                    </ul>
                  </div>
                </div>
                <h3 className="card-title text-white text-center">
                  Download Photos & Videos
                </h3>
                <p
                  className="my-2 card-text text-white text-center"
                  style={{ fontSize: "20px" }}
                >
                  {"from " + route.charAt(0).toUpperCase() + route.slice(1)}
                </p>
                <Logic platform={route} globle={globle} key={route} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
