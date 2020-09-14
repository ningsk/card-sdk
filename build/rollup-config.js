/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-09-10 16:36:35
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-09-14 08:48:48
 */
import rollupGitVersion from "rollup-plugin-git-version";
import json from "rollup-plugin-json";
import gitRev from "git-rev-sync";
import pkg from "../package.json";

let { version } = pkg;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === "release") {
  release = true;
} else {
  release = false;
  const branch = gitRev.branch();
  const rev = gitRev.short();
  version += "+" + branch + "." + rev;
}

export default {
  input: "src/Earth3D.js",
  output: [
    {
      file: pkg.main,
      format: "umd",
      name: "DC",
      legacy: true, // Needed to create files loadable by IE8
      freeze: false,
    },
  ],
  plugins: [release ? json() : rollupGitVersion()],
};
