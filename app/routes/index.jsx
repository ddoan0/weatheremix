import { json, useLoaderData } from "remix";

import { API_KEY } from "../utils/env.server";

function validateLatLonParam(coordinate) {
  if (isNaN(coordinate)) {
    return `The coordinate is not a valid coordinate`;
  }
}

const badRequest = (data) => {
  return json(data, { status: 400 });
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.getAll("latitude");
  const lon = url.searchParams.getAll("longitude");

  const fieldErrors = {
    lat: validateLatLonParam(lat),
    lon: validateLatLonParam(lon),
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
    <div>
      <form method="get">
        <p>
          <label>
            Latitude:(required)
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
            Longitude: (required)
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
          <button type="submit">submit</button>
        </p>
      </form>
      <div>Hello Weather</div>
      {weatherInfo?.fieldErrors ? (
        <p>Please fix form errors</p>
      ) : (
        <p>It is currently {temp === null ? "Loading..." : temp} degrees F</p>
      )}
    </div>
  );
}
