<script setup lang="ts">
import Password from "primevue/password"
import FloatLabel from 'primevue/floatlabel'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import { API_ROUTE } from "/src/config.ts"

import { useRouter } from "vue-router"

import { ref } from 'vue'

const loading = ref(false);
const username = ref('')
const email = res("")
const password = ref('')
const error = ref("")

const router = useRouter()

const login = async () => {
    loading.value = true;
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, password, email
            })
        }

        const res = await fetch(`${API_ROUTE}/auth/signup`, options);

        if (!res.ok) {
            throw new Error("Error on login")
        }

        const { token } = await res.json();

        if (!token) {
            throw new Error("Error on login")
        }

        $cookies.set("auth", token)
        router.push("/")

    } catch {
        error.value = "Error on login" 
    } finally {
        loading.value = false;
    }

    
}

</script>

<template>
<form @submit.prevent="login">
        <InputGroup>
        <FloatLabel>
            <InputText v-model="username" id='username'/>
            <label for="username">Username</label>
        </FloatLabel>
        </InputGroup>

        <InputGroup>
        <FloatLabel>
            <InputText v-model="email" id='email' type="email" />
            <label for="username">Email</label>
        </FloatLabel>
        </InputGroup>

        <InputGroup>
        <FloatLabel>
            <Password v-model="password" id="password" toggleMask />
            <label for="password">Password</label>
        </FloatLabel>
        </InputGroup>

        <InputGroup>
        <Button label="Login" :loading="loading" type="submit"/>
            <p>{{loading}}</p>
        </InputGroup>
</form>
</template>
