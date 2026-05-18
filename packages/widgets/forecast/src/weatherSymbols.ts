import SunCalc from 'suncalc'

export const weatherSymbolNames: Record<number, string> = {
  1: 'Clear sky',
  2: 'Nearly clear sky',
  3: 'Variable cloudiness',
  4: 'Halfclear sky',
  5: 'Cloudy sky',
  6: 'Overcast',
  7: 'Fog',
  8: 'Light rain showers',
  9: 'Moderate rain showers',
  10: 'Heavy rain showers',
  11: 'Thunderstorm',
  12: 'Light sleet showers',
  13: 'Moderate sleet showers',
  14: 'Heavy sleet showers',
  15: 'Light snow showers',
  16: 'Moderate snow showers',
  17: 'Heavy snow showers',
  18: 'Light rain',
  19: 'Moderate rain',
  20: 'Heavy rain',
  21: 'Thunder',
  22: 'Light sleet',
  23: 'Moderate sleet',
  24: 'Heavy sleet',
  25: 'Light snowfall',
  26: 'Moderate snowfall',
  27: 'Heavy snowfall',
}

export const weatherSymbolEmojis: Record<number, string> = {
  1: '☀️',
  2: '🌤️',
  3: '⛅',
  4: '🌥️',
  5: '☁️',
  6: '☁️',
  7: '🌫️',
  8: '🌦️',
  9: '🌦️',
  10: '🌧️',
  11: '⛈️',
  12: '🌨️',
  13: '🌨️',
  14: '🌨️',
  15: '🌨️',
  16: '❄️',
  17: '❄️',
  18: '🌧️',
  19: '🌧️',
  20: '🌧️',
  21: '⛈️',
  22: '🌨️',
  23: '🌨️',
  24: '🌨️',
  25: '❄️',
  26: '❄️',
  27: '❄️',
}

export function getWeatherEmoji(symbol: number, time: Date, lat: number, lon: number): string {
  if (symbol === 1) {
    const { sunset, sunrise } = SunCalc.getTimes(time, lat, lon)
    // Check if the sunrise and sunset are valid.
    // Examples of invalid dates include polar night or midnight sun scenarios.
    const validDates = !isNaN(sunrise.getTime()) && !isNaN(sunset.getTime())
    if (validDates && (time >= sunset || time < sunrise)) return '🌙'
  }
  return weatherSymbolEmojis[symbol] ?? '❓'
}
