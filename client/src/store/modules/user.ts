import type {User} from "../../typings/user";
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { API_ROUTE } from "../../config"

export type UserState = {
    userId: string | null;
    auth: string | null;
    user: User | null;
}

const state: UserState = {
    userId: null,
    auth: null,
    user: null
}

const getters: GetterTree<UserState, any> = {
    user(state): User | null {
        return state.user
    },
    token(state): string | null {
        return state.auth
    }
}

const actions: ActionTree<UserState, any> = {
    getUser({ commit, state }): any {
        const token = state.auth

        if (!token) {
            return;
        }

        fetch(`${API_ROUTE}/protected/??`, {
            headers: {
                "Authorization": token
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Error getting profile")
            }
            return response.json()
        }).then((user) => {
            commit("saveUser", user);
        }).catch((e) => {
            console.error(e);
            commit('userError')
        })
    }
}

const mutations: MutationTree<UserState> = {
    saveUser(state, payload: User) {
        state.user = payload;
    },
    userError(state) {
        state.user = null;
    },
    loginUser(state, { token }) {
        state.auth = token;
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}