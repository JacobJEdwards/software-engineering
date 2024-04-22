<template>
  <div>
    <h1>Contact Us</h1>
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label><br>
      <input type="text" id="name" v-model="formData.name"><br>
      <label for="email">Email:</label><br>
      <input type="email" id="email" v-model="formData.email"><br>
      <label for="message">Message:</label><br>
      <textarea id="message" v-model="formData.message"></textarea><br><br>
      <button type="submit">Submit</button>
    </form>

    <h2>The team:</h2>
    <div v-for="member in teamMembers" :key="member.email" class="team-member">
      <h3>{{ member.name }}</h3>
      <p>Email: <a :href="'mailto:' + member.email">{{ member.email }}</a></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      },
      teamMembers: [
        { name: 'Jamie Wales', email: 'J.Wales@uea.ac.uk' },
        { name: 'Jacob Edwards', email: 'J.Edwards@uea.ac.uk' },
        { name: 'Yucheng Bun', email: 'Y.Bun@uea.ac.uk' },
        { name: 'Faizan Khan', email: 'F.Khan@uea.ac.uk' },
        { name: 'Andrew Lord', email: 'A.Lord@uea.ac.uk' }
      ]
    };
  },
  methods: {
    async submitForm() {
      try {
        // Your form submission logic here
        alert('Form submitted successfully!');
        // Reset the form
        this.formData = {
          name: '',
          email: '',
          message: ''
        };
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  }
};
</script>

</style>
