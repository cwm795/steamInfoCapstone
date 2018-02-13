module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        predef: ["document", "console", "$"],
        esnext: true,
        globalstrict: true,
        globals: { angular: true } //need to add app module's name
      },
      files: ["../app/**/*.js"]
    },
    watch: {
      javascripts: {
        files: ["../app/**/*.js"],
        tasks: ["jshint"]
      },
      // sass: {
      //   files: ["../sass/**/*.scss"],
      //   tasks: ["sass"]
      // }
    }
  });

  require("matchdep")
    .filterDev("grunt-*")
    .forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", ["jshint", "watch"]);
};
