var fs = require('fs');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer =require('gulp-autoprefixer');
var ejs = require("gulp-ejs");
var merge = require('merge-stream');

var changed  = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var imageminJpg = require('imagemin-jpeg-recompress');
var imageminPng = require('imagemin-pngquant');
var imageminGif = require('imagemin-gifsicle');
var svgmin = require('gulp-svgmin');

var meta = require('./_dev_files/meta/meta.json');

// htmlに関するタスク
gulp.task('build-html', function(){
	var buildView = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		meta: meta, //meta に data.json を取り込む
		fileKind: 'view'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./view_files'));
	
	var buildMock = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		meta: meta, //meta に data.json を取り込む
		fileKind: 'mock'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_upfiles/mock'));
	
	var buildStg = gulp.src('./_dev_files/parts_ejs/*.ejs')
	.pipe(ejs({
		meta: meta, //meta に data.json を取り込む
		fileKind: 'stg'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_upfiles/stg'));
	
	return merge(buildView, buildMock, buildStg);
	
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

// 画像の圧縮前と圧縮後のディレクトリを定義
var paths = {
  srcDir : '_dev_files',
  dstDir : 'view_files'
}

// jpg,png,gif画像の圧縮タスク
gulp.task('imagemin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(jpg|jpeg|png|gif)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(imagemin([
        imageminPng(),
        imageminJpg(),
        imageminGif({
            interlaced: false,
            optimizationLevel: 3,
            colors:180
        })
    ]
    ))
    .pipe(gulp.dest( dstGlob ));
});
// svg画像の圧縮タスク
gulp.task('svgmin', function(){
    var srcGlob = paths.srcDir + '/**/*.+(svg)';
    var dstGlob = paths.dstDir;
    gulp.src( srcGlob )
    .pipe(changed( dstGlob ))
    .pipe(svgmin())
    .pipe(gulp.dest( dstGlob ));
});

// ローカルサーバーに関するタスク
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./view_files"
        }
    });
});

// 自動でローカルサーバーをリロードするタスク
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// ファイルの変更を監視
gulp.task('watch', function() {
	gulp.watch(['./_dev_files/parts_ejs/*.ejs','./_dev_files/scss/*.scss','./base_files/css/*.css',paths.srcDir + '/**/*'], ['build-css','build-html','bs-reload','imagemin','svgmin'])
});

// デフォルトタスク
gulp.task('default', ['build-css','build-html','watch','browser-sync']);