import Head from 'next/head';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
  favicon?: string;
};

const Layout = ({
  children,
  title = 'ChatGPT Clone - Ollama + Gemma',
  description = 'A ChatGPT-style chat application powered by Ollama and Gemma',
  favicon = '/img/logo.png'
}: Props) => (
  <div className="font-basier-circle">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href={favicon} />
    </Head>
    <div className="h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  </div>
);

export default Layout;
