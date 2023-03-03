import { fabric } from 'fabric';
import { BsCircle } from 'react-icons/bs';
import { RxText } from 'react-icons/rx';
import { BiRectangle, BiImage } from 'react-icons/bi';
import { AiOutlineLine } from 'react-icons/ai';

export default class EditorApi {
  editor = null;
  constructor(editorInstance) {
    this.editor = editorInstance;
  }

  addImageFromUpload = () => {
    const input = document.createElement('input');
    input.className = 'hidden';
    input.type = 'file';
    input.multiple = false;
    input.addEventListener('change', (event) => {
      const imgUrl = URL.createObjectURL(event.target.files[0]);
      this.addImageFromURL(imgUrl);
      input.remove();
    });
    input.click();
    document.body.appendChild(input);
  };

  addImageFromURL = (imgUrl) => {
    fabric.Image.fromURL(imgUrl, (oImg) => {
      this.editor.canvas.add(oImg);
    });
  };

  addRectangle = () => {
    this.editor.addRectangle();
  };

  addText = (text = 'Type something..') => {
    this.editor.addText(text);
  };

  addCircle = () => {
    console.log('this', this, this.editor);
    this.editor.addCircle();
  };

  addLine = () => {
    this.editor.addLine();
  };

  getEditorButtons = () => {
    return [
      {
        title: 'Circle',
        editorFunc: () => this.addCircle(),
        Icon: BsCircle,
      },
      {
        title: 'Rectangle',
        editorFunc: () => this.addRectangle(),
        Icon: BiRectangle,
      },
      {
        title: 'Line',
        editorFunc: () => this.addLine(),
        Icon: AiOutlineLine,
      },
      {
        title: 'Image',
        editorFunc: () => this.addImageFromUpload(),
        Icon: BiImage,
      },
      {
        title: 'Text',
        editorFunc: () => this.addText(),
        Icon: RxText,
      },
    ];
  };
}
