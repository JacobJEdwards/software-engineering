<script setup lang="ts">
    import { ref, computed } from "vue"

    const file = ref<File | null>(null);
    const errorMessage = ref("")
    const loading = ref(false)

    const fileName = computed(() => file.value?.name);

    const uploadFile = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        file.value = target.files[0]
    }

    const submitFile = async () => {
        loading.value = true;
        errorMessage.value = ""

        if (!file.value) {
            errorMessage.value = "Please upload a file"
            loading.value = false;
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file.value);

            const response = await fetch("", {
                 method: "POST",
                 body: formData,
                 headers: {
                   "Content-Type": "multipart/form-data"
                }
            })

            const data = await response.json();
            console.log(data);
        } catch (e) {
            console.error(e)
        } finally {
          loading.value = false;
        }
    }

</script>

<template>
    <v-form @submit.prevent="submitFile">
    <v-file-input 
            label="Schedule Upload"
            @change="uploadFile"
            required>
    </v-file-input>
    <v-btn type="submit" :loading="loading">Upload</v-btn>
    </v-form>
</template>
<style scoped>

</style>
