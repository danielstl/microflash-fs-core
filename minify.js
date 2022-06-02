/**
 * Script to create minified HTML from the source HTML file.
 *
 * Output is to 'outputbytes.txt'
 */
const minify = require("html-minifier").minify;
const fs = require("fs");

const input = fs.readFileSync("src/basic/index.html", { encoding: "ascii" });
const htmlSuffix = "<div id=z>";

let result = minify(input, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: { compress: true, toplevel: true },
    minifyURLs: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    removeAttributeQuotes: true,
});

console.log(result);

// The overall HTML+JS MUST be byte aligned to 4000 bytes.
// Use trailing spaces to ensure the file to 4000 bytes.
// The file will end with <div id=z>

const limit = 4000;
const maxSize = limit - htmlSuffix.length;
const padding = maxSize - result.length;
if (padding < 0) {
    console.error(
        `Could not minimize to ${maxSize} bytes. Difference: ${Math.abs(padding)}`
    );
    process.exit(1);
}
console.log(`${padding} bytes remaining`);

result += " ".repeat(padding) + htmlSuffix;

if (result.length !== limit) {
    throw new Error(`Expected ${limit} but was ${result.length}`);
}

const arrayContents = "{" + Array.from(result)
    .map((c) => "0x" + c.charCodeAt(0).toString(16))
    .join(",") + "};";

console.log(arrayContents);

fs.writeFileSync("outputbytes.txt", arrayContents);