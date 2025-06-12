<p align="center">
  <img alt="GitHub Repo Stars" src="https://img.shields.io/github/stars/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Repo Forks" src="https://img.shields.io/github/forks/lspzc/obsidian-inlineCode-copy">
</p>

<p align="center">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/lspzc/obsidian-inlineCode-copy/total">
  <img alt="GitHub Repo License" src="https://img.shields.io/github/license/lspzc/obsidian-inlineCode-copy">
  <img alt="GitHub Repo Issues" src="https://img.shields.io/github/issues/lspzc/obsidian-inlineCode-copy">
</p>

<p align="center">
  <a href="https://github.com/lspzc/obsidian-inlineCode-copy/releases">Download</a> |
  中文 |
  <a href="./README_EN.md">English</a>
</p>

# 插件：Inline Code Copy 说明文档

## 1 是什么

一个 obsidian 插件

插件功能：单击（阅读视图）或双击（实时预览）复制行内代码

## 2 为什么

行内代码语法

```md
` `
```

很多情况下都需要用到行内代码，比如一些类名，一些很小的代码片段，一些特殊的与 md 语法冲突的文字，甚至是一些后期想要复制的文字，**但 obsidian 很奇怪，有代码块复制，却没有行内代码复制**。

## 3 怎么用

### 3.1 插件环境

插件开发测试环境：window11系统，obsidian 版本 1.8.10

由于本人没有 mac 设备，所以未作测试，**建议先找一个测试库试一试**

移动端未测试

### 3.2 下载插件

目前插件尚未上架插件市场，目前需要自行下载插件

GitHub 地址：[lspzc/obsidian-inlineCode-copy](https://github.com/lspzc/obsidian-inlineCode-copy)

Gitee 地址：[lspzc/obsidain分享](https://gitee.com/lspzc/obsidain-share)

### 3.3 安装插件

这里不过多介绍，可以参考：[PKMer_Obsidian 社区插件的安装](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6/obsidian%E7%A4%BE%E5%8C%BA%E6%8F%92%E4%BB%B6%E7%9A%84%E5%AE%89%E8%A3%85/#%E6%89%8B%E5%8A%A8%E5%AE%89%E8%A3%85) 中的手动安装

### 3.4 插件设置

### 3.5 一键切换中英文

这里我要吐槽了，对于我一个英语不太好的人来说，一些国外大佬开发的复杂插件，看的我是脑壳痛，于是我决定，直接在文档内一键切换中英文🎉

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img.webp)

## 4 是否启用实时预览复制

默认开启，这个选项是提供给只喜欢在阅览模式点击复制的用户

### 4.1 实时预览触发方式

默认是双击触发，单击要留给对行内代码进行编辑时使用，这里是准备后续让用户自定义触发复制的快捷键

### 4.2 显示气泡提示

默认显示，我精心制作了好多气泡样式，这你不得试试？

你还可以自定义气泡样式，再给气泡样式起一个狂拽天的名字，哈哈

当然，不排除有些用户不喜欢气泡弹框，也提供了关闭选项，但是关闭后，实时预览模式便没有复制成功提示了，阅览模式会有被复制文字背景的变化

### 4.3 气泡提示的位置

默认在上方，你可以选择你喜欢的位置

### 4.4 气泡主题与自定义主题

预设了很多样式，大家可以挨个试一试

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-1.webp)

不满意？没关系，使用自定义主题，你的主题你做主

这里展示极光紫雾与黑金奢华的效果

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-2.webp)

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-3.webp)

### 4.5 气泡显示时间与反馈效果时间

持续时间看大家喜好

反馈效果时间：只在阅览模式下有（因为编辑模式下双击 obsidian 会有选中的样式）
