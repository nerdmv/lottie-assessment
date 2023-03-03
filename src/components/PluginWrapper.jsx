import { useCallback, useEffect, useRef } from 'react';
import Popup from './Popup';

let pluginIFrame = null;
export default function PluginWrapper({ html, open, onClose }) {
  const wrapper = useRef(null);

  const renderIframe = useCallback(() => {
    if (!wrapper.current) return;
    const iframe = document.createElement('iframe');
    iframe.width = 500;
    iframe.height = 500;
    iframe.allow =
      "camera 'none'; microphone 'none'; display-capture 'none'; clipboard-write 'none'";
    iframe;

    const blob = new Blob([html], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);

    wrapper.current.appendChild(iframe);
    return iframe;
  }, [wrapper.current, html]);

  useEffect(() => {
    if (!open) {
      pluginIFrame?.remove();
      return;
    }

    pluginIFrame = renderIframe();

    return () => {
      pluginIFrame?.remove();
    };
  }, [open]);

  return (
    <Popup show={open} onCancel={() => onClose?.()}>
      <div ref={wrapper}></div>
    </Popup>
  );
}
