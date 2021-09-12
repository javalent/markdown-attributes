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
        const child = topElement.firstElementChild;
        if (!child) return;
        let str: string;

        /** Code blocks have to be handled separately because Obsidian does not
         *  include any text past the language.
         *
         *  Unfortunately this also means that changes to the code block attributes
         *  require reloading the note to take effect because they do not trigger the postprocessor.
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

        /**
         * Table elements should check the next line in the source to see if it is a single block attribute,
         * because those block attributes are not applied to the table.
         */
        if (child instanceof HTMLTableElement) {
            if (!ctx.getSectionInfo(topElement)) return;

            /** Pull the Section data. */
            const { text, lineEnd } = ctx.getSectionInfo(topElement);

            /** Get the source for this element. */
            let source = (
                text.split("\n").slice(lineEnd + 1, lineEnd + 2) ?? []
            ).shift();

            /** Test if the element contains attributes. */
            if (
                source &&
                source.length &&
                Processor.ONLY_RE.test(source.trim())
            ) {
                /** Pull the matched string and add it to the child so the Processor catches it. */
                let [attribute_string] = source.match(Processor.ONLY_RE) ?? [];
                child.prepend(new Text(attribute_string));

                str = topElement.innerText;
            }
        }

        /**
         * If the element is a <p> and the text is *only* an attribute, it was used as a block attribute
         * and should be removed.
         */
        if (child instanceof HTMLParagraphElement) {
            if (Processor.ONLY_RE.test(child.innerText.trim())) {
                child.detach();
                return;
            }
        }

        /** Test if the element contains attributes. */
        if (!Processor.BASE_RE.test(str ?? topElement.innerText)) return;

        /** Parse the element using the Processor. */
        if (!(child instanceof HTMLElement)) return;
        Processor.parse(child);
    }

    async onunload() {
        console.log("Markdown Attributes unloaded");
    }
}
