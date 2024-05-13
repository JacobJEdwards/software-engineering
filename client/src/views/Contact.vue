<template>
  <div class="contact-form">
    <h1 class="title">Contact Us</h1>
    <form @submit.prevent="submitForm" class="form">
      <label for="name" class="label">Name:</label><br>
      <input type="text" id="name" v-model="formData.name" class="input"><br>
      <span class="error">{{ errors.first('name') }}</span><br>

      <label for="email" class="label">Email:</label><br>
      <input type="email" id="email" v-model="formData.email" class="input"><br>
      <span class="error">{{ errors.first('email') }}</span><br>

      <label for="message" class="label">Message:</label><br>
      <textarea id="message" v-model="formData.message" class="input"></textarea><br><br>
      <span class="error">{{ errors.first('message') }}</span><br>

      <button type="submit" class="button">Submit</button>
    </form>

    <h2 class="subtitle">The team:</h2>
    <div v-for="member in teamMembers" :key="member.email" class="team-member">
      <h3>{{ member.name }}</h3>
      <p>Email: <a :href="'mailto:' + member.email">{{ member.email }}</a></p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default defineComponent({
  setup() {
    const { handleSubmit } = useForm();
    const { value: name, errorMessage: nameError } = useField('name', yup.string().required('Name is required'));
    const { value: email, errorMessage: emailError } = useField('email', yup.string().email('Invalid email').required('Email is required'));
    const { value: message, errorMessage: messageError } = useField('message', yup.string().required('Message is required'));

    const formData = { name, email, message };

    const submitForm = handleSubmit(() => {
      alert('Form submitted successfully!');
      // Reset form
      formData.name = '';
      formData.email = '';
      formData.message = '';
    });

    const teamMembers = [
      { name: 'Jamie Wales', email: 'J.Wales@uea.ac.uk' },
      { name: 'Jacob Edwards', email: 'J.Edwards@uea.ac.uk' },
      { name: 'Yucheng Bun', email: 'Y.Bun@uea.ac.uk' },
      { name: 'Faizan Khan', email: 'F.Khan@uea.ac.uk' },
      { name: 'Andrew Lord', email: 'A.Lord@uea.ac.uk' }
    ];

    return {
      submitForm,
      formData,
      nameError,
      emailError,
      messageError,
      teamMembers
    };
  }
});
</script>

<style scoped>
.contact-form {
  font-family: 'Arial', sans-serif;
  font-size: 18px;
}

.title {
  font-size: 36px;
  font-weight: bold;
}

.subtitle {
  font-size: 24px;
  font-weight: bold;
}

.label {
  font-size: 20px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px;
}

.button {
  padding: 10px 20px;
  font-size: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
