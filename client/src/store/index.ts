import { InjectionKey } from 'vue'
import { createStore, createLogger, Store, useStore as baseUseStore } from 'vuex'
import user from './modules/user.ts'

// write state interfaces

// const debug = process.env.NODE_ENV !== 'production'

export const key: InjectionKey<Store<any>> = Symbol()

// type this
export const store = createStore<any>({
    modules: {
        user,
    },
    strict: true,
    plugins: [createLogger()]
})

export function useStore() {
    return baseUseStore(key)
}