import { MarkdownPostProcessorContext, Plugin, TFile } from "obsidian";

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
            const { lineStart } = ctx.getSectionInfo(topElement);

            const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
            if (!(file instanceof TFile)) return;
            const text = await this.app.vault.cachedRead(file);

            /** Get the source for this element. Only look at the top line for code blocks. */
            let source = text.split("\n").slice(lineStart, lineStart + 1);
            str = source.join("\n");
            /** Test if the element contains attributes. */
            if (!Processor.BASE_RE.test(str)) return;

            /** Pull the matched string and add it to the child so the Processor catches it. */
            let [attribute_string] = str.match(Processor.BASE_RE) ?? [];
            child.prepend(new Text(attribute_string));
        }

        /**
         * Table elements and Mathjax elements should check the next line in the source to see if it is a single block attribute,
         * because those block attributes are not applied to the table.
         */
        if (
            child instanceof HTMLTableElement ||
            (child.hasClass("math") && child.hasClass("math-block")) ||
            child.hasClass("callout")
        ) {
            console.log("🚀 ~ file: main.ts ~ line 58 ~ child", child);
            if (!ctx.getSectionInfo(topElement)) return;

            /** Pull the Section data. */
            const { text, lineEnd } = ctx.getSectionInfo(topElement);
            console.log(
                "🚀 ~ file: main.ts ~ line 63 ~ text",
                text.split("\n"),
                lineEnd
            );

            /** Callouts include the block level attribute */
            const adjustment = child.hasClass("callout") ? 0 : 1;

            /** Get the source for this element. */
            let source = (
                text
                    .split("\n")
                    .slice(lineEnd + adjustment, lineEnd + adjustment + 1) ?? []
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
        if (child instanceof HTMLParagraphElement && !child.childElementCount) {
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
