import {useState, useEffect} from 'react';

export default function useWidth(container, defaultWidth = 750) {
  const [containerWidth, setContainerWidth] = useState(defaultWidth);

  const resize = () => setContainerWidth(container.current.offsetWidth);

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return containerWidth;
}
