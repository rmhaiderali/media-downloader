import { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import Media from "./Media";

export default function ({ platform, globle }) {
  useEffect(() => {
    document.body.classList.add(platform);
    return () => document.body.classList.remove(platform);
  }, [platform]);

  const regex = {
    instagram:
      /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
    threads:
      /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
  };

  const reducer = (state, action) =>
    (globle.current[platform] = { ...state, [action.type]: action.payload });

  globle.current[platform] ??= {
    url: "",
    quality: 2,
    items: [],
    step: 1,
  };

  const [state, dispatch] = useReducer(reducer, globle.current[platform]);

  const { url, quality, items, step } = state;

  function intercept(action) {
    dispatch(action);
    globle.current[platform][action.type] = action.payload;
  }

  const setUrl = (payload) => intercept({ type: "url", payload });
  const setQuality = (payload) => intercept({ type: "quality", payload });
  const setItems = (payload) => intercept({ type: "items", payload });
  const setStep = (payload) => intercept({ type: "step", payload });

  function toaster(message, type) {
    if (toast.isActive(message.replaceAll(" ", ""))) return;
    toast[type ?? "info"](message, { toastId: message.replaceAll(" ", "") });
  }

  const fetchMedia = async () => {
    try {
      // console.log(url);
      if (!url.match(regex[platform]))
        return toaster("Provided URL is not valid.", "warn");
      setStep(2);

      let response = await fetch(
        (PROXY ? PROXY + "/?url=" : "") + SERVER + "media/" + platform,
        {
          method: "POST",
          body: JSON.stringify({ url, quality }),
        }
      );
      response = await response.json();
      // console.log(response);

      if (response.error) {
        toaster(response.error, "error");
        setStep(1);
      } else {
        setItems(response.items);
        setStep(3);
      }
    } catch (e) {
      console.error(e);
      toaster("API is not accessible.", "error");
      setStep(1);
    } finally {
      // setUrl("");
    }
  };

  const conditionalClass = (boolean, value) => (boolean ? " " + value : "");

  return (
    <div className="download">
      <div className="container">
        <div className="p-3">
          <div className="py-3">
            <div className="row">
              <div>
                <div className="d-grid gap-2 col-md-6 mx-auto mt-3 mb-4">
                  <ul className="nav nav-pills nav-fill gap-2 p-1 small rounded-5 shadow-sm toggle">
                    <li className="nav-item">
                      <Link
                        to={import.meta.env.BASE_URL + "instagram"}
                        className="text-decoration-none"
                      >
                        <button
                          className={
                            "nav-link rounded-5" +
                            conditionalClass(platform === "instagram", "active")
                          }
                        >
                          Instagram
                        </button>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={import.meta.env.BASE_URL + "threads"}
                        className="text-decoration-none"
                      >
                        <button
                          className={
                            "nav-link rounded-5" +
                            conditionalClass(platform === "threads", "active")
                          }
                        >
                          Threads
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
                <h3 className="card-title text-white text-center">
                  Download Photos & Videos
                </h3>
                <p
                  className="my-2 card-text text-white text-center"
                  style={{ fontSize: "20px" }}
                >
                  {"from " +
                    platform.charAt(0).toUpperCase() +
                    platform.slice(1)}
                </p>
                <input
                  type="text"
                  className="mt-4 form-control"
                  placeholder="URL"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="d-grid gap-2 col-md-5 mx-auto my-4">
                  <span className="card-text text-white text-center">
                    Set media quality
                  </span>
                  <input
                    style={{ accentColor: "white", colorScheme: "dark" }}
                    type="range"
                    min="1"
                    max="3"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="text-white cursor-pointer"
                      onClick={() => setQuality(1)}
                    >
                      Low
                    </span>
                    <span
                      className="text-white cursor-pointer"
                      onClick={() => setQuality(2)}
                    >
                      Medium
                    </span>
                    <span
                      className="text-white cursor-pointer"
                      onClick={() => setQuality(3)}
                    >
                      High
                    </span>
                  </div>
                </div>
                {(step === 1 || step === 3) && (
                  <button
                    onClick={fetchMedia}
                    className="d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-light"
                  >
                    Fetch Media
                  </button>
                )}
                {step === 2 && <Spinner />}
                {step === 3 && <Media items={items} platform={platform} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
