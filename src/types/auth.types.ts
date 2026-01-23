export type RoleType = 'USER' | 'ADMIN'

export type SetAuthPayloadType = {
    roles: RoleType[]
    isEmailVerified: boolean
    hasShop: boolean
}