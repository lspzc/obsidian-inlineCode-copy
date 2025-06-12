<p align="center">
  <img alt="GitHub Repo Stars" src="https://img.shields.io/github/stars/lspzc/obsidian-diary-merger">
  <img alt="GitHub Repo Forks" src="https://img.shields.io/github/forks/lspzc/obsidian-diary-merger">
</p>

<p align="center">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/lspzc/obsidian-diary-merger">
  <img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/lspzc/obsidian-diary-merger/total">
  <img alt="GitHub Repo License" src="https://img.shields.io/github/license/lspzc/obsidian-diary-merger">
  <img alt="GitHub Repo Issues" src="https://img.shields.io/github/issues/lspzc/obsidian-diary-merger">
</p>

<p align="center">
  <a href="https://github.com/lspzc/obsidian-diary-merger/releases/download/v-1.1.0-bata/obsidian-diary-merger-v-1.1.0-bata.zip">Download</a> |
  English |
  <a href="./README_CN.md">中文</a>
</p>

# Plug-in: Inline Code Copy Documentation

## 1 What is it?

An obsidian plugin

What the plugin does: Copy in-line code with a single click (read view) or double click (live preview).

## 2 Why

Inline code syntax

```md 
`` 
```

There are a lot of situations where you need to use inline code, such as some class names, some very small code snippets, some special text that conflicts with md syntax, or even some text that you want to copy at a later time, **but obsidian strangely has code block copying, but not inline code copying**.

## 3 How it works

## 3.1 Plugin environment

Plugin development test environment: window11 system, obsidian version 1.8.10

Since I don't have a mac device, I didn't test it. **I suggest you find a test library and try it first**.

Mobile not tested

### 3.2 Downloading Plugins

Currently, the plugin is not yet on the plugin market, so you need to download the plugin by yourself.

GitHub address: [lspzc/obsidian-inlineCode-copy](https://github.com/lspzc/obsidian-inlineCode-copy)

Gitee address: [lspzc/obsidian-share](https://gitee.com/lspzc/obsidain-share)

### 3.3 Installing Plugins

Without going into too much detail here

## 3.4 Plugin Settings

### 3.5 Switch between Chinese and English with one click

Here I want to complain, for my English is not very good people, some foreign big brother developed complex plug-ins, see my brain is a pain, so I decided, directly in the document a key to switch between English and Chinese 🎉

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img.webp)

## 4 Whether to enable live preview copying

Enabled by default, this option is for users who only like to click copy in view mode.

## 4.1 Live preview trigger mode

The default is double-click trigger, single-click is reserved for in-line code editing, this is to allow users to customize the shortcut key to trigger copying.

### 4.2 Show bubble alerts

By default, I've crafted a number of bubble styles, which you can't miss.

You can also customize the bubble style, and then give the bubble style a wild and crazy name, haha!

Of course, we can't rule out that some users don't like the bubble pop-up box, we also provide the option to turn it off, but after turning it off, the real-time preview mode won't have the copying success tip, and the reading mode will have the background of the copied text change.

### 4.3 Position of bubble tips

Default is at the top, you can choose your favorite position

### 4.4 Bubble themes and customized themes

Preset a lot of styles, you can try one by one

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-1.webp)

Not satisfied? It's okay, use a custom theme, your theme is your call!

Aurora Purple Mist and Black Gold Luxury are shown here!

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-2.webp)

![](./attachments/20250612_插件：Inline%20Code%20Copy%20说明文档-img-3.webp)

### 4.5 Bubble duration and feedback effect duration

Duration is up to your preference

Feedback effect time: only in view mode (because double clicking on obsidian in edit mode gives you the selected style)
