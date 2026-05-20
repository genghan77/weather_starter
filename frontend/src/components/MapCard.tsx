import { useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useSelectedLocation, useStore } from '../state/store';

const DEFAULT_CENTER = [1.3521, 103.8198] as const;

function createMarkerIcon() {
  return L.divIcon({
    className: 'marker-pin pointer-events-none',
    html: '<span class="h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-white shadow-lg"></span>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function MapCard() {
  const { locations } = useStore();
  const selected = useSelectedLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const center = useMemo<[number, number]>(() => {
    if (selected) return [selected.latitude, selected.longitude];
    if (locations.length > 0) return [locations[0].latitude, locations[0].longitude];
    return [DEFAULT_CENTER[0], DEFAULT_CENTER[1]];
  }, [locations, selected]);

  const markerIcon = useMemo(() => createMarkerIcon(), []);

  const renderMap = () => (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={markerIcon}
        >
          <Tooltip
            direction="top"
            permanent
            offset={[0, -10]}
            className="pointer-events-none rounded-full border border-white/10 bg-slate-950/90 px-2 py-1 text-[11px] font-semibold text-white shadow-lg"
          >
            {location.weather.condition ? (
              <span>
                {`${location.weather.condition.split(' ')[0]} · ${
                  location.weather.temperature_c != null
                    ? `${Math.round(location.weather.temperature_c)}°`
                    : '—'}
                `}
              </span>
            ) : (
              `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`
            )}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );

  return (
    <>
      <section className="rounded-2xl border border-white/15 bg-white/[0.08] shadow-xl backdrop-blur-xl">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
          <div>Weather map</div>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/[0.12]"
          >
            View full map
          </button>
        </header>

        <div className="h-72 overflow-hidden rounded-b-2xl">
          {locations.length > 0 ? (
            renderMap()
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-sm text-white/60">
              Add a location to see the weather map.
            </div>
          )}
        </div>
      </section>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/95 px-4 py-3 text-sm text-white/90">
            <span>{locations.length} saved location{locations.length === 1 ? '' : 's'}</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/[0.16]"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden rounded-3xl border border-white/15 bg-slate-950">
            {locations.length > 0 ? (
              renderMap()
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-sm text-white/60">
                Add a location to display it on the map.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
