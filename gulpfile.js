var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
var ejs = require("gulp-ejs");

var jsonData = require('./_src/json/index.json');

// ローカルサーバーに関するタスク
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

// 自動でローカルサーバーをリロードするタスク
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// cssに関するタスク
gulp.task('build-css', function () {
	gulp.src('./_src/scss/*.scss')
	.pipe(sass({outputStyle: 'nested'}))
	.pipe(rename({extname: '.css'}))
	.pipe(autoprefixer({  //autoprefixerの実行
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest('./base_files/css'));
});

// mockに関するタスク
gulp.task('build-mock-pc', function(){
	return gulp.src('./base_files/template_ejs/template_mock_pc.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("pc.html"))
	.pipe(gulp.dest('./_upload_files/mock'));
});
gulp.task('build-mock-sp', function(){
	return gulp.src('./base_files/template_ejs/template_mock_sp.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("sp.html"))
	.pipe(gulp.dest('./_upload_files/mock'));
});

// stgに関するタスク
gulp.task('build-stg-pc', function(){
	return gulp.src('./base_files/template_ejs/template_stg_pc.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("pc.html"))
	.pipe(gulp.dest('./_upload_files/stg'));
});
gulp.task('build-stg-sp', function(){
	return gulp.src('./base_files/template_ejs/template_stg_sp.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("sp.html"))
	.pipe(gulp.dest('./_upload_files/stg'));
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch(['./_src/scss/*.scss','./base_files/css/*.css'], ['build-css','build-mock-pc','build-mock-sp','build-stg-pc','build-stg-sp','bs-reload'])
	gulp.watch(['./_src/parts_ejs/*.ejs'], ['build-mock-pc','build-mock-sp','build-stg-pc','build-stg-sp','bs-reload'])
});

// デフォルトタスク
gulp.task('default', ['build-css','build-mock-pc','build-mock-sp','build-stg-pc','build-stg-sp','watch','browser-sync']);