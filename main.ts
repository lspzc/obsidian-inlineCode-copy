import {
	Plugin,
	App,
	Setting,
	PluginSettingTab,
	TextComponent,
	Notice,
} from "obsidian";

interface BubbleTheme {
	name: string;
	bgColor: string;
	textColor: string;
}

interface ClickToCopySettings {
	enableLivePreview: boolean;
	livePreviewTrigger: "click" | "dblclick";
	showBubble: boolean;
	showBubbleText: boolean;
	bubbleDuration: number;
	bubblePosition: "top" | "bottom" | "left" | "right";
	bubbleTheme: string; // 存储当前选择的主题名称
	customThemes: BubbleTheme[]; // 存储用户自定义主题
	feedbackDuration: number;
	language: "en" | "zh";
}

const DEFAULT_SETTINGS: ClickToCopySettings = {
	enableLivePreview: true,
	livePreviewTrigger: "dblclick",
	showBubble: true,
	showBubbleText: true,
	bubbleDuration: 1500,
	bubblePosition: "top",
	bubbleTheme: "default",
	customThemes: [],
	feedbackDuration: 1500,
	language: "en",
};

// 预设主题
const PRESET_THEMES: BubbleTheme[] = [
	{
		name: "darkDefault",
		bgColor: "#292433",
		textColor: "#a68af1",
	},
	{
		name: "lightDefault",
		bgColor: "#f3eefd",
		textColor: "#9166ed",
	},
	{
		name: "深邃夜空 | midnight-sky",
		bgColor:
			"linear-gradient(90deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
		textColor: "#ffffff",
	},
	{
		name: "极光紫雾 | aurora-purple",
		bgColor: "linear-gradient(to right, #654EA3 0%, #EAAFC8 100%)",
		textColor: "#ffffff",
	},
	{
		name: "落日熔金 | sunset-gold",
		bgColor: "linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)",
		textColor: "#ffffff",
	},
	{
		name: "冰川之境 | glacier-blue",
		bgColor: "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)",
		textColor: "#ffffff",
	},
	{
		name: "莫兰迪灰粉 | muted-pink",
		bgColor: "linear-gradient(to bottom, #E6DADA 0%, #274046 100%)",
		textColor: "#333333",
	},
	{
		name: "黑金奢华 | black-gold",
		bgColor:
			"linear-gradient(90deg, #000000 0%, #434343 50%, #000000 100%)",
		textColor: "#FFD700",
	},
	{
		name: "翡翠绿 | emerald-green",
		bgColor: "linear-gradient(120deg, #11998E 0%, #38EF7D 100%)",
		textColor: "#ffffff",
	},
];

