import {
    MarkdownPostProcessorContext,
    Plugin,
    PluginSettingTab,
    Setting,
    TextComponent
} from "obsidian";

import "./main.css";
import { getAttrs } from "./utils/utils";
const defaultOptions = {
    leftDelimiter: "{",
    rightDelimiter: "}",
    allowedAttributes: <string[]>[]
};
export default class BetterComments extends Plugin {
    data = {};
    async saveSettings() {
        await this.saveData({});
    }

    async loadSettings() {
        this.data = Object.assign({}, {}, await this.loadData());
    }
    async onload(): Promise<void> {
        console.log(`Markdown Attributes v${this.manifest.version} loaded.`);

        await this.loadSettings();

        this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
    }

    async postprocessor(el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        let text = el.innerText;
        console.log(getAttrs(text, 0, defaultOptions));
    }

    async onunload() {
        console.log("Better Comments unloaded");
    }
}
