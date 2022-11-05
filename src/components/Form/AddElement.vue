<template>
  <div>
    <el-dialog
      :title="`${form.id ? 'Изменить' : 'Добавить'} Элемент`"
      :visible.sync="show"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item
          v-if="!form.id"
          label="Категория"
          :label-width="formLabelWidth"
        >
          <el-select
            clearable
            v-model="cat_id"
            placeholder="Выберите категорию"
            class="w-full"
          >
            <el-option
              :key="item.id"
              v-for="item in catList"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="name"
          label="Название"
          :label-width="formLabelWidth"
        >
          <el-input
            @keyup.enter.native="save"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Описание" :label-width="formLabelWidth">
          <el-input
            @keyup.enter.native="save"
            v-model="form.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">Закрыть</el-button>
        <el-button type="primary" @click="save">Сохранить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["show", "catList"],
  data() {
    return {
      cat_id: null,
      form: {
        name: "",
        description: "",
      },
      formLabelWidth: "120px",
      rules: {
        name: [
          {
            required: true,
            message: "Пожалуйста введите названию",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    show: function (val) {
      this.$emit("toggle", val);
      if (!val) {
        this.clearForm();
      }
    },
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("append", this.cat_id, this.form);
        }
      });
    },
    setForm(val, cat_id) {
      this.form = val;
      this.cat_id = cat_id;
    },
    clearForm() {
      this.cat_id = null;
      this.form = {
        name: "",
        description: "",
      };
    },
  },
};
</script>