const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      //libraryDirectory: 'es',
      //style: true,
      //style: name => `${name}/style/less`,
    },
    'vant',
  ],
];
//非生产环境需要css
if (process.env.NODE_ENV.trim() != 'production') {
  // plugins[0][1].style = name => `${name}/style/less`;
  plugins[0][1].style = true;
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  //设置 vant 按需导入
  plugins,
};
