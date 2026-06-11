import { useState, useEffect } from 'react';
import CameraView from '../components/Fullcam/CameraView';
import DesktopWarning from '../components/Fullcam/DesktopWarning';

export default function FullcamPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return <DesktopWarning />;
  }

  return <CameraView />;
}