import { useWindowSize } from 'react-use';
import CameraView from '../components/Fullcam/CameraView';
import DesktopWarning from '../components/Fullcam/DesktopWarning';

export default function FullcamPage() {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  if (!isMobile) {
    return <DesktopWarning />;
  }

  return <CameraView />;
}