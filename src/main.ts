import {
    MarkdownPostProcessorContext,
    Plugin,
    PluginSettingTab,
    Setting,
    TextComponent
} from "obsidian";


import "./main.css";
import { AttrListTreeprocessor } from "./utils/utils";

const BASE_REG = /\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}/;
export default class BetterComments extends Plugin {
    data = {};
    processor: AttrListTreeprocessor;
    async saveSettings() {
        await this.saveData({});
    }

    async loadSettings() {
        this.data = Object.assign({}, {}, await this.loadData());
    }
    async onload(): Promise<void> {
        console.log(`Markdown Attributes v${this.manifest.version} loaded.`);

        await this.loadSettings();
        this.processor = new AttrListTreeprocessor();

        this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
    }

    async postprocessor(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        const children = Array.from(el.children);

        if (!children.length) return;

        this.processor.run(el);

    }

    async onunload() {
        console.log("Better Comments unloaded");
    }
}
