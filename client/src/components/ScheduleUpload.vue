<script setup lang="ts">
    import { ref, computed } from "vue"

    const file = ref<File | null>(null);
    const errorMessage = ref("")
    const loading = ref(false)

    const fileName = computed(() => file.value?.name);

    const uploadFile = (e: Event) => {
        console.log("here")
        console.log(file.value)
        errorMessage.value = ""
        file.value = event.target.files[0]
        console.log(event)
    }

    const submitFile = async () => {
    console.log(file.value)
        loading.value = true
        const reader = new FileReader()
        if (!file.value) {
            errorMessage.value = "No file uploaded"
            loading.value = false
            return
        }

        read.readAsDataURL(file.value)

        reader.onload = async () => {
            const encodedFile = reader.result.split(",")[1]
            try {

            } catch(e: Exception) {
                errorMessage.value = e.message || "Error uploading file"
            } finally {
                loading.value = false
            }
        }
    }

</script>

<template>
    <v-form @submit.prevent="submitFile">
    <v-file-input 
            label="Schedule Upload">
            v-model="file"
            @update:modalValue="uploadFile"
            required
    </v-file-input>
    <v-btn type="submit" :loading="loading">Upload</v-btn>
    </v-form>
</template>
<style scoped>

</style>
