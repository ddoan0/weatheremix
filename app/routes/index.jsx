import { json, useLoaderData } from "remix";

import { API_KEY } from "../utils/env.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.getAll("latitude");
  const lon = url.searchParams.getAll("longitude");
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
            Latitude: <input name="latitude" type="text" />
          </label>
        </p>
        <p>
          <label>
            Longitude: <input name="longitude" type="text" />
          </label>
        </p>
        <p>
          <button type="submit">get weather</button>
        </p>
      </form>
      <div>Hello Weather</div>
      <div>It is currently {temp === null ? "Loading..." : temp} degrees F</div>
    </div>
  );
}
