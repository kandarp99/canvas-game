module.exports = function(grunt) {
  grunt.initConfig({
    "install-dependencies": {
      options: {
        isDevelopment: true
      }
    },
    exec: {
      nodeunit: 'nodeunit',
      coverage: 'node "node_modules/istanbul/lib/cli.js" cover "node_modules/nodeunit/bin/nodeunit" -- test',
      index: 'open index.html',
    }
  });

  grunt.loadNpmTasks('grunt-install-dependencies');
  grunt.loadNpmTasks('grunt-exec');
  
  grunt.registerTask('coverage', 'exec:coverage');
  grunt.registerTask('index', 'exec:index');
  grunt.registerTask('nodeunit', 'exec:nodeunit');
  grunt.registerTask('default', ['install-dependencies', 'nodeunit', 'coverage', 'index']);
}
