"use client"

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/map-pin.svg",
  iconUrl: "/leaflet/map-pin.svg",
  shadowUrl: "/leaflet/marker-shadow.svg",
})

type LatLng = { lat: number; lng: number }

function DraggableMarker({
  position,
  onChange,
}: {
  position: LatLng
  onChange: (pos: LatLng) => void
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng)
    },
  })

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => onChange(e.target.getLatLng()),
      }}
    />
  )
}

export default function LocationPickerClient({
  value,
  onChange,
}: {
  value: LatLng | null
  onChange: (pos: LatLng) => void
}) {
  if (!value || typeof value.lat !== "number" || typeof value.lng !== "number") {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded">
        Loading map…
      </div>
    )
  }

  return (
    <MapContainer
      center={[value.lat, value.lng]}
      zoom={16}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <DraggableMarker position={value} onChange={onChange} />
    </MapContainer>
  )
}
