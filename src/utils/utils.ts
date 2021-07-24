/** """
Attribute List Extension for Python-Markdown
============================================
Adds attribute list syntax. Inspired by
[maruku](http://maruku.rubyforge.org/proposal.html#attribute_lists)'s
feature of the same name.
See <https://Python-Markdown.github.io/extensions/attr_list>
for documentation.
Original code Copyright 2011 [Waylan Limberg](http://achinghead.com/).
All changes Copyright 2011-2014 The Python Markdown Project
License: [BSD](https://opensource.org/licenses/bsd-license.php)
"""
*/

function _handle_double_quote(t: string) {
    let [k, v] = t.split("=", 1);
    return [k, v.replace('"', "")];
}

function _handle_single_quote(t: string) {
    let [k, v] = t.split("=", 1);
    return [k, v.replace("'", "")];
}

function _handle_key_value(t: string) {
    return t.split("=", 1);
}

function _handle_word(t: string) {
    if (t[0] == ".") return [".", t.slice(1)];
    if (t[0] == "#") return ["id", t.slice(1)];
    return [t];
}
const block_level_elements = [
    // # Elements which are invalid to wrap in a `<p>` tag.
    // # See https://w3c.github.io/html/grouping-content.html#the-p-element
    "address",
    "article",
    "aside",
    "blockquote",
    "details",
    "div",
    "dl",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "main",
    "menu",
    "nav",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "ul",
    // # Other elements which Markdown should not be mucking up the contents of.
    "canvas",
    "colgroup",
    "dd",
    "body",
    "dt",
    "group",
    "iframe",
    "li",
    "legend",
    "math",
    "map",
    "noscript",
    "output",
    "object",
    "option",
    "progress",
    "script",
    "style",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "tr",
    "video"
];
function is_block_level(tag: string) {
    //"""Check if the tag is a block level HTML tag."""
    if (typeof tag === "string")
        return block_level_elements.includes(
            tag.toLowerCase().replace(/\\/g, "")
        );
    //# Some ElementTree tags are not strings, so return False.
    return false;
}

const scan = function (str: string): string[] {
    if (/[^ =]+=".*?"/.test(str)) return _handle_double_quote(str);
    if (/[^ =]+='.*?'/.test(str)) return _handle_single_quote(str);
    if (/[^ =]+=[^ =]+/.test(str)) return _handle_key_value(str);
    console.log(_handle_word(str));
    if (/[^ =]+/.test(str)) return _handle_word(str);
    if (/' '/) return;
};

function get_attrs(str: string) {
    // """ Parse attribute list and return a list of attribute tuples. """
    return scan(str);
}

function isheader(elem: Element) {
    return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
        elem.tagName.toLowerCase()
    );
}