// 多语言包
const i18n = {
	en: {
		copied: (text: string) => `Copied: ${text}`,
		copySuccess: "Copy Success!",
		copyFailed: "Copy Failed!",
		settingsTitle: "Inline Code Copy Settings",
		language: "Language",
		languageDesc: "Select display language",
		enableLivePreview: "Enable Live Preview",
		enableLivePreviewDesc: "Toggle copying in editing mode",
		livePreviewTrigger: "Live Preview Trigger",
		livePreviewTriggerDesc: "How to trigger copy in editing mode",
		showBubble: "Show Bubble Notification",
		showBubbleDesc: "Toggle the bubble notification when copying",
		showBubbleText: "Whether to display text",
		showBubbleTextDesc:
			"Whether or not the copied text is displayed in the bubble tip",
		bubblePosition: "Bubble Position",
		bubblePositionDesc: "Where to show the bubble notification",
		bubbleBgColor: "Bubble Background",
		bubbleBgColorDesc: "Background color/style for the bubble",
		bubbleTextColor: "Bubble Text Color",
		bubbleTextColorDesc: "Text color for the bubble",
		bubbleDuration: "Bubble Duration (ms)",
		bubbleDurationDesc: "How long the bubble stays visible",
		feedbackDuration: "Feedback Duration (ms)",
		feedbackDurationDesc: "How long the highlight effect lasts",
		singleClick: "Single Click",
		doubleClick: "Double Click",
		top: "Top",
		bottom: "Bottom",
		left: "Left",
		right: "Right",
		bubbleTheme: "Bubble Theme",
		bubbleThemeDesc: "Select a predefined theme for the bubble",
		addCustomTheme: "Add Custom Theme",
		addCustomThemeDesc:
			"Input Format: Theme Name | Background Color | Text Color",
		addThemeButton: "Add Theme",
		deleteThemeButton: "Delete",
		customThemesTitle: "Your Custom Themes",
		Precautions: "Plug-in Notes",
		Precautions1:
			"If you find that the changes do not work, restart Obsidian",
		Precautions2:
			"Custom bubble styles with background support for gradient colors of the form linear-gradient().",
		Precautions3: "Plugin Documentation Address: ",
		Precautions4: "If you encounter problems, you can",
		bubbleThemeUpdate: "Bubbles theme update to : ",
	},
	zh: {
		copied: (text: string) => `已复制: ${text}`,
		copySuccess: "复制成功！",
		copyFailed: "复制失败！",
		settingsTitle: "行内代码复制插件设置",
		language: "语言",
		languageDesc: "选择显示语言",
		enableLivePreview: "启用实时预览复制",
		enableLivePreviewDesc: "开启或关闭编辑模式下的复制功能",
		livePreviewTrigger: "实时预览触发方式",
		livePreviewTriggerDesc: "在编辑模式下如何触发复制",
		showBubble: "显示气泡提示",
		showBubbleDesc: "复制时是否显示气泡提示",
		showBubbleText: "是否显示文本",
		showBubbleTextDesc: "气泡提示中是否显示被复制的文本",
		bubblePosition: "气泡位置",
		bubblePositionDesc: "气泡提示显示的位置",
		bubbleBgColor: "气泡背景",
		bubbleBgColorDesc: "气泡的背景颜色或样式（支持CSS）",
		bubbleTextColor: "气泡文字颜色",
		bubbleTextColorDesc: "气泡内文字的颜色",
		bubbleDuration: "气泡显示时间(毫秒)",
		bubbleDurationDesc: "气泡提示持续显示的时间",
		feedbackDuration: "反馈效果时间(毫秒)",
		feedbackDurationDesc: "复制成功时高亮效果的持续时间",
		singleClick: "单击",
		doubleClick: "双击",
		top: "上方",
		bottom: "下方",
		left: "左侧",
		right: "右侧",
		bubbleTheme: "气泡主题",
		bubbleThemeDesc: "选择预设的气泡样式主题",
		addCustomTheme: "添加自定义主题",
		addCustomThemeDesc: "输入格式：主题名称 | 背景颜色 | 文字颜色",
		addThemeButton: "添加主题",
		deleteThemeButton: "删除",
		customThemesTitle: "你的自定义主题",
		Precautions: "插件注意事项",
		Precautions1: "如果发现更改无效，请重新启动 Obsidian",
		Precautions2: "自定义气泡背景支持 linear-gradient() 形式渐变色",
		Precautions3: "插件文档地址：",
		Precautions4: "如果遇到问题，可以",
		bubbleThemeUpdate: "气泡主题已自动切换为: ",
	},
};

export default class ClickToCopyPlugin extends Plugin {
	settings: ClickToCopySettings;

	async onload() {
		await this.loadSettings();

		// 注册阅读模式单击事件
		this.registerDomEvent(document, "click", this.handleClick.bind(this));

		// 注册实时预览模式双击事件
		this.registerDomEvent(
			document,
			"dblclick",
			this.handleDoubleClick.bind(this)
		);

		// 添加设置选项卡
		this.addSettingTab(new ClickToCopySettingTab(this.app, this));

		// 初始化时检查主题
		const initialDarkMode = document.body.classList.contains("theme-dark");
		if (initialDarkMode) {
			this.settings.bubbleTheme = "darkDefault";
		} else {
			this.settings.bubbleTheme = "lightDefault";
		}
		await this.saveSettings();

		console.log("Click to Copy plugin loaded successfully");
		console.log(`初始化气泡主题为： ${this.settings.bubbleTheme} `);
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 只处理阅读模式
		if (target.closest(".markdown-reading-view")) {
			this.processCodeElement(target, "code");
		}
	}

