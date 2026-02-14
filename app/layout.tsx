// Added React import to satisfy TypeScript namespace requirements for ReactNode.
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '相心 - 观其面，知其心',
  description: '融合传统相学与 AI 的面部分析应用',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}