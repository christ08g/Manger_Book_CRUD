<template>
  <v-container>
    <v-card>

      <!--Bagian Header-->
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">Book Manager</span>
        <v-btn color="error" class="mt-4" @click="logout">LogOut</v-btn>


      </v-card-title>

      <!--Bagian Filter-->
      <v-card-subtitle>
        <v-row>
        <v-col cols="12" md="2">
            <v-text-field v-model="filters.ID" label="Filter by ID" clearable @keyup.enter="fetchBooks" />
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field v-model="filters.Title" label="Filter by Title" clearable @keyup.enter="fetchBooks" />
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field v-model="filters.Author" label="Filter by Author" clearable @keyup.enter="fetchBooks" />
        </v-col>
        <v-col cols="12" md="2">
            <v-text-field v-model="filters.Year" label="Filter by Year" clearable @keyup.enter="fetchBooks" />
        </v-col>
        </v-row>
        <v-btn color="secondary" @click="fetchBooks">Terapkan Filter</v-btn>
      </v-card-subtitle>

      <!-- Bagian Tabel Buku -->
      <v-data-table
        :headers="headers"
        :items="books"
        :loading="loading"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-btn icon size="small" @click="openDialog('view', item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn icon size="small" style="margin-left: 20px;" color="primary" @click="openDialog('edit', item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" style="margin-left: 20px;" color="error" @click="deleteBook(item.ID)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

      <!--Bagian Footer-->
      <template #bottom>
      <v-divider></v-divider>
      <v-card-actions class="d-flex align-center justify-space-between">

      <!-- Tombol di kiri -->
      <v-btn color="primary" @click="openDialog('create')">
        <v-icon left>mdi-plus</v-icon> Tambah Buku
      </v-btn>

      <!-- Pagination bawaan di kanan -->
      <v-data-table-footer
        :page="1"
        :items-per-page="10"
        :items-length="books.length"
      />
    </v-card-actions>
    </template>
      </v-data-table>
    </v-card>

    <!-- Bagian popup dialog Detail Buku/Edit/Tambah Buku dipakai untuk tiga fungsi berbeda (view, edit, create)-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <template v-if="dialogMode === 'view'">
            <p><strong>ID:</strong>{{ form.ID }}</p>
            <p><strong>Title:</strong> {{ form.Title }}</p>
            <p><strong>Author:</strong> {{ form.Author }}</p>
            <p><strong>Year:</strong> {{ form.Year }}</p>
          </template>

          <template v-else>
            <v-text-field v-model="form.Title" label="Title" />
            <v-text-field v-model="form.Author" label="Author" />
            <v-text-field v-model="form.Year" label="Year" type="date"/>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Tutup</v-btn>
          <v-btn
            v-if="dialogMode !== 'view'"
            color="primary"
            @click="saveBook"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from "axios";
import { ref, reactive, onMounted, computed } from "vue";

export default {
  name: "Dashboard",
  setup() {
  //Inisialisasi Router dan API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/books";
  const router = useRouter();

  // State Utama
  const books = ref([]); //Menyimpan Data Buku Dari Database 
  const loading = ref(false); //Menyimpan Filter Pencarian
  const filters = reactive({ ID: "", Title: "", Author: "", Year: "" });

  //Dialog dan Form
  const dialog = ref(false); //Mengatur Dialog Buka Tutup 
  const dialogMode = ref("create"); // dialog create, edit, view
  const form = reactive({ ID: null, Title: "", Author: "", Year: "" });

  //Header Kolom Tabel
  const headers = [
  { title: "ID", key: "ID"},
  { title: "Title", key: "Title" },
  { title: "Author", key: "Author" },
  { title: "Year", key: "Year" },
  { title: "Actions", key: "actions", sortable: false },
  ];

  //Judul Dialog
  const dialogTitle = computed(() => {
    switch (dialogMode.value) {
      case "create":
        return "Tambah Buku";
      case "edit":
        return "Edit Buku";
      case "view":
        return "Detail Buku";
    }
  });

    // Ambil Data Buku
    async function fetchBooks() {
      loading.value = true;
      try {
        const params = {};
        if (filters.ID) params.ID = filters.ID;
        if (filters.Title) params.Title = filters.Title;
        if (filters.Author) params.Author = filters.Author;
        if (filters.Year) params.Year = filters.Year;
        const res = await axios.get(API_URL, { params });
        books.value = res.data.data || res.data;
      } catch (err) {
        console.error(err);
        alert("Gagal memuat buku");
      } finally {
        loading.value = false;
      }
    }

    //Buka dialog tambah, edit, view
    function openDialog(mode, item = null) {
      dialogMode.value = mode;
      if (item) Object.assign(form, item);
      else Object.assign(form, { ID: null, Title: "", Author: "", Year: "" });
      dialog.value = true;
    }

    //Simpan Data Buku dan Edit Buku
    async function saveBook() {
      try {
        if (!form.Title) return alert("Judul wajib diisi");

        console.log("Mengirim data:", form);

        if (dialogMode.value === "create") {
          await axios.post(API_URL, form)
        } else if (dialogMode.value === "edit") {
          await axios.put(`${API_URL}/${form.ID}`,form)
        }

        dialog.value = false;
        fetchBooks();
      } catch (err) {
        console.error("Error saat menyimpan buku:", err);
        alert("Gagal menyimpan buku");
      }
    }

    //Hapus Data Buku
    async function deleteBook(ID) {
      if (!confirm("Hapus buku ini?")) return;
      try {
        await axios.delete(`${API_URL}/${ID}`);
        fetchBooks();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus buku");
      }
    }

    //Log out ke "/" atau ke halaman Login
    function logout() {
    router.push('/')
    }

    onMounted(fetchBooks);

    return {
      books,
      headers,
      filters,
      fetchBooks,
      dialog,
      dialogMode,
      dialogTitle,
      form,
      openDialog,
      saveBook,
      deleteBook,
      loading,
      logout,
    };
  },
};
</script>
