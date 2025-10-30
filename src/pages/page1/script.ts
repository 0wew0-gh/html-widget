import "../../shared/style.css";
import { sharedFunction } from "../../shared/utils";

sharedFunction(); // 這是共享的程式碼。

const 環境語言 = document.documentElement.lang;
if (環境語言 === "zh") {
  console.log("这是中文页面");
} else if (環境語言 === "en") {
  console.log("This is the English page");
}
