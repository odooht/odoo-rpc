
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'test',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],


   proxy: {
    '/api': {
      target: 'http://192.168.56.105:8069/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },


}
