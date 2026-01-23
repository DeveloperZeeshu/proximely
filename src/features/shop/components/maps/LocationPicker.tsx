import dynamic from "next/dynamic"

const LocationPicker = dynamic(
  () => import("./LocationPicker.client"),
  {
    ssr: false,
  }
)

export default LocationPicker
