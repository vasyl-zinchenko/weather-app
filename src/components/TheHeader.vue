<template>
  <header class="header">
    <div class="header__wrapper">
      <nav>
        <RouterLink to="/" :class="{ 'active-nav-link': isLinkActive('/') }">
          Home
        </RouterLink>

        <RouterLink
          to="/favorite"
          :class="{ 'active-nav-link': isLinkActive('/favorite') }"
        >
          Favorite
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

function isLinkActive(path) {
  return route.path === path;
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #333;

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    padding: 0 20px;
    max-width: 1200px;
    margin: auto;
    align-items: center;

    & > nav {
      display: flex;
      gap: 20px;
      color: white;
      padding: 10px 0;

      & > a {
        display: flex;
        color: white;
        padding: 10px 0;
      }
    }
  }
}

.active-nav-link {
  border-bottom: 2px solid white;
}

a {
  text-decoration: none;
}
</style>
