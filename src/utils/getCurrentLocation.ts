
interface Coordinates {
    lat: number
    lng: number
}

export const getCurrentLocation = async (): Promise<Coordinates> => {
    try {
        if (!navigator.geolocation)
            throw new Error('Geolocation not supported')

        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    res({ lat, lng })
                },
                (error) => {
                    rej(error)
                }
            )
        })
    } catch (err) {
        console.log('Geolocation error:', err)
        throw err
    }
}

