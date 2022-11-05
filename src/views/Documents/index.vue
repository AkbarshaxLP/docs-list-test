<template>
  <div class="docs-page">
    <header class="docs-header">
      <h2>Документы</h2>
      <div class="actions">
        <el-button
          size="small"
          icon="el-icon-collection-tag"
          circle
        ></el-button>
        <el-button @click="dialog_category = true" size="small" round>
          <i class="el-icon-plus"></i>
          Новый тип
        </el-button>
        <el-button @click="dialog_element = true" size="small" round>
          <i class="el-icon-plus"></i>
          Новый документ
        </el-button>
      </div>
    </header>
    <SearchButton v-model="search" />

    <draggable
      @start="drag = true"
      @end="drag = false"
      class="mw-1000"
      ghost-class="ghost"
      animation="200"
      v-model="catList"
      handle=".handle-parent"
      draggable=".item-parent"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div
          v-for="(cat, cat_index) in catList_FILTERED"
          :key="cat.id"
          class="item-parent"
        >
          <div class="title bordered w-full d-flex items-center">
            <el-button
              size="mini"
              class="mr-4"
              @click="cat.collapse = !cat.collapse"
              circle
            >
              <i
                :class="{ rotate180: cat.collapse }"
                class="el-icon-arrow-up"
              ></i>
            </el-button>
            {{ cat.name }}
            <p class="description">{{ cat.description }}</p>
            <div class="actions">
              <i @click="changeCategory(cat)" class="el-icon-edit"></i>
              <i
                @click="
                  rmData = cat;
                  rmIndex = cat_index;
                  rmDialog = true;
                "
                class="el-icon-delete delete"
              ></i>
              <button class="handle-parent">
                <img src="@/assets/img/up-down-solid.svg" />
              </button>
            </div>
          </div>

          <draggable
            ghost-class="ghost"
            animation="200"
            :list="cat.elements"
            @start="drag = true"
            @end="drag = false"
            handle=".handle"
            :group="{ name: 'row' }"
            draggable=".item"
          >
            <div
              v-show="cat.collapse"
              v-for="(element, el_index) in filtering(cat.elements)"
              :key="`A_${element.id}`"
              class="item d-flex ml-4 items-center bordered"
            >
              {{ element.name }}
              <p class="description">{{ element.description }}</p>
              <div class="actions">
                <i
                  @click="changeElement(element, cat.id)"
                  class="el-icon-edit"
                ></i>
                <i
                  @click="cat.elements.splice(el_index, 1)"
                  class="el-icon-delete delete"
                ></i>
                <button class="handle">
                  <img src="@/assets/img/up-down-solid.svg" />
                </button>
              </div>
            </div>
          </draggable>
        </div>
      </transition-group>
    </draggable>
    <hr class="my-8" />
    <draggable
      class="mw-1000"
      ghost-class="ghost"
      animation="200"
      :list="freeList"
      @start="drag = true"
      @end="drag = false"
      handle=".handle"
      :group="{ name: 'row' }"
      draggable=".item"
    >
      <div
        v-for="(element, el_index) in freeList_FILTERED"
        :key="`A_${element.id}`"
        class="item d-flex items-center bordered"
      >
        {{ element.name }}
        <div class="actions">
          <i @click="changeElement(element, null)" class="el-icon-edit"></i>
          <i
            @click="freeList.splice(el_index, 1)"
            class="el-icon-delete delete"
          ></i>
          <button class="handle">
            <img src="@/assets/img/up-down-solid.svg" />
          </button>
        </div>
      </div>
    </draggable>

    <div class="extra-info">
      <el-checkbox v-model="extraInfo">Показать данные</el-checkbox>
      <el-row :gutter="20" v-if="extraInfo">
        <el-col :span="12">
          <div>
            <h3>Элементы с категориями</h3>
            <pre>{{ catList }}</pre>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <h3>Элементы без категории</h3>
            <pre>{{ freeList }}</pre>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- form modals -->
    <template>
      <AddCategoryDialog
        ref="changeCategory"
        @append="appendCategory"
        @toggle="dialog_category = $event"
        :show="dialog_category"
      />
      <AddElementDialog
        ref="changeElement"
        :catList="catList"
        @append="appendElement"
        @toggle="dialog_element = $event"
        :show="dialog_element"
      />
    </template>

    <!-- dialog for rm Category -->
    <el-dialog
      title="Предупреждение!"
      :visible.sync="rmDialog"
      width="600px"
      center
    >
      <span>Это категорие не пустое, выберите один из вариантов</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="rmCategory()"
          >Оставить только элементы</el-button
        >
        <el-button type="danger" @click="rmCategory(true)"
          >Удалить с элементами</el-button
        >
        <el-button @click="rmDialog = false">Закрыть</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchButton from "@/components/Elements/SearchButton.vue";
