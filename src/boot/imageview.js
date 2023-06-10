import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
VueViewer.setDefaults({
  zIndexInline: 9999 ,
})
export default ({ app }) => {
  app.use(VueViewer ,{
    defaultOptions: {
      zIndex: 9999
     }
  });
};
