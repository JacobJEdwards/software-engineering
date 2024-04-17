import {API_ROUTE} from "../config.ts";
import type { Result } from "./common.ts";


export const login = async (email: string, password: string): Promise<Result> => {
    try {
        const response = await fetch(`${API_ROUTE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })

        if (!response.ok) {
            return {
                success: false,
                error: "Error on Login"
            }
        }

        const {token} = await response.json();

        if (!token) {
            return {
                success: false,
                error: "Error on Login"
            }
        }

        return {
            success: true,
            data: token
        }

    } catch (e) {
        console.error(e)
        return {
            success: false,
            error: "Error on Login"
        }
    }
}

export const signup = async (name: string, email: string, password: string): Promise<Result> => {
    try {

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, password, email
            })
        }

        const response = await fetch(`${API_ROUTE}/auth/signup`, options);

        if (!response.ok) {
            return {
                success: false,
            }
        }


        const { data } = await response.json();

        const userId = data?.userId;

        if (!userId) {
            return {
                success: false,
            }
        }

        return {
            success: true,
        }
    }  catch (e: unknown) {
        console.log(e)
        return {
            success: false
        }
    }
}

export const AuthService = {
    login,
    signup
}