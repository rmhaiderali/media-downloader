import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import Form from "./Form";

export default function ({ platform, platforms }) {
  const global = useRef({});

  const toggleItems = platforms.map((p) => (
    <Link
      key={p}
      to={BASE + "experimental/" + p}
      className={classNames(
        "nav-link rounded-5 text-decoration-none text-center z-1",
        p === platform && "active"
      )}
    >
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </Link>
  ));

  useEffect(() => {
    document.body.classList.add(platform);
    return () => document.body.classList.remove(platform);
  }, [platform]);

  const itemWidth = 100 / platforms.length;
  const sliderLeft = itemWidth * platforms.indexOf(platform);

  return (
    <div className="download">
      <div className="container">
        <div className="p-3">
          <div className="py-3">
            <div className="row">
              <div>
                <div className="d-grid gap-2 col-md-6 mx-auto mt-3 mb-4">
                  <div className="p-1 small rounded-5 shadow-sm toggle">
                    <ul className="nav nav-fill">
                      <div
                        className="slider"
                        style={{
                          left: sliderLeft + "%",
                          width: itemWidth + "%",
                        }}
                      ></div>
                      {toggleItems}
                    </ul>
                  </div>
                </div>
                <h3 className="card-title text-white text-center">
                  Download Photos & Videos
                </h3>
                <p
                  className="mt-2 mb-0 card-text text-white text-center"
                  style={{ fontSize: "20px" }}
                >
                  {"from " +
                    platform.charAt(0).toUpperCase() +
                    platform.slice(1)}
                </p>
                <Form platform={platform} global={global} key={platform} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
