import type { Metadata } from 'next';

import { ResumePlayground } from './ResumePlayground';
import './resume.css';

export const metadata: Metadata = {
  title: '简历编辑器 — 吴帆',
  description: 'MDX 简历编辑器 · 所见即所得 · 一键保存为 PDF',
};

export default function ResumePage() {
  return <ResumePlayground />;
}
