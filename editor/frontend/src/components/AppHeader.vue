<template>
  <header>
    <div class="logo">
      Anime Archive Editor
    </div>

    <nav>
      <router-link to="/people">
        People
      </router-link>
      <router-link to="/works">
        Works
      </router-link>
      <router-link to="/companies">
        Companies
      </router-link>
      <router-link to="/publishers">
        Publishers
      </router-link>
      <router-link to="/languages">
        Languages
      </router-link>
      <router-link to="/media-types">
        Media Types
      </router-link>
    </nav>
  </header>
</template>

<style scoped>

header {
  height: 60px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 25px;
}

.logo {
  font-weight: bold;
  margin-right: 40px;
}

nav {
  display: flex;
  gap: 10px;
}

a {
  color: var(--text-muted);
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 5px;
}

a:hover {
  background: var(--hover);
  color: white;
}

.router-link-active {
  background: var(--active);
  color: white;
}

</style>
<script setup lang="ts">
</script>