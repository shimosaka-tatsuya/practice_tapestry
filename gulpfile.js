var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
var ejs = require("gulp-ejs");

var jsonData = require('./_src/json/index.json');

// cssに関するタスク
gulp.task('build-css', function () {
	gulp.src('./_src/scss/*.scss')
	.pipe(sass({outputStyle: 'nested'}))
	.pipe(rename({extname: '.css'}))
	.pipe(autoprefixer({  //autoprefixerの実行
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest('./base_failes/css'));
});

// mockに関するタスク
gulp.task('build-mock', function(){
	return gulp.src('./base_failes/template_ejs/template_mock.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("index.html"))
	.pipe(gulp.dest('./_view/mock'));
});

// stgに関するタスク
gulp.task('build-stg', function(){
	return gulp.src('./base_failes/template_ejs/template_stg.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("index.html"))
	.pipe(gulp.dest('./_view/stg'));
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch(['./_src/scss/*.scss','./base_failes/css/*.css'], ['build-css','build-mock','build-stg'])
	gulp.watch(['./_src/parts_ejs/*.ejs'], ['build-mock','build-stg'])
});

// デフォルトタスク
gulp.task('default', ['build-css','build-mock','build-stg','watch']);