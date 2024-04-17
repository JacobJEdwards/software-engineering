import {API_ROUTE} from "../config";
import { User } from "../typings/user";
import type { Result } from "./common";

export const getUser = async (token: string): Promise<Result<User>> => {
    try {
        const response = await fetch(`${API_ROUTE}/protected/home`, {
            headers: {
                Authorization: token
            }
        })

        if (!response.ok) {
            return {success: false}
        }

        const {data} = await response.json();

        if (!data) {
            return {success: false}
        }

        return {success: true, data}

    } catch (e: unknown) {
        console.error(e)
        return {success: false}
    }
}

export const uploadFile = async (token: string, file: File): Promise<Result> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_ROUTE}/protected/upload`, {
            method: 'POST',
            headers: {
                Authorization: token
            },
            body: formData
        })

        if (!response.ok) {
            return {success: false}
        }

        return {success: true}

    } catch (e: unknown) {
        console.error(e)
        return {success: false}
    }

}

export const UserService = {
    get: getUser,
    upload: uploadFile
}