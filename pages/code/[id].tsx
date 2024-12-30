import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Editor } from '@monaco-editor/react';
import styles from './code.module.css';
import { Code } from '@/types/Code';
import NoteCodeLogo from '../../src/assets/NoteCodeLogo';
import ShareIcon from '@/assets/Share';
import { langs } from '@/mocks/langs';
import Link from '@/assets/Link';

export default function CodePage() {
  const [code, setCode] = useState<Code>({
    content: '',
    lang: 'html',
    theme: 'light',
  });
  const router = useRouter();
  const { id } = router.query;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/codes/${id}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((json) => {
          if (json) {
            setCode({
              content: json.content || '',
              lang: json.lang || 'javascript',
              theme: json.theme || 'light',
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const saveCode = async (value: string) => {
    try {
      const response = await fetch(`/api/c?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error)
    }
  };

  const saveThemeAndLang = async (theme: string, lang: string) => {
    try {
      const response = await fetch(`/api/c?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme,
          lang: lang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${response.statusText}`);
      }

    } catch (error) {
      console.error(error)
    }
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode((prevState) => ({
        ...prevState,
        content: value,
      }));
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveCode(value);
      }, 2000);
    }
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/code/${id}`;
    navigator.clipboard
      .writeText(link)
  };

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
            onChange={handleContentChange}
          />
          <div className={styles.container_actions}>
            <div className={styles.container_options}>
              <select
                name="language_selector"
                id="language_selector"
                value={code.lang}
                onChange={(e) => {
                  setCode((prevState) => ({
                    ...prevState,
                    lang: e.target.value,
                  }));
                  saveThemeAndLang(code.theme, e.target.value);
                }}
              >
                {langs.map((lang: string) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                name="theme_selector"
                id="theme_selector"
                value={code.theme}
                onChange={(e) => {
                  setCode((prevState) => ({
                    ...prevState,
                    theme: e.target.value,
                  }));
                  saveThemeAndLang(e.target.value, code.lang);
                }}
              >
                <option value="light">Light</option>
                <option value="vs-dark">Dark</option>
              </select>
            </div>
            <button
              className={styles.button_link}
              type="button"
              style={{
                color: code.theme == 'vs-dark' ? '#fff' : '#677489',
              }}
              onClick={copyToClipboard}
            >
              <Link theme={code.theme} />
              .../{id}
            </button>
            <button className={styles.button_share} type="button" disabled>
              <ShareIcon />
              Share
            </button>
          </div>
        </section>
      </section>
    </section>
  );
}
