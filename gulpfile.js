const gulp = require("gulp");
const htmlMinify = require("gulp-htmlmin");
const jsMinify = require("gulp-uglify");
const imgagemin = require("gulp-imagemin");
const { sync } = require("del");

const autoprefixer = require("gulp-autoprefixer");
const cssMinify = require("gulp-clean-css");
const gcssmq = require("gulp-group-css-media-queries");
const gulpSass = require("gulp-sass");
const sass = require("sass");
const concatCss = require("gulp-concat-css");
// const procss = require('gulp-progressive-css');

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
const log = require("gulplog");

// const ts = require('gulp-typescript');

const browserSync = require("browser-sync");

const distDir = "./dist/";
const srcDir = "./src/";

const htmlFiles = `${srcDir}*.html`;

const jsDir = "js/";
const jsFiles = `${srcDir}${jsDir}*.js`;
const jsInput = `${srcDir}${jsDir}index.js`;
const jsOutput = "app.js";

// const tsDir = "ts/";
// const tsFiles = `${srcDir}${tsDir}*.ts`;
// const tsInput = `${srcDir}${tsDir}index.js`;
// const tsOutput = "ts.js";

const imgDir = "img/";
const imgFiles = `${srcDir}${imgDir}**/*`;

const stylesDir = "styles/";
const styleFiles = [
  `${srcDir}${stylesDir}*.+(css|scss)`,
  `!${srcDir}${stylesDir}critical.scss`,
];
const criticalStyleFiles = `${srcDir}${stylesDir}critical.scss`;

const fontsDir = "fonts/";
const fontsFiles = `${srcDir}${fontsDir}**/*`;

const videosDir = "videos/";
const videoFiles = `${srcDir}${videosDir}**/*`;

const processHTML = () => {
  return gulp
    .src(htmlFiles)
    .pipe(htmlMinify({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(distDir))
    .pipe(browserSync.reload({ stream: true }));
};

// const processTS = () => {
//   return gulp.src(`${tsFiles}`)
//     .pipe(ts({
//       noImplicitAny: true,
//       outFile: `output.js`
//     }))
//     .pipe(buffer())
//     .pipe(jsMinify())
//     .on("error", log.error)
//     .pipe(gulp.dest(`${distDir}${tsDir}`));
// };

const processJS = () => {
  return browserify({
    entries: jsInput,
    debug: true,
  })
    .bundle()
    .pipe(source(jsOutput))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(jsMinify())
    .on("error", log.error)
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(`${distDir}${jsDir}`));
};

const processIMG = () => {
  return gulp
    .src(imgFiles)
    .pipe(imgagemin())
    .pipe(gulp.dest(`${distDir}${imgDir}`));
};

const gulpSassWorker = gulpSass(sass);

const processCriticalStyle = () => {
  return gulp
    .src(criticalStyleFiles)
    .pipe(gulpSassWorker().on("error", gulpSassWorker.logError))
    .pipe(autoprefixer({ grid: true }))
    .pipe(gcssmq()) // не работает
    .pipe(cssMinify())
    .pipe(gulp.dest(`${distDir}${stylesDir}`))
    .pipe(browserSync.stream());
};

const processStyle = () => {
  return gulp
    .src(styleFiles)
    .pipe(gulpSassWorker().on("error", gulpSassWorker.logError))
    .pipe(autoprefixer({ grid: true }))
    .pipe(gcssmq())
    .pipe(concatCss("style.css"))
    .pipe(cssMinify())
    .pipe(gulp.dest(`${distDir}${stylesDir}`))
    .pipe(browserSync.stream());
};

const clean = async () => {
  return sync(distDir, { force: true });
};

const watchDev = () => {
  gulp.watch(styleFiles, processStyle).on("change", browserSync.reload);
  gulp.watch(htmlFiles, processHTML).on("change", browserSync.reload);
  gulp.watch(jsFiles, processJS).on("change", browserSync.reload);
  gulp.watch(imgFiles, processIMG).on("change", browserSync.reload);
};

browserSync.create();

const initBrowserSync = () => {
  browserSync.init({
    server: {
      baseDir: distDir,
      serveStaticOptions: {
        extensions: ["html"],
      },
    },
    port: 8080,
    ui: { port: 8081 },
    open: true,
  });
};

const processFonts = () => {
  return gulp
    .src(fontsFiles)
    .pipe(gulp.dest(`${distDir}${fontsDir}`))
    .pipe(browserSync.stream());
};

const processVideos = () => {
  return gulp.src(videoFiles).pipe(gulp.dest(`${distDir}${videosDir}`));
};

const jobs = [
  clean,
  processHTML,
  // processTS,
  processJS,
  processIMG,
  processCriticalStyle,
  processStyle,
  processFonts,
  processVideos,
];

exports.build = gulp.series(...jobs);
exports.default = gulp.parallel(...jobs, initBrowserSync, watchDev);