import AddCategoryDialog from "@/components/Form/AddCategory.vue";
import AddElementDialog from "@/components/Form/AddElement.vue";
import draggable from "vuedraggable";

export default {
  components: {
    SearchButton,
    draggable,
    AddCategoryDialog,
    AddElementDialog,
  },
  data() {
    return {
      drag: false,
      extraInfo: false,
      dialog_category: false,
      dialog_element: false,
      rmDialog: false,
      search: "",
      rmData: {},
      rmIndex: null,
      activeNames: ["1"],
      catList: [
        {
          id: 1,
          name: "category 1",
          collapse: true,
          elements: [
            {
              id: 1,
              name: "element 1",
            },
            {
              id: 2,
              name: "element 2",
            },
          ],
        },
        {
          id: 2,
          name: "category 2",
          collapse: false,
          elements: [
            {
              id: 3,
              name: "element 3",
            },
          ],
        },
        {
          id: 3,
          name: "category 3",
          collapse: true,
          elements: [],
        },
      ],
      freeList: [
        {
          id: 4,
          name: "element 4",
        },
      ],
    };
  },
  computed: {
    freeList_FILTERED() {
      return this.freeList.filter((resp) =>
        resp.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    catList_FILTERED() {
      return this.catList.filter((resp) => {
        if (resp.name.toLowerCase().includes(this.search.toLowerCase())) {
          return true;
        } else {
          let elHas = false;
          resp.elements.filter((resp_2) => {
            if (resp_2.name.toLowerCase().includes(this.search.toLowerCase())) {
              elHas = true;
            }
          });
          return elHas;
        }
      });
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    nextCatId() {
      let maxId = 1;
      this.catList.filter((resp) => {
        if (resp.id > maxId) {
          maxId = resp.id;
        }
      });
      return maxId + 1;
    },
    nextElId() {
      let maxId = 1;
      this.catList.filter((resp) => {
        if (resp.elements) {
          resp.elements.filter((resp_2) => {
            if (resp_2.id > maxId) {
              maxId = resp_2.id;
            }
          });
        }
      });
      this.freeList.filter((resp) => {
        if (resp.id > maxId) {
          maxId = resp.id;
        }
      });
      return maxId + 1;
    },
  },
  methods: {
    filtering(array) {
      return array.filter((resp) =>
        resp.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    changeCategory(item) {
      this.$refs.changeCategory.setForm({ ...item });
      this.dialog_category = true;
    },
    changeElement(item, cat_id) {
      this.$refs.changeElement.setForm({ ...item }, cat_id);
      this.dialog_element = true;
    },
    rmCategory(deepRm) {
      let index = this.rmIndex;
      console.log(!deepRm, this.rmData.elements);
      if (!deepRm) {
        this.freeList = this.freeList.concat(this.rmData.elements);
      }
      this.catList.splice(index, 1);
      this.rmDialog = false;
    },
    appendCategory(val) {
      if (!val.id) {
        this.catList.push({ ...val, id: this.nextCatId });
      } else {
        this.catList.filter((resp) => {
          if (resp.id === val.id) {
            resp.name = val.name;
            resp.description = val.description;
          }
        });
      }
      this.dialog_category = false;
    },
    appendElement(cat_id, val) {
      if (cat_id) {
        this.catList.filter((resp) => {
          if (resp.id === cat_id) {
            if (val.id) {
              resp.elements.filter((el) => {
                if (el.id === val.id) {
                  el.name = val.name;
                  el.description = val.description;
                }
              });
            } else {
              resp.elements.push({ ...val, id: this.nextElId });
            }
          }
        });
      } else {
        if (val.id) {
          this.freeList.filter((resp) => {
            if (resp.id === val.id) {
              resp.name = val.name;
              resp.description = val.description;
            }
          });
        } else {
          this.freeList.push({ ...val, id: this.nextElId });
        }
      }
      this.dialog_element = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.docs-page {
  padding: 25px;
  .docs-header {
    display: flex;
    justify-content: space-between;
  }
}
.rotate180 {
  transform: rotate(180deg);
}
.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  i {
    margin-right: 1rem;
    color: #8e9cbb;
    font-weight: bold;
    cursor: pointer;
  }
  .delete {
    color: #f56c6c;
  }
}
.bordered {
  border: 0.5px solid #bfc5d2;
}
.mw-1000 {
  max-width: 1000px;
}
.title {
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  background-color: rgba($color: #000000, $alpha: 0.01);
}
.description {
  color: #8e9cbb;
  font-size: 14px;
  margin-left: 1rem;
}
.item {
  padding: 0.5rem 1rem;
}
.handle,
.handle-parent {
  height: 15px;
  margin-left: auto;
  cursor: pointer;
  img {
    height: 16px;
  }
}
.extra-info {
  margin-top: 2rem;
  .el-checkbox {
    margin-bottom: 0.5rem;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>