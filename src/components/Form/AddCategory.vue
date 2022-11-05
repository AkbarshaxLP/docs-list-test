<template>
  <div>
    <el-dialog
      :title="`${form.id ? 'Изменить' : 'Добавить'} Категорию`"
      :visible.sync="show"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
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
  props: ["show"],
  data() {
    return {
      form: {
        name: "",
        collapse: true,
        description: "",
        elements: [],
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
          this.$emit("append", this.form);
        }
      });
    },
    setForm(val) {
      this.form = val;
    },
    clearForm() {
      this.form = {
        name: "",
        collapse: false,
        description: "",
        elements: [],
      };
    },
  },
};
</script>