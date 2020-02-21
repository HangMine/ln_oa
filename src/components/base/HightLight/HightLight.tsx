import React, { FC, useEffect, useRef } from 'react';

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './HightLight.scss'

type HightLightProps = {
  content: string,
  [any: string]: any,
}

const HightLight: FC<HightLightProps> = ({ content, ...otherProps }) => {
  const code: any = useRef(null);
  useEffect(() => {
    hljs.highlightBlock(code.current);
  }, [content])
  return (
    <>
      <pre className="h-hight-light" {...otherProps}>
        <code ref={code} className="json">
          {content}
        </code>
      </pre>
    </>
  )
}

export default HightLight;