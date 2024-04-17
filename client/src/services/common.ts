export type Result<T = any> = {
    success: boolean
    error?: string
    data?: T
}
