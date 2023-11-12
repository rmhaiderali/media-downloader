import { useReducer, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import Spinner from "./Spinner"
import Media from "./Media"

export default function ({ platform, global }) {
  global.current[platform] ??= { url: "", quality: 1, items: [], step: 1 }

  const regex = {
    instagram:
      /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reels?|tv)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/,
    threads:
      /^https?:\/\/(?:www\.)?threads\.net\/(?:t|@?[a-z0-9._]{1,30}\/post)\/[a-zA-Z0-9_-]{11}\/?(?:\?.*)?$/
  }

  function reducer(state, action) {
    return { ...state, [action.type]: action.payload }
  }

  const [state, dispatch] = useReducer(reducer, global.current[platform])

  const { url, quality, items, step } = state

  function intercept(action) {
    dispatch(action)
    global.current[platform][action.type] = action.payload
  }

  const setUrl = (payload) => intercept({ type: "url", payload })
  const setQuality = (payload) => intercept({ type: "quality", payload })
  const setItems = (payload) => intercept({ type: "items", payload })
  const setStep = (payload) => intercept({ type: "step", payload })

  function toaster(message, type) {
    if (toast.isActive(message.replaceAll(" ", ""))) return
    toast[type ?? "info"](message, { toastId: message.replaceAll(" ", "") })
  }

  const range = useRef(null)

  useEffect(() => {
    const progress = (range.current.value / range.current.max) * 100
    // prettier-ignore
    range.current.style.background = "linear-gradient(to right, #fff " + progress + "%, #fff8 " + progress + "%)"
  }, [quality])

  const fetchMedia = async () => {
    try {
      if (!url.match(regex[platform]))
        // console.log(url)
        return toaster("Provided URL is not valid.", "warn")
      setStep(2)

      let response = await fetch(
        (PROXY ? PROXY + "/?url=" : "") + SERVER + "media/" + platform,
        {
          method: "POST",
          body: JSON.stringify({ url, quality: quality + 1 })
        }
      )
      response = await response.json()
      // console.log(response)

      if (response.error) {
        toaster(response.error, "error")
        setStep(1)
      } else {
        setItems(response.items)
        setStep(3)
      }
    } catch (e) {
      console.error(e)
      toaster("API is not accessible.", "error")
      setStep(1)
    } finally {
      // setUrl("")
    }
  }

  return (
    <>
      <input
        type="text"
        className="mt-4 form-control"
        placeholder="URL"
        id="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="d-grid gap-2 col-md-5 mx-auto mt-4">
        <span className="card-text text-white text-center">
          Set media quality
        </span>
        <input
          ref={range}
          type="range"
          min="0"
          max="2"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && fetchMedia()}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span
            className="text-white cursor-pointer"
            onClick={() => setQuality(0)}
          >
            Low
          </span>
          <span
            className="text-white cursor-pointer"
            onClick={() => setQuality(1)}
          >
            Medium
          </span>
          <span
            className="text-white cursor-pointer"
            onClick={() => setQuality(2)}
          >
            High
          </span>
        </div>
      </div>
      {(step === 1 || step === 3) && (
        <button
          onClick={fetchMedia}
          className="d-grid gap-2 col-6 col-sm-5 mx-auto btn btn-light mt-4"
        >
          Fetch Media
        </button>
      )}
      {step === 2 && <Spinner />}
      {step === 3 && <Media items={items} platform={platform} />}
    </>
  )
}