export class AttrListTreeprocessor {
    BASE_RE = /\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}/;
    HEADER_RE = /[ ]+\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}[ ]*$/; //.format(BASE_RE)
    BLOCK_RE = /\n[ ]*\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}[ ]*$/; //'.format(BASE_RE))
    INLINE_RE = /^\{\:?[ ]*([^\}\n ][^\}\n]*)[ ]*\}/; //'.format(BASE_RE))
    NAME_RE = `[^A-Z_a-z\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u02ff\\u0370-\\u037d\\u037f-\\u1fff\\u200c-\\u200d\\u2070-\\u218f\\u2c00-\\u2fef\\u3001-\\ud7ff\\uf900-\\ufdcf\\ufdf0-\\ufffd\:\-\.0-9\\u00b7\\u0300-\\u036f\\u203f-\u2040]+`;

    run(doc: Element) {
        let regex: RegExp;
        for (let elem of Array.from(doc.children)) {

            if (is_block_level(elem.tagName)) {
                regex = this.BASE_RE;
                console.log(
                    "🚀 ~ file: utils.ts ~ line 137 ~ isheader(elem)",
                    isheader(elem),
                    elem.tagName
                );
                if (isheader(elem) || elem.tagName in ["dt", "td", "th"]) {
                    //# header, def-term, or table cell: check for attrs at end of element
                    regex = this.HEADER_RE;
                }
                if (elem.tagName == "li") {
                    //# special case list items. children may include a ul or ol.
                    let pos = 0;
                    //# find the ul or ol position
                    for (let index = 0; index < elem.children.length; index++) {
                        if (elem.children[index].tagName in ["ul", "ol"]) {
                            pos = index;
                            break;
                        }
                    }
                    if (
                        pos == 0 &&
                        Array.from(elem.children).pop().textContent
                    ) {
                        //# use tail of last child. no ul or ol.
                        const el = Array.from(elem.children).pop();
                        let m = el.textContent.match(regex); //.search()
                        if (m) {
                            this.assign_attrs(elem, m[1]);
                            el.textContent = el.textContent.slice(0, m.index);
                        }
                    } else if (
                        pos > 0 &&
                        Array.from(elem.children)[pos - 1].textContent
                    ) {
                        /* # use tail of last child before ul or ol
                        m = RE.search(elem[pos-1].tail)
                        if m:
                            self.assign_attrs(elem, m.group(1))
                            elem[pos-1].tail = elem[pos-1].tail[:m.start()] */
                    } else if (elem.textContent) {
                        /* # use text. ul is first child.
                        m = RE.search(elem.text)
                        if m:
                            self.assign_attrs(elem, m.group(1))
                            elem.text = elem.text[:m.start()]}  */
                    }
                } else if (
                    elem.children.length &&
                    Array.from(elem.children).pop().textContent
                ) {
                    //# has children. Get from tail of last child
                    const el = Array.from(elem.children).pop();
                    let m = el.textContent.match(regex);
                    console.log("🚀 ~ file: utils.ts ~ line 195 ~ m", m);
                    if (m) {
                        this.assign_attrs(elem, m[1]);
                        el.textContent = el.textContent.slice(0, m.index);
                        if (isheader(elem)) {
                            //# clean up trailing #s
                            elem.textContent = elem.textContent.replace(
                                /(#|\s)+$/gm,
                                ""
                            );
                        }
                    }
                } else if (elem.textContent) {
                    //# no children. Get from text.
                    let m = elem.textContent.match(regex);
                    if (m) {
                        this.assign_attrs(elem, m[1]);
                        elem.textContent = elem.textContent.slice(0, m.index);
                        if (isheader(elem)) {
                            //# clean up trailing #s
                            elem.textContent = elem.textContent.replace(
                                /(#|\s)+$/gm,
                                ""
                            );
                        }
                    }
                }
            }
        }
    }
    assign_attrs(elem: Element, attrs: string) {
        //""" Assign attrs to element. """
        console.log("🚀 ~ file: utils.ts ~ line 218 ~ k, v", get_attrs(attrs));
        let attributes = attrs.split(" ").map((attr) => get_attrs(attr));
        console.log("🚀 ~ file: utils.ts ~ line 229 ~ attributes", attributes);
        for (let [k, v] of attributes) {
            if (k == ".") {
                //# add to class
                let cls = elem.getAttr("class");
                if (cls) {
                    elem.setAttr("class", "{} {}".format(cls, v));
                } else {
                    elem.setAttr("class", v);
                }
            } else {
                //# assign attr k with v
                elem.setAttr(/* this.sanitize_name(k) */ k, v);
            }
        }
    }
    sanitize_name(name: string) {
        /* """
        Sanitize name as 'an XML Name, minus the ":"'. 
        See https://www.w3.org/TR/REC-xml-names/#NT-NCName
        """*/
        //return this.NAME_RE.sub("_", name);
    }
}

/* 
class AttrListExtension(Extension):
    def extendMarkdown(self, md):
        md.treeprocessors.register(AttrListTreeprocessor(md), 'attr_list', 8)
        md.registerExtension(self)


def makeExtension(**kwargs):  # pragma: no cover
    return AttrListExtension(**kwargs) */
