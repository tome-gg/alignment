"use client";

import { BlockTypeSelect, BoldItalicUnderlineToggles, DiffSourceToggleWrapper, MDXEditor, MDXEditorMethods, StrikeThroughSupSubToggles, UndoRedo, diffSourcePlugin, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import React from "react";
import { FC } from "react";

interface EditorProps {
  markdown: string;
  originalContent: string;
  onChange: (value: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  readOnly?: boolean;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const ReactMdxEditor: FC<EditorProps> = ({ markdown, originalContent, editorRef, onChange, readOnly }) => {

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

  const noToolbar = () => (<></>)

  let toolBar = complexToolbar;
  // if (readOnly) {
  //   toolBar = noToolbar
  // }

  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown}
      readOnly={readOnly}
      contentEditableClassName="growth-journal"
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        linkPlugin(),
        thematicBreakPlugin(),
        diffSourcePlugin({  readOnlyDiff: true, diffMarkdown: originalContent, viewMode: 'rich-text' }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: toolBar
        })
      ]}
    />
  );
};

export default ReactMdxEditor;