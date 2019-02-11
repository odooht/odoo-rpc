
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      title: 'erp',
      dll: false,
      routes: {
        exclude: [

          /components\//,
        ],
      },
    }],
  ],

  proxy: {
    '/api': {
      target: 'http://192.168.56.103:8069',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },

}
