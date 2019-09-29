const _EXTENSIONS = {
  js: /\.(js|es6)$/i,
  css: /\.css$/i,
  scss: /\.s[a|c]ss$/i,
  postcss: /\.postcss$/i,
  text: /\.(xml|txt)(\?.*)?$/i,
  images: /\.(png|jpe?g|gif|svg|tiff|bmp|ico)(\?.*)?$/i,
  media: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
  video: /\.(mp4|webm|ogg)(\?.*)?$/i,
  audio: /\.(mp3|wav|flac|aac)(\?.*)?$/i,
  fonts: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
  json: /\.json$/i,
  html: /\.html$/i
};

module.exports = _EXTENSIONS;
