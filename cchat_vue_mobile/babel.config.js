module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  //设置 vant 按需导入
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
