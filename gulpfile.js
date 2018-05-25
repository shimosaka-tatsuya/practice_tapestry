var fs = require('fs');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
var ejs = require("gulp-ejs");

var merge = require('merge-stream');

var jsonData = require('./_dev_files/json/index.json');

// mockに関するタスク
gulp.task('build-mock', function(){
	var buildMockPc =  gulp.src('./base_files/template_ejs/template_mock_pc.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("pc.html"))
	.pipe(gulp.dest('./_upload_files/mock'));
	
	var buildMockSp =  gulp.src('./base_files/template_ejs/template_mock_sp.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("sp.html"))
	.pipe(gulp.dest('./_upload_files/mock'));
	
	return merge(buildMockPc, buildMockSp);
});

// stgに関するタスク
gulp.task('build-stg', function(){
	var buildStgPc = gulp.src('./base_files/template_ejs/template_stg_pc.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("pc.html"))
	.pipe(gulp.dest('./_upload_files/stg'));
	
	var buildStgSp = gulp.src('./base_files/template_ejs/template_stg_sp.ejs')
	.pipe(ejs({
		jsonData: jsonData //jsonData に data.json を取り込む
	}))
	.pipe(rename("sp.html"))
	.pipe(gulp.dest('./_upload_files/stg'));
	
	return merge(buildStgPc, buildStgSp);
});

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
	gulp.src('./_dev_files/scss/*.scss')
	.pipe(sass({outputStyle: 'nested'}))
	.pipe(rename({extname: '.css'}))
	.pipe(autoprefixer({  //autoprefixerの実行
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest('./base_files/css'));
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch(['./_dev_files/scss/*.scss','./base_files/css/*.css'], ['build-css','build-mock','build-stg','bs-reload'])
	gulp.watch(['./_dev_files/parts_ejs/*.ejs'], ['build-mock','build-stg','bs-reload'])
});

// デフォルトタスク
gulp.task('default', ['build-css','build-mock','build-stg','watch','browser-sync']);