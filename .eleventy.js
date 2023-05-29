const mdsub = require("markdown-it-sub");
const mdsup = require("markdown-it-sup");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/**/*");
    eleventyConfig.addPassthroughCopy("src/blog/**/img/*");
    eleventyConfig.addPassthroughCopy("src/projects/**/img/*");

    eleventyConfig.amendLibrary("md", mdLib=>mdLib.use(mdsub));
    eleventyConfig.amendLibrary("md", mdLib=>mdLib.use(mdsup));

    eleventyConfig.addWatchTarget("src/blog/**/*.md");
    eleventyConfig.addWatchTarget("src/projects/**/*.md");

    eleventyConfig.addNunjucksFilter("readableDate", function (date) {
      let d = new Date(date);
      return `${d.toLocaleDateString("en-GB")}`
    });
  
    return {
      dir: {
        input: "src",
        data: "_data",
        includes: "_includes",
        layouts: "_layouts",
      },
    };
  };