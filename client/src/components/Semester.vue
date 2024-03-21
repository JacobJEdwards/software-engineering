<script setup lang="ts">
import { ref, defineProps } from 'vue'
import Module from './Module.vue'
import type { Semester } from '../typings/user'


defineProps<{ semester: Semester }>()

const showModule = ref<boolean>(false)

</script>

<template>
<v-card class="mb-4">
    <v-card-title>
        {{ semester.semesterName }}
    </v-card-title>
    <v-card-text v-if="showModule">
        <v-row>
            <v-col v-for="module in semester?.modules" :key="module.moduleName">
                <Module :module="module" />
            </v-col>
        </v-row>
    </v-card-text>
    <v-card-actions>
        <v-btn @click="showModule = !showModule">
            {{ showModule ? 'Hide' : 'Show' }} Modules
        </v-btn>
    </v-card-actions>
</v-card>

</template>
