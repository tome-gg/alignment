"use client";

import { BlockTypeSelect, BoldItalicUnderlineToggles, DiffSourceToggleWrapper, MDXEditor, MDXEditorMethods, StrikeThroughSupSubToggles, UndoRedo, diffSourcePlugin, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import React from "react";
import { FC } from "react";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const ReactMdxEditor: FC<EditorProps> = ({ markdown, editorRef }) => {

  const complexToolbar = () => (
    <>
      {' '}
      <BlockTypeSelect />
      <StrikeThroughSupSubToggles />
      <BoldItalicUnderlineToggles />
      <DiffSourceToggleWrapper>
        <UndoRedo />
      </DiffSourceToggleWrapper>
    </>
  );

  const simpleToolbar = () => (
    <>
      {' '}
      <BlockTypeSelect />
      <BoldItalicUnderlineToggles />
    </>
  );

  return (
    <MDXEditor
      onChange={(e) => console.log(e)}
      ref={editorRef}
      markdown={markdown}
      contentEditableClassName="growth-journal"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        linkPlugin(),
        thematicBreakPlugin(),
        diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: complexToolbar
        })
      ]}
    />
  );
};

export default ReactMdxEditor;