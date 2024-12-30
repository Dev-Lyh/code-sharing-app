import React, { useState } from 'react';
import styles from './code.module.css';
import { useRouter } from 'next/router';
import { Code } from '@/types/Code';
import { Editor } from '@monaco-editor/react';
import NoteCodeLogo from '../../src/assets/NoteCodeLogo';
import { langs } from '@/mocks/langs';
import ShareIcon from '@/assets/Share';

export default function CodePage() {
  const router = useRouter()
  const [code, setCode] = useState<Code>({
    content: `<html>
    <head>
    <title>HTML Sample</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
      h1 {
        color: #CCA3A3;
      }
    </style>
    <script type="text/javascript">
      alert("I am a sample... visit devChallengs.io for more projects");
    </script>
  </head>
  <body>
    <h1>Heading No.1</h1>
    <input disabled type="button" value="Click me" />
  </body>
</html>`,
    lang: 'html',
    theme: 'light',
  });

  function handleCreate() {
    fetch(`/api/codes`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(code)
    }).then(res => res.json()).then(json => router.push(`/code/${json.id}`)).catch(err => console.error(err))
  }

  return (
    <section className={styles.main}>
      <section className={styles.content}>
        <header className={styles.header}>
          <NoteCodeLogo />
          <h1>Create & Share</h1>
          <h2>Your Code easily</h2>
        </header>
        <section className={styles.editor_container}>
          <Editor
            language={code.lang}
            value={code.content}
            theme={code.theme}
            className={styles.editor}
            onChange={(value) => {
              if (value !== undefined) {
                setCode((prevState) => ({
                  ...prevState,
                  content: value,
                }));
              }
            }}
          />
          <div className={styles.container_actions}>
            <div className={styles.container_options}>
              <select
                name="language_selector"
                id="language_selector"
                defaultValue={code.lang}
                onChange={(e) => {
                  if (e !== undefined) {
                    setCode((prevState) => ({
                      ...prevState,
                      lang: e.target.value,
                    }));
                  }
                }}
              >
                {langs.map((lang: string) => (
                  <option value={lang} key={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
              <select
                name="theme_selector"
                id="theme_selector"
                defaultValue={code.theme}
                onChange={(e) => {
                  if (e !== undefined) {
                    setCode((prevState) => ({
                      ...prevState,
                      theme: e.target.value,
                    }));
                  }
                }}
              >
                <option value="light">Light</option>
                <option value="vs-dark">Dark</option>
              </select>
            </div>
            <button
              className={styles.button_share}
              type="button"
              onClick={handleCreate}
            >
              <ShareIcon />
              Share
            </button>
          </div>
        </section>
      </section>
    </section>
  );
}
