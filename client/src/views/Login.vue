<script setup lang="ts">
import Password from "primevue/password"
import FloatLabel from 'primevue/floatlabel'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'

let loading = false;

function load() {
console.log("here")
    loading = !loading
}
</script>

<template>
<form @click.prevent="onSubmit">
    <InputGroup>
        <FloatLabel>
            <InputText inputId='username'/>
            <label for="username">Username</label>
        </FloatLabel>
    </InputGroup>
    <InputGroup>

        <FloatLabel>
            <Password v-model="value" inputId="password" toggleMask />
            <label for="password">Password</label>
        </FloatLabel>
    </InputGroup>
    <InputGroup>
        <Button label="Login" :loading="loading" @click="loading=!loading"/>
    </InputGroup>
</form>
</template>
