import "../../shared/style.css";
import { sharedFunction } from "../../shared/utils";
import { Tabs } from "./tabs";

sharedFunction(); // 這是共享的程式碼。

const language = document.documentElement.lang;
if (language === "zh") {
  console.log("这是中文页面");
} else if (language === "en") {
  console.log("This is the English page");
}

window.onload = function () {
  new Tabs();
};