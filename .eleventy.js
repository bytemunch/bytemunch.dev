const mdsub = require("markdown-it-sub");
const mdsup = require("markdown-it-sup");
const metagen = require('eleventy-plugin-metagen');

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(metagen);

  eleventyConfig.addPassthroughCopy("src/assets/**/*");
  eleventyConfig.addPassthroughCopy("src/blog/**/img/*");
  eleventyConfig.addPassthroughCopy("src/blog/**/img/**/*");
  eleventyConfig.addPassthroughCopy("src/projects/**/img/*");
  eleventyConfig.addPassthroughCopy("src/play/**/*");

  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(mdsub));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(mdsup));

  eleventyConfig.addWatchTarget("src/blog/**/*.md");
  eleventyConfig.addWatchTarget("src/projects/**/*.md");

  eleventyConfig.addNunjucksFilter("readableDate", function (date) {
    let d = new Date(date);
    return `${d.toLocaleDateString("en-GB")}`
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", collection => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts", "blog-page", "page", "projects-page", "projects"].indexOf(tag) === -1);
  });

  eleventyConfig.addFilter("getTagCount", function (tag, collection) {
    // TODO is this an actual use case for Array.reduce() ?????? woah
    let count = 0;
    for (let item of collection) {
      if ((item.data.tags || []).includes(tag)) count++;
    }
    return count;
  })

  return {
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};