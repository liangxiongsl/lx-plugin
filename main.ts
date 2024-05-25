import {App, Modal, Notice, Plugin, PluginSettingTab, Setting, Menu, ItemView} from 'obsidian';
import {WorkspaceLeaf,View} from 'obsidian'
import {createApp} from 'vue'
import sfc from './sfc.vue'

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	example_setting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	example_setting: 'default'
}

export default class MyPlugin extends Plugin {

	async onload() {
		this.settingTab = new MyPluginSettingTab(this.app, this)
		await this.load_settings()

		this.init_menu()

		this.init_modal()

		let rb = this.addRibbonIcon('bar-chart-horizontal-big', 'example ribbon icon', (e)=> {
			new Notice('example ribbon icon')
		})
		let sb = this.addStatusBarItem()
		// sb.createEl('button', '', (el)=>{
		// 	el.innerHTML = 'modal'
		// 	el.onclick=()=>this.modal.open()
		// })

		new MyNotice((el)=>el.setText('example'))

		this.registerView('my-view-id', (leaf)=>new MyView(leaf, this))

		// let leaf = this.app.workspace.getLeaf(true)
		// await leaf.setViewState({type: 'my-view-id', active: true})
		// this.app.workspace.revealLeaf(leaf)


		// let leaf1 = this.app.workspace.createLeafBySplit(leaf, 'horizontal', true)
		// await leaf1.setViewState({type: 'my-view-id', active: true})
		// this.app.workspace.revealLeaf(leaf1)

		// this.app.workspace.iterateRootLeaves((leaf)=>leaf.setGroup('test'))
		this.app.workspace.iterateAllLeaves((leaf)=>{
			console.log(leaf.getViewState().type)
			leaf.getViewState()
		})

	}

	onunload() {

	}


	settings: MyPluginSettings;
	settingTab: MyPluginSettingTab;
	async load_settings(){
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())

		this.settingTab.containerEl.empty()
		this.addSettingTab(this.settingTab)

		new Setting(this.settingTab.containerEl)
			.setName('example setting')
			.setDesc('example description')
			.addText((text) => {
				text.setPlaceholder('example placeholder')
					.setValue(this.settings.example_setting)
					.onChange(async (val)=>{
						this.settings.example_setting = val
						await this.saveData(this.settings)
					})
			})
	}

	ribbon_menu: Menu;
	init_menu(){
		this.ribbon_menu = new Menu()
		this.ribbon_menu.addItem((item)=>{
			item.setTitle('example menu item')
				.onClick(()=>new Notice('example menu item'))
		})

		// this.addRibbonIcon('dice', 'example ribbon icon', (e)=>{
		// 	this.ribbon_menu.showAtMouseEvent(e)
		// })

	}

	modal: MyModal;
	init_modal(){
		this.modal = new MyModal(this.app)
		this.modal
			.setTitle('example modal')
			.setContent('example modal content')

		// this.addRibbonIcon('dice', 'example ribbon icon', (e)=>{
		// 	this.modal.open()
		// })
	}
}

class MyModal extends Modal {
	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class MyPluginSettingTab extends PluginSettingTab {
	plugin: MyPlugin
	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}
	async display() {
		await this.plugin.load_settings()
	}
}

class MyNotice extends Notice{
	constructor(cb: (el: HTMLElement)=>void, duration?: number) {
		super('', duration)
		cb(this.noticeEl)
	}
}

class MyView extends ItemView{
	ob: Plugin
	constructor(leaf: WorkspaceLeaf, ob: Plugin) {
		super(leaf);
		this.ob = ob
	}
	getDisplayText(): string {
		return "my-view-display";
	}
	getViewType(): string {
		return "my-view-type";
	}
	async onOpen(){
		createApp(sfc, {ob: this.ob}).mount(this.containerEl)
	}
}
