import { useState, useRef } from "react";
import Spinner from "./Spinner";
import Header from "./Header";
import Footer from "./Footer";
import Media from "./Media";
import Alert from "./Alert";
import "./App.scss";

export default function () {
  const regex = {
    instagram:
      /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
    threads:
      /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
  };
  const platform = useRef();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState(2);
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);

  const fetchMedia = async () => {
    setAlert(null);
    try {
      // console.log(url)
      if (url.match(regex.instagram)) platform.current = "instagram";
      else if (url.match(regex.threads)) platform.current = "threads";
      else return setAlert(<Alert message="Provided URL is not valid." />);
      setStep(2);

      let response = await fetch(
        (PROXY ? PROXY + "/?url=" : "") +
          SERVER +
          "api/v1/media/" +
          platform.current,
        {
          method: "POST",
          body: JSON.stringify({ url, quality }),
        }
      );
      response = await response.json();
      // console.log(response)

      if (response.error) {
        setAlert(<Alert message={response.error} />);
        setStep(1);
      } else {
        setAlert(null);
        setItems(response.items);
        setStep(3);
      }
    } catch (e) {
      console.error(e);
      setAlert(<Alert message="API is not accessible." />);
      setStep(1);
    } finally {
      // setUrl("")
    }
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="p-3">
            {alert}
            <div className="py-3">
              <div className="row">
                <div>
                  <h5 className="card-title text-accent text-center">
                    Download Photos & Videos
                  </h5>
                  <p className="mt-2 mb-0 card-text text-accent text-center">
                    from Instagram & Threads
                  </p>
                  <input
                    type="text"
                    className="mt-4 form-control"
                    placeholder="URL"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && fetchMedia()}
                  />
                  <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
                    <span className="card-text text-accent text-center">
                      Set media quality
                    </span>
                    <input
                      style={{ accentColor: "var(--theme)" }}
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
                        className="cursor-pointer"
                        onClick={() => setQuality(1)}
                      >
                        Low
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() => setQuality(2)}
                      >
                        Medium
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() => setQuality(3)}
                      >
                        High
                      </span>
                    </div>
                  </div>
                  {(step === 1 || step === 3) && (
                    <button
                      onClick={fetchMedia}
                      className="d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-outline-accent mt-4"
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
      <Footer />
    </>
  );
}
