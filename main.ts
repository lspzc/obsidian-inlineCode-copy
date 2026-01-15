import {
	Plugin,
	App,
	Setting,
	PluginSettingTab,
	TextComponent,
} from "obsidian";
import { i18n } from "./i18n";

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
		bgColor: "#242424",
		textColor: "#dadada",
	},
	{
		name: "lightDefault",
		bgColor: "#fafafa",
		textColor: "#22224c",
	},
	{
		name: "深邃夜空 | midnight-sky",
		bgColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
		textColor: "#ffffff",
	},
	{
		name: "极光紫雾 | aurora-purple",
		bgColor: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
		textColor: "#ffffff",
	},
	{
		name: "落日熔金 | sunset-gold",
		bgColor: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
		textColor: "#ffffff",
	},
	{
		name: "冰川之境 | glacier-blue",
		bgColor: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
		textColor: "#ffffff",
	},
	{
		name: "莫兰迪灰粉 | muted-pink",
		bgColor: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
		textColor: "#ffffff",
	},
	{
		name: "森林绿 | forest-green",
		bgColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
		textColor: "#ffffff",
	},
	{
		name: "琥珀橙 | amber-orange",
		bgColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
		textColor: "#ffffff",
	},
];

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

		// 注册实时预览模式单击事件（根据设置决定是否触发）
		this.registerDomEvent(
			document,
			"click",
			this.handleLivePreviewClick.bind(this)
		);

		// 添加设置选项卡
		this.addSettingTab(new ClickToCopySettingTab(this.app, this));

		// 只有当主题未设置时（第一次安装），才根据当前主题模式设置默认主题
		if (this.settings.bubbleTheme === DEFAULT_SETTINGS.bubbleTheme) {
			const initialDarkMode =
				document.body.classList.contains("theme-dark");
			this.settings.bubbleTheme = initialDarkMode
				? "darkDefault"
				: "lightDefault";
			await this.saveSettings();
		}

		console.log("Click to Copy plugin loaded successfully");
	}

	private handleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 检查是否是阅读模式下的代码元素点击
		if (
			target.matches(".markdown-reading-view code") ||
			target.closest(".markdown-reading-view code")
		) {
			this.processCodeElement(target, "code");
		}
	}

	private handleDoubleClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 检查是否启用实时预览模式复制
		if (!this.settings.enableLivePreview) return;

		// 检查是否是双击触发模式
		if (this.settings.livePreviewTrigger !== "dblclick") return;

		// 检查是否是实时预览模式下的行内代码元素点击
		if (
			target.matches(".cm-content span.cm-inline-code") ||
			target.closest(".cm-content span.cm-inline-code")
		) {
			this.processCodeElement(target, "span.cm-inline-code");
		}
	}

	private handleLivePreviewClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// 检查是否启用实时预览模式复制
		if (!this.settings.enableLivePreview) return;

		// 检查是否是单击触发模式
		if (this.settings.livePreviewTrigger !== "click") return;

		// 检查是否是实时预览模式下的行内代码元素点击
		if (
			target.matches(".cm-content span.cm-inline-code") ||
			target.closest(".cm-content span.cm-inline-code")
		) {
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

		// 复制到剪贴板（支持降级方案）
		const copyToClipboard = async (text: string): Promise<boolean> => {
			try {
				// 优先使用现代剪贴板API
				await navigator.clipboard.writeText(text);
				return true;
			} catch (err) {
				// 降级方案：使用传统的document.execCommand('copy')
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.opacity = "0";
				document.body.appendChild(textArea);
				textArea.select();

				try {
					const success = document.execCommand("copy");
					document.body.removeChild(textArea);
					return success;
				} catch (fallbackErr) {
					document.body.removeChild(textArea);
					console.error(
						"Clipboard API fallback failed:",
						fallbackErr
					);
					return false;
				}
			}
		};

		// 执行复制操作
		copyToClipboard(codeContent)
			.then((success) => {
				if (success) {
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
				} else {
					if (this.settings.showBubble) {
						const lang = this.settings.language;
						this.showBubble(codeElement, i18n[lang].copyFailed);
					}
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

	/**
	 * 获取当前选择的主题
	 */
	private getCurrentTheme(): BubbleTheme {
		// 查找当前选择的主题
		let currentTheme = PRESET_THEMES.find(
			(t) => t.name === this.settings.bubbleTheme
		);
		if (!currentTheme) {
			currentTheme = this.settings.customThemes.find(
				(t) => t.name === this.settings.bubbleTheme
			);
		}

		// 如果没找到，使用默认主题
		if (!currentTheme) {
			const isDarkMode = document.body.classList.contains("theme-dark");
			currentTheme = isDarkMode ? PRESET_THEMES[0] : PRESET_THEMES[1];
		}

		return currentTheme;
	}

	private showBubble(element: Element, message: string) {
		// 查找或创建气泡元素
		let bubbleEl = document.querySelector(
			".click-to-copy-bubble"
		) as HTMLDivElement;

		// 如果气泡不存在，则创建新气泡
		if (!bubbleEl) {
			bubbleEl = document.createElement("div");
			bubbleEl.className = "click-to-copy-bubble";
			document.body.appendChild(bubbleEl);
		}

		// 重置气泡状态
		bubbleEl.classList.remove("fade-out");
		bubbleEl.style.display = "block";

		// 设置气泡内容
		bubbleEl.textContent = message;

		// 获取当前主题
		const currentTheme = this.getCurrentTheme();

		// 应用样式
		bubbleEl.style.background = currentTheme.bgColor;
		bubbleEl.style.color = currentTheme.textColor;

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

		// 自动消失（隐藏而非删除，以便下次复用）
		setTimeout(() => {
			bubbleEl.classList.add("fade-out");
			setTimeout(() => {
				bubbleEl.style.display = "none";
			}, 300);
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

		// 顶部提示
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
					const [name, bgColor, textColor] = combinedInput
						.split("|")
						.map((item) => item.trim())
						.filter(Boolean);

					// 验证输入格式
					if (combinedInput.split("|").length < 3) {
						console.warn(
							"主题输入格式不正确，请使用 '名称 | 背景色 | 文字颜色' 格式"
						);
						return;
					}

					// 验证主题名称
					if (!name) {
						console.warn("主题名称不能为空");
						return;
					}

					// 检查主题名称是否已存在（预设主题和自定义主题）
					const isNameExists =
						PRESET_THEMES.some((theme) => theme.name === name) ||
						this.plugin.settings.customThemes.some(
							(theme) => theme.name === name
						);

					if (isNameExists) {
						console.warn("主题名称已存在，请使用不同的名称");
						return;
					}

					// 验证颜色值（简单检查）
					if (!bgColor || !textColor) {
						console.warn("背景色和文字颜色不能为空");
						return;
					}

					// 添加新主题
					this.plugin.settings.customThemes.push({
						name,
						bgColor,
						textColor,
					});
					await this.plugin.saveSettings();
					this.display(); // 刷新设置面板

					// 清空输入框
					this.combinedInput.setValue("");
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
