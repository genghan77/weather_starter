import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { SingaporeWeatherClient } from './weather.js';

describe('SingaporeWeatherClient', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds the condition card snapshot from the two-hour forecast endpoint', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          errorMsg: '',
          data: {
            area_metadata: [
              {
                name: 'Bishan',
                label_location: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                timestamp: '2026-05-04T00:00:00Z',
                update_timestamp: '2026-05-04T00:15:00Z',
                valid_period: { text: '12.00 pm to 2.00 pm' },
                forecasts: [
                  { area: 'Bishan', forecast: 'Cloudy' },
                  { area: 'Central Water Catchment', forecast: 'Fair' },
                ],
              },
            ],
          },
        });
      }

      if (url.includes('/air-temperature')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'S1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:15:00Z',
                data: [{ stationId: 'S1', value: 29 }],
              },
            ],
          },
        });
      }

      if (url.includes('/relative-humidity')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'S1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:15:00Z',
                data: [{ stationId: 'S1', value: 80 }],
              },
            ],
          },
        });
      }

      if (url.includes('/rainfall')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'S1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:15:00Z',
                data: [{ stationId: 'S1', value: 0 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-speed')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'S1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:15:00Z',
                data: [{ stationId: 'S1', value: 5 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-direction')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'S1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:15:00Z',
                data: [{ stationId: 'S1', value: 180 }],
              },
            ],
          },
        });
      }

      if (url.includes('/uv')) {
        return jsonResponse({
          code: 0,
          data: {
            records: [
              {
                updatedTimestamp: '2026-05-04T00:15:00Z',
                index: [{ hour: '12pm', value: 7 }],
              },
            ],
          },
        });
      }

      if (url.includes('/psi')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:15:00Z',
                readings: { psi_twenty_four_hourly: { central: 42 } },
              },
            ],
          },
        });
      }

      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:15:00Z',
                readings: { pm25_one_hourly: { central: 9 } },
              },
            ],
          },
        });
      }

      if (url.includes('/v1/environment/4-day-weather-forecast')) {
        return jsonResponse({
          items: [
            {
              update_timestamp: '2026-05-04T00:15:00Z',
              forecasts: [
                {
                  date: '2026-05-04',
                  forecast: 'Cloudy',
                  temperature: { low: 25, high: 32 },
                },
              ],
            },
          ],
        });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.85);

    expect(snapshot.condition).toBe('Cloudy');
    expect(snapshot.area).toBe('Bishan');
    expect(snapshot.valid_period_text).toBe('12.00 pm to 2.00 pm');
    expect(snapshot.observed_at).toBe('2026-05-04T00:15:00Z');
    expect(snapshot.source).toBe('api-open.data.gov.sg');
  });

  it('builds the weather metrics snapshot from realtime station endpoints', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          data: {
            area_metadata: [
              {
                name: 'Bishan',
                label_location: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                timestamp: '2026-05-04T00:00:00Z',
                update_timestamp: '2026-05-04T00:15:00Z',
                valid_period: { text: '12.00 pm to 2.00 pm' },
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }

      if (url.includes('/air-temperature')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'T1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:05:00Z',
                data: [{ stationId: 'T1', value: 29 }],
              },
            ],
          },
        });
      }

      if (url.includes('/relative-humidity')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'H1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:06:00Z',
                data: [{ stationId: 'H1', value: 80 }],
              },
            ],
          },
        });
      }

      if (url.includes('/rainfall')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'R1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:07:00Z',
                data: [{ stationId: 'R1', value: 1.2 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-speed')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'W1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:08:00Z',
                data: [{ stationId: 'W1', value: 5 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-direction')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'WD1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:09:00Z',
                data: [{ stationId: 'WD1', value: 180 }],
              },
            ],
          },
        });
      }

      if (url.includes('/uv')) {
        return jsonResponse({
          code: 0,
          data: {
            records: [
              {
                updatedTimestamp: '2026-05-04T00:10:00Z',
                index: [{ hour: '12pm', value: 7 }],
              },
            ],
          },
        });
      }

      if (url.includes('/psi')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:11:00Z',
                readings: { psi_twenty_four_hourly: { central: 42 } },
              },
            ],
          },
        });
      }

      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:12:00Z',
                readings: { pm25_one_hourly: { central: 9 } },
              },
            ],
          },
        });
      }

      if (url.includes('/v1/environment/4-day-weather-forecast')) {
        return jsonResponse({ items: [{ forecasts: [] }] });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.85);

    expect(snapshot.temperature_c).toBe(29);
    expect(snapshot.humidity_percent).toBe(80);
    expect(snapshot.rainfall_mm).toBe(1.2);
    expect(snapshot.wind_speed_knots).toBeCloseTo(9.7192);
    expect(snapshot.wind_direction_degrees).toBe(180);
    expect(snapshot.uv_index).toBe(7);
    expect(snapshot.psi_twenty_four_hourly).toBe(42);
    expect(snapshot.pm25_one_hourly).toBe(9);
    expect(snapshot.air_quality_region).toBe('central');
    expect(snapshot.forecast_low_c).toBeNull();
    expect(snapshot.forecast_high_c).toBeNull();
    expect(snapshot.condition).toBe('Cloudy');
    expect(snapshot.area).toBe('Bishan');
    expect(snapshot.observed_at).toBe('2026-05-04T00:05:00Z');
  });

  it('maps PSI and PM2.5 readings to the nearest region', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          data: {
            area_metadata: [
              {
                name: 'Bishan',
                label_location: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                timestamp: '2026-05-04T00:00:00Z',
                update_timestamp: '2026-05-04T00:15:00Z',
                valid_period: { text: '12.00 pm to 2.00 pm' },
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }

      if (url.includes('/air-temperature')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'T1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:05:00Z',
                data: [{ stationId: 'T1', value: 29 }],
              },
            ],
          },
        });
      }

      if (url.includes('/relative-humidity')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'H1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:06:00Z',
                data: [{ stationId: 'H1', value: 80 }],
              },
            ],
          },
        });
      }

      if (url.includes('/rainfall')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'R1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:07:00Z',
                data: [{ stationId: 'R1', value: 1.2 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-speed')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'W1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:08:00Z',
                data: [{ stationId: 'W1', value: 5 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-direction')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'WD1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:09:00Z',
                data: [{ stationId: 'WD1', value: 180 }],
              },
            ],
          },
        });
      }

      if (url.includes('/uv')) {
        return jsonResponse({
          code: 0,
          data: {
            records: [
              {
                updatedTimestamp: '2026-05-04T00:10:00Z',
                index: [{ hour: '12pm', value: 7 }],
              },
            ],
          },
        });
      }

      if (url.includes('/psi')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
              {
                name: 'north',
                labelLocation: { latitude: 1.45, longitude: 103.82 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:11:00Z',
                readings: {
                  psi_twenty_four_hourly: { central: 42, north: 55 },
                },
              },
            ],
          },
        });
      }

      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
              {
                name: 'north',
                labelLocation: { latitude: 1.45, longitude: 103.82 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:12:00Z',
                readings: {
                  pm25_one_hourly: { central: 9, north: 12 },
                },
              },
            ],
          },
        });
      }

      if (url.includes('/v1/environment/4-day-weather-forecast')) {
        return jsonResponse({ items: [{ forecasts: [] }] });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.85);

    expect(snapshot.air_quality_region).toBe('central');
    expect(snapshot.psi_twenty_four_hourly).toBe(42);
    expect(snapshot.pm25_one_hourly).toBe(9);
    expect(snapshot.observed_at).toBe('2026-05-04T00:05:00Z');
  });

  it('builds forecast cards from the 24-hour and 4-day forecast endpoints', async () => {
    fetchMock.mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/two-hr-forecast')) {
        return jsonResponse({
          code: 0,
          data: {
            area_metadata: [
              {
                name: 'Bishan',
                label_location: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                timestamp: '2026-05-04T00:00:00Z',
                update_timestamp: '2026-05-04T00:15:00Z',
                valid_period: { text: '12.00 pm to 2.00 pm' },
                forecasts: [{ area: 'Bishan', forecast: 'Cloudy' }],
              },
            ],
          },
        });
      }

      if (url.includes('/air-temperature')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'T1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:05:00Z',
                data: [{ stationId: 'T1', value: 29 }],
              },
            ],
          },
        });
      }

      if (url.includes('/relative-humidity')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'H1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:06:00Z',
                data: [{ stationId: 'H1', value: 80 }],
              },
            ],
          },
        });
      }

      if (url.includes('/rainfall')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'R1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:07:00Z',
                data: [{ stationId: 'R1', value: 1.2 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-speed')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'W1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:08:00Z',
                data: [{ stationId: 'W1', value: 5 }],
              },
            ],
          },
        });
      }

      if (url.includes('/wind-direction')) {
        return jsonResponse({
          code: 0,
          data: {
            stations: [
              { id: 'WD1', location: { latitude: 1.35, longitude: 103.85 } },
            ],
            readings: [
              {
                timestamp: '2026-05-04T00:09:00Z',
                data: [{ stationId: 'WD1', value: 180 }],
              },
            ],
          },
        });
      }

      if (url.includes('/uv')) {
        return jsonResponse({
          code: 0,
          data: {
            records: [
              {
                updatedTimestamp: '2026-05-04T00:10:00Z',
                index: [{ hour: '12pm', value: 7 }],
              },
            ],
          },
        });
      }

      if (url.includes('/psi')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:11:00Z',
                readings: { psi_twenty_four_hourly: { central: 42 } },
              },
            ],
          },
        });
      }

      if (url.includes('/pm25')) {
        return jsonResponse({
          code: 0,
          data: {
            regionMetadata: [
              {
                name: 'central',
                labelLocation: { latitude: 1.35, longitude: 103.85 },
              },
            ],
            items: [
              {
                updatedTimestamp: '2026-05-04T00:12:00Z',
                readings: { pm25_one_hourly: { central: 9 } },
              },
            ],
          },
        });
      }

      if (url.includes('/twenty-four-hr-forecast')) {
        return jsonResponse({
          code: 0,
          data: {
            records: [
              {
                timestamp: '2026-05-04T00:20:00Z',
                updatedTimestamp: '2026-05-04T00:25:00Z',
                general: {
                  temperature: { low: 25, high: 32 },
                },
                periods: [
                  {
                    timePeriod: { text: 'Morning' },
                    regions: {
                      central: { text: 'Fair', code: 'fair' },
                    },
                  },
                  {
                    timePeriod: { text: 'Afternoon' },
                    regions: {
                      central: { text: 'Cloudy', code: 'cloudy' },
                    },
                  },
                ],
              },
            ],
          },
        });
      }

      if (url.includes('/v1/environment/4-day-weather-forecast')) {
        return jsonResponse({
          items: [
            {
              update_timestamp: '2026-05-04T00:30:00Z',
              forecasts: [
                {
                  date: '2026-05-04',
                  forecast: 'Cloudy',
                  temperature: { low: 25, high: 32 },
                },
                {
                  date: '2026-05-05',
                  forecast: 'Partly Cloudy',
                  temperature: { low: 26, high: 33 },
                },
              ],
            },
          ],
        });
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    const client = new SingaporeWeatherClient();
    const snapshot = await client.getCurrentWeather(1.35, 103.85);

    expect(snapshot.forecast_low_c).toBe(25);
    expect(snapshot.forecast_high_c).toBe(32);
    expect(snapshot.forecast_periods).toEqual([
      { label: 'Morning', forecast: 'Fair' },
      { label: 'Afternoon', forecast: 'Cloudy' },
    ]);
    expect(snapshot.daily_forecast).toEqual([
      {
        date: '2026-05-04',
        forecast: 'Cloudy',
        temperature_low_c: 25,
        temperature_high_c: 32,
      },
      {
        date: '2026-05-05',
        forecast: 'Partly Cloudy',
        temperature_low_c: 26,
        temperature_high_c: 33,
      },
    ]);
    expect(snapshot.observed_at).toBe('2026-05-04T00:05:00Z');
  });
});

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
