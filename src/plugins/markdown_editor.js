import VMdEditor from "@kangc/v-md-editor";
// import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
// import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/emoji/emoji.css";
import createEmojiPlugin from "@kangc/v-md-editor/lib/plugins/emoji/index";
// import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import python from "highlight.js/lib/languages/python";
import Vue from "vue";

VMdEditor.use(githubTheme, {
  extend(md, hljs) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
    // 注册语言包
    hljs.registerLanguage("python", python);
  }
});
// VMdEditor.use(createLineNumbertPlugin());
// VMdEditor.use(createCopyCodePlugin());
VMdEditor.use(createTodoListPlugin());
VMdEditor.use(createEmojiPlugin());

Vue.use(VMdEditor);

export default VMdEditor;
