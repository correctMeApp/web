'use client';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

export default function Privacy() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/privacy.html')
      .then(response => response.text())
      .then(data => setHtml(data));
  }, []);

  return (
    <section className="mb-32 bg-slate-900">
      <div className="p-4 ml-4">
        {parse(html)}
      </div>
    </section>
  );
}