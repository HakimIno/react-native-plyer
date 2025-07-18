import { useState, useMemo } from 'react';

interface Dimensions {
  width: number;
  height: number;
  isLandscape: boolean;
}

export const useVideoDimensions = () => {
  const [videoDimensions, setVideoDimensions] = useState<Dimensions>({ width: 1, height: 1, isLandscape: false });
  const [containerDimensions, setContainerDimensions] = useState<Dimensions>({ width: 0, height: 0, isLandscape: false });

  const maxScale = useMemo(() => {
    if (videoDimensions.height === 1 || containerDimensions.height === 0) {
      return 1;
    }
    const videoAspectRatio = videoDimensions.width / videoDimensions.height;
    const containerAspectRatio = containerDimensions.width / containerDimensions.height;

    if (videoAspectRatio > containerAspectRatio) {
      return videoAspectRatio / containerAspectRatio;
    } else {
      return containerAspectRatio / videoAspectRatio;
    }
  }, [videoDimensions, containerDimensions]);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerDimensions({ width, height, isLandscape: width > height });
  };

  const handleLoad = (data: any) => {
    setVideoDimensions({
      width: data.naturalSize.width,
      height: data.naturalSize.height,
      isLandscape: data.naturalSize.width > data.naturalSize.height,
    });
  };

  return {
    videoDimensions,
    containerDimensions,
    maxScale,
    handleLayout,
    handleLoad,
  };
}; 