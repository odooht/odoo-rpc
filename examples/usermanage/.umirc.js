
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'usermanage',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
  proxy: {
    '/api': {
      // target: 'http://192.168.1.8:8069/',
      target: 'http://124.42.117.43:8069/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
}
