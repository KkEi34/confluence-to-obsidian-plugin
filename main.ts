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
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'import-space',
			name: 'Import Confluence space',
			callback: () => {
				this.importConfluenceSpace();
			}
		});

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		//TODO:
		// This adds a settings tab so the user can configure various aspects of the plugin
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
			console.log(spacePath);
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
		// contentEl.createEl('input', {
		// 	type: 'file',
		// 	text: 'of'
		// });
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
