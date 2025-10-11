<template>
  <!--Bagian Awal Untuk Layar-->
 <v-container class="fill-height">
    <v-row justify="center" allign="center">
        <v-col cols="12" sm="8" md="4">
            <v-card class="pa-4" elevation="2">

                <!--Bagian Login-->
                <v-card-title class="text-center">LOGIN</v-card-title>
                <v-divider></v-divider>

                <!--Bagian Form Login-->
                <v-form @submit.prevent="login" class="mt-4">

                    <!--Input Email-->
                    <v-text-field 
                        v-model="email" 
                        variant="outlined" 
                        label="Email" 
                        type="email" 
                        required>
                    </v-text-field>

                    <!--Input Password-->
                    <v-text-field 
                        v-model="password" 
                        variant="outlined" 
                        label="Password" 
                        type="password" 
                        required>
                    </v-text-field>

                    <!--Tombol Login-->
                    <v-btn type="submit" color="primary" size="large" block> Login </v-btn>

                </v-form>

          </v-card>
        </v-col>
    </v-row>
 </v-container>

</template>

<script setup>
//Bagian Import Data
import {ref} from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter() 
const email = ref('') //Menyimpan Input Email
const password = ref('') //Menyimpan Input Password

//Bagian Login
const login = () => {
  //Validasi Agar Email dan Password yang tidak sesuai tidak bisa masuk
  if (email.value === 'admin@gmail.com' && password.value === '12345') {
      router.push('/dashboard') 
    } else {
      alert('Email atau password salah!')
    }
}
</script>

<style scoped>

/*Bagian Untuk Menurunkan Form agar Ke tengah*/
.fill-height {
  min-height: 100vh;
}
</style>
