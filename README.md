# Markdown Attributes for Obsidian.md

Allows the use of `{: .class id='id' data=value }` markdown attributes inside Obsidian.md.

This plugin is currently proof of concept; however, no loss of data should occur. It is possible that rendering errors may happen. If so, please create an issue including the source text that caused the issue.

## Using the Plugin

Add your attributes inside a curly bracket with a colon, like this:

`{: .class }`

See below for usage with specific elements.

### IDs

Currently, the ID attribute must be set using `id=value` due to Obsidian's tags. This may change in a future release.

### Inline Text Elements

Inline text elements such as italics, bold, highlight, etc. should have their attributes placed _inside_ the symbol:

```
I'm normal text, but *I'm italic {: class='italics' }*, **I'm bold {: .bold }** and ==I'm highlighted {: id=highlight }==.
```

### Paragraphs

Paragraph attributes should be placed after the last line of the block.

```
This is a paragraph.
This is another line of the paragraph.
This is the last line.
{: id=my_paragraph .class }
```

### Headers

Attributes must be added to headers at the end of the line.

`### A Header {: id=header .header-class }`

### Tables

Currently, there is not a way to add attributes to an entire table or table row. However, attributes can be added to individual table cells like so:

```markdown
| header1 {: .class} | header2                |
| ------------------ | ---------------------- |
| column1            | column2 {: .class-two} |
```

### Links

Both Wikilinks and markdown syntax links may have attributes placed on them.

`[link](http://example.com){: class="foo bar" title="Some title!" }`

`[[Test 123]] {: .wikilink}`

### Lists

Lists may have attributes placed on each individual list item. At this time there is not a way to place attributes on a containing `<ul>`.

```markdown
-   item {: .item}
    -   nested item {: .nested}
    -   nested item 2 {: id="item 2" }
```

### Code Blocks

Code blocks should have their attributes placed after the initial three ticks.

````
```python {: data-python="code" .class }
nums = [x for x in range(10)]
```
````

## 0.0.1

-   Release

# Installation

<!-- ## From within Obsidian

From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:

-   Open Settings > Third-party plugin
-   Make sure Safe mode is **off**
-   Click Browse community plugins
-   Search for this plugin
-   Click Install
-   Once installed, close the community plugins window and activate the newly installed plugin -->

## From GitHub

-   Download the Latest Release from the Releases section of the GitHub Repository
-   Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`  
    Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
-   Reload Obsidian
-   If prompted about Safe Mode, you can disable safe mode and enable the plugin.
    Otherwise head to Settings, third-party plugins, make sure safe mode is off and
    enable the plugin from there.

### Updates

You can follow the same procedure to update the plugin

# Warning

This plugin comes with no guarantee of stability and bugs may delete data.
Please ensure you have automated backups.
