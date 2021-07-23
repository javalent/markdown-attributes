/**
 * parse {.class #id key=val} strings
 * @param {string} str: string to parse
 * @param {int} start: where to start parsing (including {)
 * @returns {2d array}: [['key', 'val'], ['class', 'red']]
 */
export function getAttrs(
    str: string,
    start: number,
    options: {
        leftDelimiter: string;
        rightDelimiter: string;
        allowedAttributes: Array<RegExp | string>;
    }
) {
    // not tab, line feed, form feed, space, solidus, greater than sign, quotation mark, apostrophe and equals sign
    const allowedKeyChars = /[^\t\n\f />"'=]/;
    const pairSeparator = " ";
    const keySeparator = "=";
    const classChar = ".";
    const idChar = "#";

    const attrs = [];
    let key = "";
    let value = "";
    let parsingKey = true;
    let valueInsideQuotes = false;

    // read inside {}
    // start + left delimiter length to avoid beginning {
    // breaks when } is found or end of string
    for (let i = start + options.leftDelimiter.length; i < str.length; i++) {
        if (
            str.slice(i, i + options.rightDelimiter.length) ===
            options.rightDelimiter
        ) {
            if (key !== "") {
                attrs.push([key, value]);
            }
            break;
        }
        let char_ = str.charAt(i);

        // switch to reading value if equal sign
        if (char_ === keySeparator && parsingKey) {
            parsingKey = false;
            continue;
        }

        // {.class} {..css-module}
        if (char_ === classChar && key === "") {
            if (str.charAt(i + 1) === classChar) {
                key = "css-module";
                i += 1;
            } else {
                key = "class";
            }
            parsingKey = false;
            continue;
        }

        // {#id}
        if (char_ === idChar && key === "") {
            key = "id";
            parsingKey = false;
            continue;
        }

        // {value="inside quotes"}
        if (char_ === '"' && value === "") {
            valueInsideQuotes = true;
            continue;
        }
        if (char_ === '"' && valueInsideQuotes) {
            valueInsideQuotes = false;
            continue;
        }

        // read next key/value pair
        if (char_ === pairSeparator && !valueInsideQuotes) {
            if (key === "") {
                // beginning or ending space: { .red } vs {.red}
                continue;
            }
            attrs.push([key, value]);
            key = "";
            value = "";
            parsingKey = true;
            continue;
        }

        // continue if character not allowed
        if (parsingKey && char_.search(allowedKeyChars) === -1) {
            continue;
        }

        // no other conditions met; append to key/value
        if (parsingKey) {
            key += char_;
            continue;
        }
        value += char_;
    }

    if (options.allowedAttributes && options.allowedAttributes.length) {
        let allowedAttributes = options.allowedAttributes;

        return attrs.filter(function (attrPair) {
            let attr = attrPair[0];

            function isAllowedAttribute(allowedAttribute: RegExp | string) {
                return (
                    attr === allowedAttribute ||
                    (allowedAttribute instanceof RegExp &&
                        allowedAttribute.test(attr))
                );
            }

            return allowedAttributes.some(isAllowedAttribute);
        });
    } else {
        return attrs;
    }
}
