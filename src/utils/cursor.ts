
export const encodeCursor = (obj: object): string => {
    return Buffer.from(JSON.stringify(obj), 'utf-8').toString('base64')
}

export const decodeCursor = <T = any>(base64String: string): T => {
    const jsonString = Buffer.from(base64String, 'base64').toString('utf-8')
    return JSON.parse(jsonString)
}
