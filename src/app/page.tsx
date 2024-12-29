'use client';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import styles from './page.module.css';
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState();
  return (
    <section className={styles.main}>
    </section>
  );
}
