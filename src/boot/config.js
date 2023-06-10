export default ({ app }) => {
  app.use(VueViewer ,{
    defaultOptions: {
      zIndex: 9999
     }
  });
};
