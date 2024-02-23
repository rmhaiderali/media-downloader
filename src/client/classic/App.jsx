import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Alert from "./Alert";
import "./App.scss";
import Media from "../common/components/Media";
import Spinner from "../common/components/Spinner";
import SelectType from "../common/components/SelectType";
import SelectQuality from "../common/components/SelectQuality";
import SelectPlatform from "../common/components/SelectPlatform";
import HighlightGroups from "../common/components/HighlightGroups";
import InstagramMediaType from "./MediaTypes/Instagram";
import ThreadsMediaType from "./MediaTypes/Threads";
import { regex } from "../common/constants";
import { makeBackendUrl, capitalizeFirstLetter } from "../common/utils";

export default function () {
  const [platform, setPlatform] = useState("instagram");
  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState("post");
  const [quality, setQuality] = useState(1);
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setType("post");
  }, [platform]);

  const fetchMedia = async () => {
    setAlert(null);
    try {
      const reqRegex = regex[platform][type];
      if (!identifier.match(reqRegex.regex))
        return setAlert(
          <Alert message={"Provided " + reqRegex.name + " is not valid."} />
        );

      if (type === "highlights") {
        setType("highlightsGroups");
        setIdentifier("");
      }
      setStep(2);

      const url = makeBackendUrl("api/v1/" + platform + "/" + type);

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ identifier, quality: Number(quality) }),
      });
      response = await response.json();
      // console.log(response)

      if (response.error) {
        setAlert(<Alert message={response.error} />);
        setStep(1);
      } else {
        setAlert(null);
        setItems(response.items);
        if (response.type === "highlightsGroups") {
          setIdentifier("");
          setType("highlights");
          setStep(4);
        }
        //
        else setStep(3);
      }
    } catch (e) {
      console.error(e);
      setAlert(<Alert message="API is not accessible." />);
      setStep(1);
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
                  <h5 className="card-title text-center text-accent">
                    Download Photos & Videos
                  </h5>
                  <p className="mt-2 mb-0 card-text text-center text-accent">
                    from Instagram & Threads
                  </p>
                  {step !== 4 && (
                    <SelectPlatform
                      platform={platform}
                      setPlatform={setPlatform}
                    />
                  )}
                  <input
                    type="text"
                    className="mt-2 form-control"
                    placeholder={regex[platform][type].name
                      .split(" ")
                      .map(capitalizeFirstLetter)
                      .join(" ")}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
                  />
                  {step !== 4 && (
                    <SelectType
                      type={type}
                      setType={setType}
                      platform={platform}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent:
                            platform === "instagram"
                              ? "space-between"
                              : "space-evenly",
                        }}
                      >
                        {platform === "instagram" && (
                          <InstagramMediaType type={type} setType={setType} />
                        )}
                        {platform === "threads" && (
                          <ThreadsMediaType type={type} setType={setType} />
                        )}
                      </div>
                    </SelectType>
                  )}
                  {step === 4 && (
                    <HighlightGroups
                      items={items}
                      identifier={identifier}
                      setIdentifier={setIdentifier}
                      activeBorderColor={"var(--theme)"}
                    />
                  )}
                  <SelectQuality quality={quality} setQuality={setQuality} />
                  {(step === 1 || step === 3 || step === 4) && (
                    <button
                      onClick={fetchMedia}
                      className="d-grid gap-2 col-6 col-sm-5 mx-auto mt-4 btn btn-accent"
                    >
                      Fetch Media
                    </button>
                  )}
                  {step === 2 && <Spinner />}
                  {step === 3 && (
                    <Media
                      items={items}
                      downloadBtnClass={"btn-accent"}
                      extraImageStyles={{ backgroundColor: "black" }}
                      extraVideoStyles={{ backgroundColor: "black" }}
                    />
                  )}
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