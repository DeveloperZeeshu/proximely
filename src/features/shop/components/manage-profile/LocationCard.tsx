'use client'

import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import LocationPicker from "../maps/LocationPicker"
import { handleAxiosError } from "@/src/apis/utils/handleAxiosError"
import { updateShop } from "@/src/apis/shop.api"
import { Button } from "@/src/components/ui/button"
import toast from "react-hot-toast"
import { Card, CardTitle } from "@/src/components/ui/card"
import { useAppDispatch } from "@/src/hooks/redux-hooks"
import { editShop } from "@/src/store/shop/shopSlice"

type Location = {
  lat?: number
  lng?: number
}

type LeafletLocation = {
  lat: number
  lng: number
}

type PropType = {
  shopId?: string
  initialLocation?: Location
}

export function LocationCard({ shopId, initialLocation }: PropType) {
  const [toEdit, setToEdit] = useState(false)

  const dispatch = useAppDispatch()

  // Real location
  const [location, setLocation] = useState<LeafletLocation>({
    lat: initialLocation?.lat ?? 26.9124,
    lng: initialLocation?.lng ?? 75.7873
  })

  // Draft location
  const [draftLocation, setDraftLocation] = useState<LeafletLocation>(location)

  // Sync if backend updates
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      const next = {
        lat: initialLocation.lat,
        lng: initialLocation.lng
      }
      setLocation(next)
      setDraftLocation(next)
    }
  }, [initialLocation])

  // Save updated location
  const handleSave = async () => {
    if (!shopId) return
    try {
      const result = await updateShop({
        shopId,
        payload: {
          latitude: draftLocation.lat,
          longitude: draftLocation.lng
        }
      })

      dispatch(editShop(result.updatedShop))

      toast.success('Location updated successfully')

      setLocation(draftLocation)
      setToEdit(false)
    } catch (err: unknown) {
      handleAxiosError(err)
    }
  }

  // Cancel edits
  const handleCancel = () => {
    setDraftLocation(location)
    setToEdit(false)
  }

  // Auto-detect user location from browser
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      setDraftLocation(coords)
    })
  }

  const isLocationAdded =
    !!initialLocation?.lat &&
    !!initialLocation?.lng

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <CardTitle>Location</CardTitle>

        {!toEdit && (
          <div
            onClick={() => setToEdit(true)}
            className="text-sm flex items-center gap-1 cursor-pointer hover:text-gray-800"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </div>
        )}
      </div>

      {!isLocationAdded &&
        <p className="text-sm text-red-600 mb-3">
          Set your shop location so customers can view it on the map and better plan visits, pickups, or deliveries.
        </p>
      }

      <div className="h-50 bg-gray-100 rounded-lg flex items-center justify-center">
        <LocationPicker
          value={toEdit ? draftLocation : location}
          onChange={(pos) => {
            if (!toEdit) return
            setDraftLocation(pos)
          }}
        />
      </div>

      {toEdit && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Use Current Location
          </button>

          <div className="flex justify-end gap-3 text-sm">
            <button
              onClick={handleCancel}
              className="cursor-pointer hover:text-gray-800">
              Discard
            </button>
            <Button
              type="button"
              text='Save'
              onClick={handleSave}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Drag the pin to adjust your shop location if needed.
      </p>
    </Card>
  )
}
