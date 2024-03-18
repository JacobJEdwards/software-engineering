<script setup>
import {defineProps, ref} from "vue"
import Milestone from "./Milestone.vue"

/*
export type Module = {
  moduleName: string;
  moduleCode: string;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
}
props
*/

defineProps({
    module: {
        type: Object,
        required: true
    }
})

const show = ref(false)


</script>
<template>
    <v-card>
        <v-card-title>
            <h3>{{module.moduleName}}</h3>
        </v-card-title>
        <v-card-text v-if="show">
            <p>Module Code: {{module.moduleCode}}</p>
            <p>Start Date: {{module.startDate}}</p>
            <p>End Date: {{module.endDate}}</p>
            <v-divider></v-divider>
            <v-row>
                <v-col v-for="milestone in module.milestones" :key="milestone.id">
                    <Milestone :milestone="milestone"/>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="show = !show">
                {{ show ? 'Hide' : 'Show' }} Details
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
