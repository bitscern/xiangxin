import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '相心 (PhysioLogic AI) - 观其面，知其心',
  description: '观其面，知其心；探寻面部纹路下的性格。融合中国传统面相学与现代人工智能。',
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
      <body className="antialiased">{children}</body>
    </html>
  );
}