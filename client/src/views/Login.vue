<script setup lang="ts">
import Password from "primevue/password"
import FloatLabel from 'primevue/floatlabel'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
</script>

<template>
<InputGroup>
<FloatLabel>
    <InputText inputId='username'/>
    <label for="username">Username</label>
</FloatLabel>

<FloatLabel>
    <Password v-model="value" inputId="password" toggleMask />
    <label for="password">Password</label>
</FloatLabel>

</InputGroup>
</template>
