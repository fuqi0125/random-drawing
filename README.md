# 🎉 随机抽学号程序

一个趣味满满的随机抽学号工具，**开箱即用**，带有动画效果、公平模式、免抽管理等多种功能，适用于课堂互动、活动抽奖等场景。✨

---

## 功能亮点 🌟

1. **随机抽取学号**：
   - 输入起始学号和结束学号范围，随机生成一个幸运学号。

2. **抽号动画**：
   - 数字滚动，逐渐减速，增强现场氛围和趣味性，比起单纯的随机数动画节目效果更足!

3. **公平模式**：
   - 开启后，已抽中的学号不会再次被抽中，避免重复，运气再差也不怕啦!

4. **免抽学号管理**：
   - 动态显示已免抽学号列表，并支持一键重置～

5. **设置自动保存**：
   - 这个简单的小网页居然支持学号范围和公平模式开关状态自动保存，重新打开页面无需重复设置，公平模式的免抽数据一整天的课都可以用！

6. **简洁易用的界面**：
   - 玻璃质感设计，应该还算比较美观吧～用户体验好！

---

## 使用方法 🛠️

1. 打开网页，输入 **开始学号** 和 **结束学号**。
2. 点击 **“走你”** 按钮，随机抽取一个学号。
3. （可选）开启 **公平模式**，避免重复抽取。
4. 点击问号图标查看免抽规则及当前免抽学号列表。
5. 使用规则框内的 **“重新来过”** 按钮，清空免抽学号列表和设置。

---

## 技术细节 ⚙️

- **前端技术栈**：
  - HTML
  - CSS
  - JavaScript

- **功能实现**：
  - 动画基于 `setTimeout`，结合非线性减速公式实现逐步减速效果。
  - 公平模式采用 `Set` 数据结构管理免抽学号。
  - 使用 `localStorage` 实现设置和免抽学号的自动保存与加载。

---

大家把此项目放在自己的服务器上的话如果可以标注我的github项目主页  ，我会感激万分 **❤️** ，谢谢！
