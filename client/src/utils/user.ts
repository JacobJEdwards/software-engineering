import {API_ROUTE} from "../config.ts";
import {useCookies} from "./utils.ts"
import {useRouter} from "vue-router"

const $cookies = useCookies()
const router = useRouter()

export const getUserInfo = async () => {
    try {
        const token = $cookies?.get("auth");
        if (!token) {
            await router.push("/login");
            return;
        }

        const data = $cookies?.get("user-info")
        if (data) {
            return JSON.parse(data);
        }

        const res = await fetch(`${API_ROUTE}/user`, {
            headers: {
                "Authorization": token
            }
        })

        if (!res.ok) {
            throw new Error("Error fetching")
        }

        const userData = await res.json();
        $cookies?.set("user-info", JSON.stringify(userData))

        return userData;
    } catch (e) {
        console.error(e)
    }
}
