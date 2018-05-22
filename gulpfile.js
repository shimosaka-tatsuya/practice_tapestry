var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
 
// cssに関するタスク
gulp.task('build-css', function () {
	gulp.src('_scss/style.css')
	.pipe(sass({outputStyle: 'nested'}))
	.pipe(rename({extname: '.css.ejs'}))
	.pipe(autoprefixer({  //autoprefixerの実行
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest('css'));
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch('_scss/*.css', ['build-css'])
});

// デフォルトタスク
gulp.task('default', ['build-css','watch']);