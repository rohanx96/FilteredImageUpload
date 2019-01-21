import TakePicture from "./../takePicture/TakePictureContainer";
import ImageViewer from "./../imageViewer/ImageViewer";

export default (routes = {
  TakePicture: {
    screen: TakePicture
  },
  ImageViewer: {
      screen : ImageViewer
  }
});
