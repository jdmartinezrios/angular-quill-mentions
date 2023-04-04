import { Component, VERSION, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';

import 'quill-mention';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'],
    ],
    mention: {
      mentionListClass: 'ql-mention-list mat-elevation-z8',
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      showDenotationChar: true,
      spaceAfterInsert: true,
      onSelect: (item, insertItem) => {
        const editor = this.editor.quillEditor;
        console.log(item);
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, '', 'user');
      },
      source: (searchTerm, renderList) => {
        const values = [
          { id: 1, value: 'Maria Etura', age: 5 },
          { id: 2, value: 'Juan David Martinez', age: 20 },
        ];

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];

          values.forEach((entry) => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
    },
  };

  content = '';

  constructor() {}

  getText() {
    console.log(this.editor.quillEditor.root.innerHTML);
    console.log(this.editor.quillEditor.getContents());
    const { ops } = this.editor.quillEditor.getContents();
    const result = ops.reduce((acc, { insert }) => {
      if (typeof insert === 'string') {
        acc += insert;
      } else {
        acc += insert.mention.value;
      }

      return acc;
    }, '');

    console.log({ result });
  }
}
