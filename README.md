# Markdown Attributes for Obsidian.md

Allows the use of `{: .class id='id' data=value }` markdown attributes inside Obsidian.md.

## Using the Plugin

Add your attributes inside a curly bracket with a colon, like this:

`{: .class }`

### IDs

Currently, the ID attribute must be set using `id=value` due to Obsidian's tags. This may change in a future release.

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
