import { Plugin, App, Setting, PluginSettingTab } from "obsidian";

interface ClickToCopySettings {
	enableLivePreview: boolean;
	livePreviewTrigger: "click" | "dblclick";
	showBubble: boolean;
	bubbleDuration: number;
	bubblePosition: "top" | "bottom" | "left" | "right";
	bubbleBgColor: string;
	bubbleTextColor: string;
	feedbackDuration: number;
	language: "en" | "zh";
}

const DEFAULT_SETTINGS: ClickToCopySettings = {
	enableLivePreview: true,
	livePreviewTrigger: "dblclick",
	showBubble: true,
	bubbleDuration: 1500,
	bubblePosition: "top",
	bubbleBgColor: "linear-gradient(145deg, #2ecc71, #27ae60)",
	bubbleTextColor: "white",
	feedbackDuration: 1500,
	language: "en",
};

// 多语言包
const i18n = {
	en: {
		copied: (text: string) => `Copied: ${text}`,
		copyFailed: "Copy failed!",
		settingsTitle: "Click to Copy Settings",
		language: "Language",
		languageDesc: "Select display language",
		enableLivePreview: "Enable Live Preview",
		enableLivePreviewDesc: "Toggle copying in editing mode",
		livePreviewTrigger: "Live Preview Trigger",
		livePreviewTriggerDesc: "How to trigger copy in editing mode",
		showBubble: "Show Bubble Notification",
		showBubbleDesc: "Toggle the bubble notification when copying",
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
	},
	zh: {
		copied: (text: string) => `已复制: ${text}`,
		copyFailed: "复制失败!",
		settingsTitle: "单击复制设置",
		language: "语言",
		languageDesc: "选择显示语言",
		enableLivePreview: "启用实时预览复制",
		enableLivePreviewDesc: "开启或关闭编辑模式下的复制功能",
		livePreviewTrigger: "实时预览触发方式",
		livePreviewTriggerDesc: "在编辑模式下如何触发复制",
		showBubble: "显示气泡提示",
		showBubbleDesc: "复制时是否显示气泡提示",
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
	},
};

export default class ClickToCopyPlugin extends Plugin {
	settings: ClickToCopySettings;
	private clickTimeout: number | null = null;

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

		console.log("Click to Copy plugin loaded successfully");
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
					this.showBubble(
						codeElement,
						i18n[lang].copied(codeContent)
					);
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
		// 移除现有的气泡
		const existingBubble = document.querySelector(".click-to-copy-bubble");
		if (existingBubble) existingBubble.remove();

		const bubbleEl = document.createElement("div");
		bubbleEl.textContent = message;
		bubbleEl.className = "click-to-copy-bubble";

		// 应用用户自定义样式
		bubbleEl.style.background = this.settings.bubbleBgColor;
		bubbleEl.style.color = this.settings.bubbleTextColor;

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

	constructor(app: App, plugin: ClickToCopyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const lang = this.plugin.settings.language;
		const t = i18n[lang];

		containerEl.createEl("h2", { text: t.settingsTitle });

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

		// 气泡背景色
		new Setting(containerEl)
			.setName(t.bubbleBgColor)
			.setDesc(t.bubbleBgColorDesc)
			.addText((text) =>
				text
					.setPlaceholder("e.g., #2ecc71 or linear-gradient(...)")
					.setValue(this.plugin.settings.bubbleBgColor)
					.onChange(async (value) => {
						this.plugin.settings.bubbleBgColor = value;
						await this.plugin.saveSettings();
					})
			);

		// 气泡文字颜色
		new Setting(containerEl)
			.setName(t.bubbleTextColor)
			.setDesc(t.bubbleTextColorDesc)
			.addText((text) =>
				text
					.setPlaceholder("e.g., white or #ffffff")
					.setValue(this.plugin.settings.bubbleTextColor)
					.onChange(async (value) => {
						this.plugin.settings.bubbleTextColor = value;
						await this.plugin.saveSettings();
					})
			);

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
