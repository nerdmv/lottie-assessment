import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { RiPlug2Fill } from 'react-icons/ri';
import { SwatchesPicker } from 'react-color';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditorApi from '../lib/EditorApi';
import PluginWrapper from './PluginWrapper';

export default function FabricEditor() {
  const { selectedObjects, editor, onReady } = useFabricJSEditor();
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    (async function fetechPlugins() {
      const resp = await fetch('/plugins.json').then((res) => res.json());
      setPlugins(resp.plugins);
    })();
  }, []);

  const getEditorApi = useCallback(() => {
    if (!editor) return null;
    return new EditorApi(editor);
  }, [editor]);

  const editorApi = useMemo(() => {
    return getEditorApi();
  }, [getEditorApi]);

  const editorButtons = useMemo(() => {
    if (!editorApi) return [];
    return editorApi.getEditorButtons();
  }, [editorApi]);

  function changeColor({ hex }) {
    selectedObjects.forEach((item) => {
      item.set('fill', hex);
      item.set('stroke', hex);
      item.render(editor.canvas.getContext());
    });
  }

  function handleKeys(event) {
    const key = event.keyCode || event.charCode;
    if (key == 8 || key == 46) {
      editor.canvas.remove(editor.canvas.getActiveObject());
    }
  }

  useEffect(() => {
    if (!editorApi) return;
    function handleMessage(rawEvent) {
      if (!rawEvent.data || !rawEvent.data.includes('editor:')) return;
      try {
        const data = JSON.parse(rawEvent.data);
        const func = data.event.substring(data.event.indexOf(':') + 1);
        if (!editorApi[func]) return;

        editorApi[func](...(data.params || []));

        if (data.closePlugin) {
          closePlugin();
        }
      } catch (error) {
        console.error('[Invalid Message]: ', error);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [editorApi]);

  const [openPlugin, setOpenPlugin] = useState(false);
  const [pluginHtml, setPluginHtml] = useState(false);

  function closePlugin() {
    setOpenPlugin(false);
    setPluginHtml('');
  }
  async function initAndShowPlugin(plugin) {
    const resp = await fetch(plugin.path).then((res) => res.text());
    setPluginHtml(resp);
    setOpenPlugin(true);
  }

  return (
    <div className='flex justify-center pt-6 bg-gray-50 h-screen'>
      <div className='flex flex-col h-[calc(100vh-100px)]'>
        {editorButtons.map(({ title, editorFunc, Icon }) => {
          return (
            <button
              key={title}
              className='p-2 hover:scale-125 transition-transform duration-300'
              title={title}
              onClick={editorFunc}
            >
              <Icon size={25} />
            </button>
          );
        })}
        <div className='flex-1'></div>
        <hr className='' />
        <div className='flex flex-col'>
          <button title='Add Plugins' className='p-2'>
            <RiPlug2Fill size='25' />
          </button>
          {plugins.map((plugin) => {
            return (
              <button
                key={plugin.id}
                onClick={() => initAndShowPlugin(plugin)}
                title='Plugins'
                className='p-2 hover:scale-125 transition-transform duration-300'
              >
                <img src={plugin.icon} height={25} width={25} />
              </button>
            );
          })}
        </div>
      </div>
      <div
        tabIndex={1000}
        onKeyDown={handleKeys}
        className='outline-0 max-w-[1000px] w-[80%] h-[calc(100vh-100px)]'
      >
        <FabricJSCanvas
          className='border border-black bg-dots h-full w-full'
          onReady={onReady}
        />
      </div>
      <div tabIndex={1000} onKeyDown={handleKeys}>
        <SwatchesPicker width={70} height="" className="h-[calc(100vh-100px)] overflow-y-auto" onChange={changeColor} />
      </div>
      <PluginWrapper html={pluginHtml} open={openPlugin} onClose={closePlugin}></PluginWrapper>
    </div>
  );
}
