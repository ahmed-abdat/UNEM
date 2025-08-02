import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
// import Image from '@tiptap/extension-image'



export default function TipTap({ description }) {


  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        heading : false,
      }),
      Heading.configure({
        levels: [1],
        HTMLAttributes: {
          class: "tip-tap-header",
        },
      }),
      Typography.configure(),
      TextAlign.configure({
        defaultAlignment: "right",
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        HTMLAttributes: {
          class: "tip-tap-link",
        },
        autolink: true,
        linkOnPaste : true,
        openOnClick : false,
        }),


        // Image.configure({
        //     inline: true,
        //     allowBase64: true,
        //     HTMLAttributes: {
        //     class: "rounded-md",
        //     },
        // }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "min-h-[150px]",
      },
    },
    // onUpdate: ({ editor }) => {
    //     onChange(JSON.stringify(editor.getJSON()));
    // },
  });





  return (
    <div className="tip-tap">
      <EditorContent editor={editor} />
    </div>
  );
}
