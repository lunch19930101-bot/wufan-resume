import type { Metadata } from 'next';

import { PdfViewer } from './PdfViewer';

export const metadata: Metadata = {
  title: '作品集 PDF · 吴帆',
  description: '吴帆作品集 2025——49 页完整版在线查看，左缩略图右展示，含下载入口。',
};

export default function PdfViewerPage() {
  return <PdfViewer />;
}
