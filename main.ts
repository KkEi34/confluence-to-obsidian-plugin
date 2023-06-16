import { App, Editor, FileSystemAdapter, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { Bootstrap } from 'confluence-to-markdown/src/Bootstrap';

interface CTOPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CTOPluginSettings = {
	mySetting: 'default'
}

export default class CTOPlugin extends Plugin {
	settings: CTOPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: 'import-space',
			name: 'Import Confluence space',
			callback: () => {
				this.importConfluenceSpace();
			}
		});

		//TODO:
		//this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	importConfluenceSpace() {
		new ImportSpaceModal(this.app, (spacePath) => {
			const bootstrap = new Bootstrap();
			const vaultPath = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
			
			bootstrap.run(spacePath, vaultPath);
			new Notice("Import finished.");
		}).open();
	}
}

class ImportSpaceModal extends Modal {
	spacePath: string;
	onSubmit: (spacePath: string) => void;

	constructor(app: App, onSubmit: (spacePath: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Import Confluence space" });
		new Setting(contentEl)
			.setName("Space directory:")
			.addText((text) =>
				text.onChange((value) => {
					this.spacePath = value
				}));

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Import")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(this.spacePath);
					}));
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

//TODO:
// class CTOSettingTab extends PluginSettingTab {
// 	plugin: CTOPlugin;

// 	constructor(app: App, plugin: CTOPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const { containerEl } = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', { text: 'Settings.' });

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
