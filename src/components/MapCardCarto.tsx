"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, MapRef } from "react-map-gl/maplibre";

const bankLocationQuery = "250 Bishopsgate, London, United Kingdom";
const bankLabel = "National Westminster Bank PLC";
const vectorStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

export default function MapCardCarto() {
  const [marker, setMarker] = useState({ lng: -0.1, lat: 51.515 });
  const [paletteReady, setPaletteReady] = useState(false);
  const mapRef = useRef<MapRef | null>(null);

  const initialViewState = useMemo(
    () => ({
      longitude: -0.1,
      latitude: 51.515,
      zoom: 12.85,
    }),
    []
  );

  const applyPalette = useCallback((mapInstance: maplibregl.Map) => {
    const style = mapInstance.getStyle();
    if (!style?.layers) return;

    style.layers.forEach((layer) => {
      const layerId = layer.id.toLowerCase();

      if (layer.type === "background") {
        mapInstance.setPaintProperty(layer.id, "background-color", "#f1f3f8");
      }

      if (layer.type === "fill" && layerId.includes("water")) {
        mapInstance.setPaintProperty(layer.id, "fill-color", "#cbd7ef");
        mapInstance.setPaintProperty(layer.id, "fill-opacity", 0.95);
      }

      if (layer.type === "line" && layerId.includes("waterway")) {
        mapInstance.setPaintProperty(layer.id, "line-color", "#c9d5ec");
        mapInstance.setPaintProperty(layer.id, "line-opacity", 0.2);
      }

      if (
        layer.type === "fill" &&
        (layerId.includes("land") ||
          layerId.includes("landuse") ||
          layerId.includes("park") ||
          layerId.includes("green") ||
          layerId.includes("vegetation"))
      ) {
        mapInstance.setPaintProperty(layer.id, "fill-color", "#eceef3");
        mapInstance.setPaintProperty(layer.id, "fill-opacity", 0.95);
      }

      if (
        layer.type === "fill" &&
        !layerId.includes("water") &&
        !layerId.includes("building") &&
        !layerId.includes("structure")
      ) {
        mapInstance.setPaintProperty(layer.id, "fill-color", "#eceef3");
      }

      if (
        layer.type === "fill" &&
        (layerId.includes("building") || layerId.includes("structure"))
      ) {
        mapInstance.setPaintProperty(layer.id, "fill-color", "#e6e8ee");
        mapInstance.setPaintProperty(layer.id, "fill-opacity", 0.82);
      }

      if (layer.type === "fill-extrusion") {
        mapInstance.setLayoutProperty(layer.id, "visibility", "none");
      }

      if (
        layer.type === "line" &&
        (layerId.includes("building") || layerId.includes("structure"))
      ) {
        mapInstance.setPaintProperty(layer.id, "line-color", "#eaecf2");
        mapInstance.setPaintProperty(layer.id, "line-opacity", 0.25);
      }

      if (
        layer.type === "line" &&
        !layerId.includes("waterway") &&
        !layerId.includes("water")
      ) {
        mapInstance.setPaintProperty(layer.id, "line-color", "#e9edf4");
        mapInstance.setPaintProperty(layer.id, "line-opacity", 0.16);
      }

      if (
        layer.type === "line" &&
        (layerId.includes("road") ||
          layerId.includes("street") ||
          layerId.includes("motorway") ||
          layerId.includes("rail") ||
          layerId.includes("path") ||
          layerId.includes("bridge"))
      ) {
        mapInstance.setLayoutProperty(layer.id, "visibility", "none");
      }

      if (
        layer.type === "line" &&
        (layerId.includes("boundary") || layerId.includes("admin"))
      ) {
        mapInstance.setPaintProperty(layer.id, "line-opacity", 0.15);
      }

      if (layer.type === "symbol" && layerId.includes("label")) {
        mapInstance.setPaintProperty(layer.id, "text-color", "#68768e");
        mapInstance.setPaintProperty(layer.id, "text-opacity", 0.72);
        mapInstance.setPaintProperty(layer.id, "text-halo-color", "#eff1f6");
      }

      if (
        layer.type === "symbol" &&
        (layerId.includes("poi") ||
          layerId.includes("airport") ||
          layerId.includes("transit") ||
          layerId.includes("housenum") ||
          layerId.includes("road-label") ||
          layerId.includes("motorway-junction") ||
          layerId.includes("ref") ||
          layerId.includes("shield") ||
          layerId.includes("route") ||
          layerId.includes("highway") ||
          layerId.includes("number") ||
          layerId.includes("network"))
      ) {
        mapInstance.setLayoutProperty(layer.id, "visibility", "none");
      }

      if (layer.type === "symbol") {
        const layout = (layer as { layout?: Record<string, unknown> }).layout;
        const textField = layout?.["text-field"];
        const textFieldJson = JSON.stringify(textField ?? "");
        if (textFieldJson.includes("\"ref\"")) {
          mapInstance.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
    });
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", bankLocationQuery);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "1");

        const response = await fetch(url.toString());
        if (!response.ok) return;

        const data = (await response.json()) as Array<{ lon: string; lat: string }>;
        const result = data?.[0];
        if (!result) return;

        const next = { lng: Number(result.lon), lat: Number(result.lat) };
        setMarker(next);
        mapRef.current?.flyTo({ center: [next.lng, next.lat], zoom: 13.15 });
      } catch {
        // Keep fallback marker.
      }
    };

    void fetchCoordinates();
  }, []);

  return (
    <section className="w-full">
      <div className="rounded-[32px] border border-[#c8cff5] bg-white/90 shadow-[0_32px_80px_-60px_rgba(15,23,42,0.45)]">
        <div className="px-6 pt-6 md:px-10 md:pt-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#151c38] text-white shadow-[0_12px_26px_-16px_rgba(21,28,56,0.8)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 10.5h16M6.5 10.5v6.75m3.5-6.75v6.75m3.5-6.75v6.75m3.5-6.75v6.75M4 19h16M5.25 7.5 12 4l6.75 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Bank profile</p>
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{bankLabel}</h1>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50/80 px-5 py-4 text-slate-900 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Established", value: "1990" },
              { label: "Headquarters", value: "United Kingdom" },
              { label: "SWIFT network", value: "Yes/No" },
              { label: "Focus", value: "Retail/Corporate banking" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 md:px-10 md:pb-8">
          <div className="carto-map-clean relative mt-6 h-[300px] overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 md:h-[360px]">
            <Map
              ref={mapRef}
              mapStyle={vectorStyleUrl}
              initialViewState={initialViewState}
              style={{
                width: "100%",
                height: "100%",
                opacity: paletteReady ? 1 : 0,
                transition: "opacity 220ms ease",
              }}
              attributionControl={false}
              scrollZoom={false}
              boxZoom={false}
              doubleClickZoom={false}
              dragRotate={false}
              touchZoomRotate={false}
              keyboard={false}
              interactive={false}
              onLoad={() => {
                const instance = mapRef.current?.getMap();
                if (instance) {
                  instance.setPitch(0);
                  instance.setBearing(0);
                  applyPalette(instance);
                  requestAnimationFrame(() => {
                    setPaletteReady(true);
                  });
                }
              }}
            >
              <Marker longitude={marker.lng} latitude={marker.lat} anchor="bottom">
                <div className="flex flex-col items-center">
                  <div className="rounded-full border border-slate-900/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-lg">
                    {bankLabel}
                  </div>
                  <div className="mt-2 h-3 w-3 rounded-full bg-[#0f172a] shadow-[0_6px_12px_-6px_rgba(15,23,42,0.7)]" />
                  <div className="h-3 w-3 -translate-y-2 rotate-45 rounded-[2px] bg-[#0f172a]" />
                </div>
              </Marker>
            </Map>
            {!paletteReady && (
              <div className="pointer-events-none absolute inset-0 bg-[#eef1f7]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
