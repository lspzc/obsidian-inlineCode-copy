// 多语言包定义
interface I18nContent {
	copied: (text: string) => string;
	copySuccess: string;
	copyFailed: string;
	settingsTitle: string;
	language: string;
	languageDesc: string;
	enableLivePreview: string;
	enableLivePreviewDesc: string;
	livePreviewTrigger: string;
	livePreviewTriggerDesc: string;
	showBubble: string;
	showBubbleDesc: string;
	showBubbleText: string;
	showBubbleTextDesc: string;
	bubblePosition: string;
	bubblePositionDesc: string;
	bubbleBgColor: string;
	bubbleBgColorDesc: string;
	bubbleTextColor: string;
	bubbleTextColorDesc: string;
	bubbleDuration: string;
	bubbleDurationDesc: string;
	feedbackDuration: string;
	feedbackDurationDesc: string;
	singleClick: string;
	doubleClick: string;
	top: string;
	bottom: string;
	left: string;
	right: string;
	bubbleTheme: string;
	bubbleThemeDesc: string;
	addCustomTheme: string;
	addCustomThemeDesc: string;
	addThemeButton: string;
	deleteThemeButton: string;
	customThemesTitle: string;
	Precautions: string;
	Precautions1: string;
	Precautions2: string;
	Precautions3: string;
	Precautions4: string;
}

export interface I18n {
	en: I18nContent;
	zh: I18nContent;
}

// 多语言包
export const i18n: I18n = {
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
	},
};
