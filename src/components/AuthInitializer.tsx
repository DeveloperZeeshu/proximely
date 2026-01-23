"use client"

import { useEffect } from "react"
import { authorize } from "../store/auth/authThunks"
import { useAppDispatch } from "../hooks/redux-hooks"

export default function AuthInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authorize())
  }, [dispatch])

  return null
}
