<script setup lang="ts">
import Password from "primevue/password"
import FloatLabel from 'primevue/floatlabel'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'

import { useRouter } from "vue-router"

import { ref } from 'vue'

const loading = ref(false);
const username = ref('')
const password = ref('')
const error = ref("")

const router = useRouter()

const login = async () => {
    loading.value = true;
    try {
        const res = await fetch
    } catch {
        error.value = "Error on signup" 
    } finally {
        loading.value = false;
    }
    $cookies.set("auth", "test")
    router.push("/")
    
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
            <Password v-model="password" id="password" toggleMask />
            <label for="password">Password</label>
        </FloatLabel>
        </InputGroup>

        <InputGroup>
        <Button label="Login" :loading="loading" type="submit"/>
        </InputGroup>
</form>
</template>
