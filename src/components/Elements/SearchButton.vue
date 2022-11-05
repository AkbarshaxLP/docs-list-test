<template>
  <label class="custom-search" :class="{ active: focus }">
    <i class="el-icon-search search"></i>
    <input
      placeholder="Поиск"
      @focus="focus = true"
      @blur="focus = false"
      type="text"
      :value="value"
      v-on:input="$emit('input', $event.target.value)"
      class="search-button"
    />
    <i
      v-if="value"
      @click="
        value = '';
        $emit('input', '');
      "
      class="el-icon-close clear"
    ></i>
  </label>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      focus: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-search {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #dcdfe6;
  width: 400px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    border-radius: 2px;
    border: 0.5px transparent solid;
    transition: all 0.2s ease-in-out;
  }
  &.active {
    &::after {
      width: 100%;
      border: 0.5px #409eff solid;
    }
  }
  .search {
    font-size: 24px;
    color: rgba($color: #000000, $alpha: 0.6);
    margin-right: 8px;
  }
  .clear {
    font-size: 24px;
    color: #f56c6c;
    margin-right: 8px;
    cursor: pointer;
  }
  input {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    border: none;
    box-shadow: none;
    outline: none;
    font-size: 18px;
    &::placeholder {
      font-style: oblique 10deg;
    }
  }
}
</style>