import { useState, useRef } from "react";
import Alert from "./Alert";
import Image from "./Image";
import Video from "./Video";
import Spinner from "./Spinner";
import Header from "./Header";
import Footer from "./Footer";
import "./App.scss";

export default function () {
  const regex = {
    instagram:
      /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
    threads:
      /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
  };
  const [postURL, setPostURL] = useState("");
  const [quality, setQuality] = useState(2);
  const platform = useRef();
  const [step, setStep] = useState(1);
  const [mediaURLs, setMediaURLs] = useState();
  const [alert, setAlert] = useState();

  const fetchURLs = async () => {
    setAlert();
    try {
      // console.log(postURL);
      if (postURL.match(regex.instagram)) platform.current = "instagram";
      else if (postURL.match(regex.threads)) platform.current = "threads";
      else return setAlert(<Alert message="Provided URL is not valid." />);

      // setPostURL("");
      setStep(2);
      let response = await fetch(SERVER + "media/" + platform.current, {
        method: "POST",
        body: JSON.stringify({ url: postURL, quality }),
      });
      response = await response.json();
      // console.log(response);

      if (response.error) {
        setAlert(<Alert message={response.error} />);
        setStep(1);
      } else {
        setAlert();
        setMediaURLs(response.url);
        setStep(3);
      }
    } catch (e) {
      // console.error(e);
      setAlert(<Alert message="API is not accessible." />);
      setStep(1);
    }
  };

  return (
    <>
      <Header />
      <div className="container main">
        <div className="p-3">
          {alert}
          <div className="py-3">
            <div className="row">
              <div>
                <h5 className="card-title text-danger text-center">
                  Download Images & Videos
                </h5>
                <p className="my-2 card-text text-danger text-center">
                  from Instagram & Threads
                </p>
                <input
                  type="text"
                  className="my-3 form-control align-center"
                  placeholder="URL"
                  id="url"
                  value={postURL}
                  onChange={(e) => setPostURL(e.target.value)}
                />

                <div className="d-grid gap-2 col-md-5 mx-auto my-4">
                  <span className="card-text text-danger text-center">
                    Set media quality
                  </span>
                  <input
                    style={{
                      width: "auto",
                      accentColor: "#dc3546",
                    }}
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
                      style={{ cursor: "pointer" }}
                      onClick={() => setQuality(1)}
                    >
                      Low
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setQuality(2)}
                    >
                      Medium
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setQuality(3)}
                    >
                      High
                    </span>
                  </div>
                </div>
                {(step == 1 || step == 3) && (
                  <button
                    onClick={fetchURLs}
                    className="d-grid gap-2 col-5 mx-auto btn btn-outline-danger my-4"
                  >
                    Fetch Media
                  </button>
                )}
                {step == 2 && <Spinner />}
                {step == 3 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {mediaURLs.map((url) => {
                      const Media = url.split(".")[1] === "mp4" ? Video : Image;
                      return (
                        <Media
                          key={url}
                          url={SERVER + "media/" + platform.current + "/" + url}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