	private handleDoubleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 检查是否启用实时预览模式复制
		if (!this.settings.enableLivePreview) return;

		// 检查是否是双击触发模式
		if (this.settings.livePreviewTrigger !== "dblclick") return;

		// 处理实时预览模式
		if (target.closest(".cm-content")) {
			this.processCodeElement(target, "span.cm-inline-code");
		}
	}

	private processCodeElement(target: HTMLElement, selector: string) {
		const codeElement = target.closest(selector);
		if (!codeElement) return;

		// 获取代码文本
		const rawText = codeElement.textContent || "";
		let codeContent = rawText;

		if (rawText.startsWith("`") && rawText.endsWith("`")) {
			codeContent = rawText.slice(1, -1);
		}

		// 复制到剪贴板
		navigator.clipboard
			.writeText(codeContent)
			.then(() => {
				// 添加视觉反馈
				codeElement.classList.add("copied");
				setTimeout(() => {
					codeElement.classList.remove("copied");
				}, this.settings.feedbackDuration);

				// 显示气泡提示
				if (this.settings.showBubble) {
					const lang = this.settings.language;
					const bubbleText = this.settings.showBubbleText
						? i18n[lang].copied(codeContent)
						: i18n[lang].copySuccess;

					this.showBubble(codeElement, bubbleText);
				}
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
				if (this.settings.showBubble) {
					const lang = this.settings.language;
					this.showBubble(codeElement, i18n[lang].copyFailed);
				}
			});
	}

	private showBubble(element: Element, message: string) {
		const lang = this.settings.language;
		// 移除现有的气泡
		const existingBubble = document.querySelector(".click-to-copy-bubble");
		if (existingBubble) existingBubble.remove();

		const bubbleEl = document.createElement("div");
		bubbleEl.textContent = message;
		bubbleEl.className = "click-to-copy-bubble";

		// 应用用户自定义样式
		// 查找当前选择的主题
		let currentTheme = PRESET_THEMES.find(
			(t) => t.name === this.settings.bubbleTheme
		);
		if (!currentTheme) {
			currentTheme = this.settings.customThemes.find(
				(t) => t.name === this.settings.bubbleTheme
			);
		}

		// TODO 这里有问题
		// 如果没找到，使用默认主题
		if (!currentTheme) {
			currentTheme = PRESET_THEMES[0];
		}

		// 监听主题变化,根据主题变化应用气泡主题
		this.app.workspace.on("css-change", async () => {
			// 判断当前是否是暗色主题
			const isDarkMode = document.body.classList.contains("theme-dark");
			currentTheme = isDarkMode ? PRESET_THEMES[0] : PRESET_THEMES[1];
			// 应用新主题样式
			bubbleEl.style.background = currentTheme.bgColor;
			bubbleEl.style.color = currentTheme.textColor;
			// 同时更新插件设置
			this.settings.bubbleTheme = isDarkMode
				? "darkDefault"
				: "lightDefault";
			await this.saveSettings();

			// 通知用户设置已更新，这里需要obsidian重启才能实现 i8n
			new Notice(
				i18n[lang].bubbleThemeUpdate + `${this.settings.bubbleTheme}`
			);
		});
		// 初始设置（确保第一次加载时也应用正确的主题）
		const initialDarkMode = document.body.classList.contains("theme-dark");
		currentTheme = initialDarkMode ? PRESET_THEMES[0] : PRESET_THEMES[1];
		bubbleEl.style.background = currentTheme.bgColor;
		bubbleEl.style.color = currentTheme.textColor;

		// 应用样式
		// bubbleEl.style.background = currentTheme.bgColor;
		// bubbleEl.style.color = currentTheme.textColor;

		document.body.appendChild(bubbleEl);

		// 计算气泡位置
		const rect = element.getBoundingClientRect();
		const bubbleRect = bubbleEl.getBoundingClientRect();
		const scrollY = window.scrollY || window.pageYOffset;

		let top = 0;
		let left = 0;

		switch (this.settings.bubblePosition) {
			case "top":
				top = rect.top + scrollY - bubbleRect.height - 10; // 减少距离到10px
				left = rect.left + rect.width / 2 - bubbleRect.width / 2;
				break;
			case "bottom":
				top = rect.bottom + scrollY + 10; // 减少距离到10px
				left = rect.left + rect.width / 2 - bubbleRect.width / 2;
				break;
			case "left":
				top =
					rect.top +
					scrollY +
					rect.height / 2 -
					bubbleRect.height / 2;
				left = rect.left - bubbleRect.width - 10; // 减少距离到10px
				break;
			case "right":
				top =
					rect.top +
					scrollY +
					rect.height / 2 -
					bubbleRect.height / 2;
				left = rect.right + 10; // 减少距离到10px
				break;
		}

		// 确保气泡在视口内
		if (top < scrollY) top = scrollY + 10;
		if (top + bubbleRect.height > scrollY + window.innerHeight) {
			top = scrollY + window.innerHeight - bubbleRect.height - 10;
		}
		if (left < 10) left = 10;
		if (left + bubbleRect.width > window.innerWidth - 10) {
			left = window.innerWidth - bubbleRect.width - 10;
		}

		bubbleEl.style.top = `${top}px`;
		bubbleEl.style.left = `${left}px`;

		// 自动消失
		setTimeout(() => {
			bubbleEl.classList.add("fade-out");
			setTimeout(() => bubbleEl.remove(), 300);
		}, this.settings.bubbleDuration);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ClickToCopySettingTab extends PluginSettingTab {
	plugin: ClickToCopyPlugin;
	combinedInput: TextComponent;
	hemeNameInput: TextComponent;
	bgColorInput: TextComponent;
	textColorInput: TextComponent;

	constructor(app: App, plugin: ClickToCopyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const lang = this.plugin.settings.language;
		const t = i18n[lang];

		containerEl.createEl("h3", { text: t.settingsTitle });

		// === 顶部提示 ===
		const tip = containerEl.createEl("div", { cls: "tip" });
		tip.createEl("div", {
			text: t.Precautions,
			cls: "tip_title",
		});

		// 创建提示容器
		const smallTip = tip.createEl("small", { cls: "tip_txt" });

		smallTip.append("1. " + t.Precautions1);
		smallTip.append("\n2. " + t.Precautions2);
		// 点击查看文档
		smallTip.append("\n3. " + t.Precautions3);
		smallTip.createEl("a", {
			text: "github",
			href: "https://github.com/lspzc/obsidian-inlineCode-copy",
			cls: "inline-code-copy-smallTip-link",
		});
		smallTip.append(" or ");
		smallTip.createEl("a", {
			text: "gitee",
			href: "https://gitee.com/lspzc/obsidain-share",
			cls: "inline-code-copy-smallTip-link",
		});
		// 提交 Issues
		smallTip.append("\n4. " + t.Precautions4);
		smallTip.createEl("a", {
			text: " Submit Issues",
			href: "https://github.com/lspzc/obsidian-inlineCode-copy/issues",
			cls: "inline-code-copy-smallTip-link",
		});

		// 语言设置
		new Setting(containerEl)
			.setName(t.language)
			.setDesc(t.languageDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("en", "English")
					.addOption("zh", "中文")
					.setValue(this.plugin.settings.language)
					.onChange(async (value: "en" | "zh") => {
						this.plugin.settings.language = value;
						await this.plugin.saveSettings();
						// 重新渲染设置界面以更新语言
						this.display();
					})
			);

		// 实时预览模式设置
		new Setting(containerEl)
			.setName(t.enableLivePreview)
			.setDesc(t.enableLivePreviewDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableLivePreview)
					.onChange(async (value) => {
						this.plugin.settings.enableLivePreview = value;
						await this.plugin.saveSettings();
					})
			);

		// 实时预览触发方式
		new Setting(containerEl)
			.setName(t.livePreviewTrigger)
			.setDesc(t.livePreviewTriggerDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("click", t.singleClick)
					.addOption("dblclick", t.doubleClick)
					.setValue(this.plugin.settings.livePreviewTrigger)
					.onChange(async (value: "click" | "dblclick") => {
						this.plugin.settings.livePreviewTrigger = value;
						await this.plugin.saveSettings();
					})
			);

		// 气泡提示开关
		new Setting(containerEl)
			.setName(t.showBubble)
			.setDesc(t.showBubbleDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showBubble)
					.onChange(async (value) => {
						this.plugin.settings.showBubble = value;
						await this.plugin.saveSettings();
					})
			);

		// 气泡提示是否显示复制文本
		new Setting(containerEl)
			.setName(t.showBubbleText)
			.setDesc(t.showBubbleTextDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showBubbleText)
					.onChange(async (value) => {
						this.plugin.settings.showBubbleText = value;
						await this.plugin.saveSettings();
					})
			);

		// 气泡位置
		new Setting(containerEl)
			.setName(t.bubblePosition)
			.setDesc(t.bubblePositionDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("top", t.top)
					.addOption("bottom", t.bottom)
					.addOption("left", t.left)
					.addOption("right", t.right)
					.setValue(this.plugin.settings.bubblePosition)
					.onChange(
						async (value: "top" | "bottom" | "left" | "right") => {
							this.plugin.settings.bubblePosition = value;
							await this.plugin.saveSettings();
						}
					)
			);

		// 在设置面板中添加气泡主题选择
		new Setting(containerEl)
			.setName(t.bubbleTheme)
			.setDesc(t.bubbleThemeDesc)
			.addDropdown((dropdown) => {
				// 添加预设主题
				PRESET_THEMES.forEach((theme) => {
					dropdown.addOption(theme.name, theme.name);
				});

				// 添加自定义主题
				this.plugin.settings.customThemes.forEach((theme) => {
					dropdown.addOption(theme.name, theme.name);
				});

				dropdown
					.setValue(this.plugin.settings.bubbleTheme)
					.onChange(async (value) => {
						this.plugin.settings.bubbleTheme = value;
						await this.plugin.saveSettings();
					});
			});

		// 添加自定义主题管理部分
		const customThemeContainer = containerEl.createDiv(
			"custom-theme-container"
		);

		// 添加新主题的表单
		// 自定义主题添加
		new Setting(customThemeContainer)
			.setName(t.addCustomTheme)
			.setDesc(t.addCustomThemeDesc)
			.addText((text) => {
				text.setPlaceholder("").setValue("");
				// 存储文本组件引用
				this.combinedInput = text;
			})
			.addButton((button) =>
				button.setButtonText(t.addThemeButton).onClick(async () => {
					const combinedInput = this.combinedInput.getValue();
					const [name, bgColor, textColor] = combinedInput.split(",");

					if (name && bgColor && textColor) {
						this.plugin.settings.customThemes.push({
							name,
							bgColor,
							textColor,
						});
						await this.plugin.saveSettings();
						this.display(); // 刷新设置面板

						// 清空输入框
						this.combinedInput.setValue("");
					}
				})
			);

		// 显示当前自定义主题列表
		this.plugin.settings.customThemes.forEach((theme) => {
			new Setting(customThemeContainer)
				.setName(theme.name)
				.addButton((button) =>
					button
						.setButtonText(t.deleteThemeButton)
						.onClick(async () => {
							this.plugin.settings.customThemes =
								this.plugin.settings.customThemes.filter(
									(t) => t.name !== theme.name
								);
							await this.plugin.saveSettings();
							this.display(); // 刷新设置面板
						})
				);
		});

		// 气泡显示时间设置
		new Setting(containerEl)
			.setName(t.bubbleDuration)
			.setDesc(t.bubbleDurationDesc)
			.addSlider((slider) => {
				slider
					.setLimits(500, 3000, 100)
					.setValue(this.plugin.settings.bubbleDuration)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.bubbleDuration = value;
						await this.plugin.saveSettings();
					});
			});

		// 视觉反馈时间设置
		new Setting(containerEl)
			.setName(t.feedbackDuration)
			.setDesc(t.feedbackDurationDesc)
			.addSlider((slider) => {
				slider
					.setLimits(500, 3000, 100)
					.setValue(this.plugin.settings.feedbackDuration)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.feedbackDuration = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
