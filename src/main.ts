import { MarkdownPostProcessorContext, Plugin } from "obsidian";

import Processor from "./processor";

export default class MarkdownAttributes extends Plugin {
    parsing: Map<MarkdownPostProcessorContext, string> = new Map();
    async onload(): Promise<void> {
        console.log(`Markdown Attributes v${this.manifest.version} loaded.`);

        this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
    }

    async postprocessor(
        topElement: HTMLElement,
        ctx: MarkdownPostProcessorContext
    ) {
        let str = topElement.innerText;
        const child = topElement.firstElementChild;
        if (!child) return;

        /** Code blocks have to be handled separately because Obsidian does not
         *  include any text past the language.
         *
         *  Unfortunately this also means that changes to the code block attributes
         *  require reloading the note to take effect.
         */
        if (child instanceof HTMLPreElement) {
            /** If getSectionInfo returns null, stop processing. */
            if (!ctx.getSectionInfo(topElement)) return;

            /** Pull the Section data. */
            const { text, lineStart, lineEnd } = ctx.getSectionInfo(topElement);

            /** Get the source for this element. */
            let source = text.split("\n").slice(lineStart, lineEnd + 1);
            str = source.join("\n");

            /** Test if the element contains attributes. */
            if (!Processor.BASE_RE.test(str)) return;

            /** Pull the matched string and add it to the child so the Processor catches it. */
            let [attribute_string] = str.match(Processor.BASE_RE) ?? [];
            child.prepend(new Text(attribute_string));
        }

        /** Test if the element contains attributes. */
        if (!Processor.BASE_RE.test(str)) return;

        /** Parse the element using the Processor. */
        if (!(child instanceof HTMLElement)) return;
        let elements = Processor.parse(child);

        /** If the processor did not find any attributes, return. */
        if (!elements || !elements.length) return;

        /** Add the attributes to the elements returned from the processor. */
        for (let { element, attributes } of elements) {
            if (!element || !attributes || !attributes.length) continue;

            for (let [key, value] of attributes) {
                if (!key) continue;
                if (value) value = value.replace(/("|')/g, "");
                if (key === "class") {
                    element.addClasses(value.split(" "));
                } else if (!value) {
                    element.setAttr(key, true);
                } else {
                    element.setAttr(key, value);
                }
            }
        }
    }

    async onunload() {
        console.log("Markdown Attributes unloaded");
    }
}
