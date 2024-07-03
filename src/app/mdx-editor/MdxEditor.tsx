'use client'
import dynamic from 'next/dynamic'

// This is the only place InitializedMDXEditor is imported directly.
const MdxEditor = dynamic(() => import('./MdxReactEditor'), {
  // Make sure we turn SSR off
  ssr: false
})

export default MdxEditor;