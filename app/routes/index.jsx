import { json, useLoaderData } from "remix";

import { API_KEY } from "../utils/env.server";

import stylesUrl from "~/styles/index.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function validateLat(lat) {
  const parsedLat = parseFloat(lat);
  if (isNaN(parsedLat) || !(Math.abs(parsedLat) <= 90)) {
    return `The latitude is not a valid coordinate. Please enter a number between -90 and 90`;
  }
}

function validateLon(lon) {
  const parsedLon = parseFloat(lon);
  if (isNaN(parsedLon) || !(Math.abs(parsedLon) <= 180)) {
    return `The longitude is not a valid coordinate. Please enter a number between -180 and 180`;
  }
}

const badRequest = (data) => {
  return json(data, { status: 400 });
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.get("latitude");
  const lon = url.searchParams.get("longitude");

  const fieldErrors = {
    lat: validateLat(lat),
    lon: validateLon(lon),
  };

  const fields = {
    lat,
    lon,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );

  return json(await res.json());
};

export default function Index() {
  const weatherInfo = useLoaderData();

  const temp = weatherInfo?.main?.temp;
  return (
    <div className="wrapper">
      <form method="get" className="form">
        <p>
          <label>
            <div>Latitude:(required)</div>
            <input
              defaultValue={weatherInfo?.fields?.lat}
              name="latitude"
              type="text"
              aria-invalid={Boolean(weatherInfo?.fieldErrors?.lat) || undefined}
              aria-errormessage={
                weatherInfo?.fieldErrors?.lat ? "lat-error" : undefined
              }
            />
          </label>
          {weatherInfo?.fieldErrors?.lat ? (
            <p className="form-validation-error" role="alert" id="lat-error">
              {weatherInfo.fieldErrors.lat}
            </p>
          ) : null}
        </p>
        <p>
          <label>
            <div>Longitude: (required)</div>
            <input
              defaultValue={weatherInfo?.fields?.lon}
              name="longitude"
              type="text"
              aria-invalid={Boolean(weatherInfo?.fieldErrors?.lon) || undefined}
              aria-errormessage={
                weatherInfo?.fieldErrors?.lon ? "lon-error" : undefined
              }
            />
          </label>
          {weatherInfo?.fieldErrors?.lon ? (
            <p className="form-validation-error" role="alert" id="lon-error">
              {weatherInfo.fieldErrors.lon}
            </p>
          ) : null}
        </p>
        <p>
          <button type="submit" className="submitButton">
            Submit
          </button>
        </p>
      </form>
      <div>Hello Weather</div>
      {weatherInfo?.fieldErrors ? (
        <p>Please fix form errors</p>
      ) : (
        <p>
          It is currently
          <span className={temp <= 68 ? "temp cool" : "temp hot"}>
            {temp === null ? "Loading..." : temp}
          </span>
          degrees F
        </p>
      )}
      <div>
        Common Coordinates:
        <ul>
          <li>Atlanta 33.7490° N, 84.3880° W</li>
          <li>Warner Robins 32.6130° N, 83.6242° W</li>
        </ul>
      </div>
    </div>
  );
}
