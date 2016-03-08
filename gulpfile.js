var gulp = require('gulp');

gulp.task('coverage', require('gulp-jsx-coverage').createTask({
  src: ['test/**/*+(.js|.jsx)'],
  isparta: true,
  istanbul: {
    preserveComments: true,
    coverageVariable: '__MY_TEST_COVERAGE__',
    exclude: /node_modules|test/
  },

  threshold: [
    {
      type: 'lines',
      min: 90
    }
  ],

  transpile: {
    babel: {
      include: /\.jsx?$/,
      exclude: /node_modules/,
      omitExt: false
    }
  },

  coverage: {
    reporters: ['text-summary', 'json', 'lcov'],
    directory: 'coverage'
  },

  mocha: {
    reporter: 'spec'
  },

  //optional
  cleanup: function () {
    // do extra tasks after test done
    // EX: clean global.window when test with jsdom
  }
}));
