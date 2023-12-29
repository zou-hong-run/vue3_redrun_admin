<script setup lang="ts">
import MySide from '@/layout/aside/index.vue';
import MyHeader from '@/layout/header/index.vue';
import MyFooter from '@/layout/footer/index.vue';
</script>

<template>
  <el-container class="layout_container">
    <el-aside class="layout_aside">
      <MySide />
    </el-aside>
    <el-container>
      <el-header class="layout_header"> <MyHeader /></el-header>
      <el-main class="layout_main">
        <RouterView></RouterView>
      </el-main>
      <el-footer class="layout_footer">
        <MyFooter />
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100%;
  .layout_aside {
    width: $layout_aside_width;
  }
  .layout_header {
    height: $layout_header_height;
    width: calc(100%);
  }
  .layout_main {
    // background-color: orange;
    height: calc(100% - ($layout_header_height + $layout_footer_height));
  }
  .layout_footer {
    height: $layout_footer_height;
  }
}
</style>
