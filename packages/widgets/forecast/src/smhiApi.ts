const PARAMETERS = 'air_temperature,wind_speed,symbol_code,precipitation_amount_mean'

export interface SmhiTimeSeries {
  time: string
  intervalParametersStartTime?: string
  data: Record<string, number>
}

export interface SmhiForecastResponse {
  createdTime: string
  referenceTime: string
  geometry: object
  timeSeries: SmhiTimeSeries[]
}

function getParam(ts: SmhiTimeSeries, name: string): number | undefined {
  return ts.data[name]
}

export interface ForecastEntry {
  time: Date
  temp: number
  wsymb2: number
  windSpeed: number
  precipitation: number
}

export async function fetchSmhiForecast(lat: number, lon: number): Promise<ForecastEntry[]> {
  const url = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon.toFixed(4)}/lat/${lat.toFixed(4)}/data.json?parameters=${PARAMETERS}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`SMHI API error: ${res.status}`)
  const data: SmhiForecastResponse = await res.json()

  return data.timeSeries.slice(0, 24).map((ts) => ({
    time: new Date(ts.time),
    temp: getParam(ts, 'air_temperature') ?? 0,
    wsymb2: getParam(ts, 'symbol_code') ?? 1,
    windSpeed: getParam(ts, 'wind_speed') ?? 0,
    precipitation: getParam(ts, 'precipitation_amount_mean') ?? 0,
  }))
}
