import {API_ROUTE} from "../config";
import { User } from "../typings/user";

type Result = {
    success: boolean;
    data?: User;
    error?: string;
}

export const getUser = async (token: string): Promise<Result> => {
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

    } catch (e) {
        console.error(e)
        return {success: false}
    }
}
