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
  const [isSaving, setIsSaving] = useState(false); // Estado para indicar se está salvando
  const router = useRouter();
  const { id } = router.query;
  const [copySuccess, setCopySuccess] = useState<string | null>(null); 
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Referência para o timeout do auto-save

  useEffect(() => {
    if (id) {
      fetch(`/api/codes?id=${id}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((json) => {
          if (json && json[0]) {
            setCode({
              content: json[0].content || '',
              lang: json[0].lang || 'javascript',
              theme: json[0].theme || 'light',
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // Função para salvar o conteúdo no backend
  const saveCode = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/c?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: code.content,
          lang: code.lang,
          theme: code.theme,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${response.statusText}`);
      }
  
      console.log('Auto-salvo com sucesso');
    } catch (error) {
      console.error('Erro ao auto-salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  

  // Debounce para salvar automaticamente após X segundos
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
        saveCode();
      }, 3000);
    }
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}/code/${id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopySuccess('Link copiado!');
        setTimeout(() => setCopySuccess(null), 2000); // Remove a mensagem após 2 segundos
      })
      .catch((err) => {
        console.error('Erro ao copiar para a área de transferência:', err);
        setCopySuccess('Erro ao copiar');
        setTimeout(() => setCopySuccess(null), 2000);
      });
  };

  return (
    <section className={styles.main}>
      <section className={styles.content}>
      {isSaving && <div className={styles.savingIndicator}>Salvando...</div>}
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
                defaultValue={code.lang}
                onChange={(e) => {
                  setCode((prevState) => ({
                    ...prevState,
                    lang: e.target.value,
                  }));
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
                defaultValue={code.theme}
                onChange={(e) => {
                  setCode((prevState) => ({
                    ...prevState,
                    theme: e.target.value,
                  }));
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
            {copySuccess && <span className={styles.copy_success}>{copySuccess}</span>}
      </section>
    </section>
  );
}
