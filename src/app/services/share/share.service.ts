// services/share-service/share.service.ts
import { Injectable } from '@angular/core';
import { VideoInterface } from '../../interfaces/video/video';
import { PathConverterPipe } from '../../pipes/path-converter/path-converter.pipe';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private pathConverter = new PathConverterPipe();

  constructor() {}

  shareVideo(video: VideoInterface | undefined, videoId: string): void {
    if (!video) return;

    const baseUrl = this.getBaseUrl();
    const videoUrl = this.getVideoUrl(videoId);
    const previewUrl = this.getPreviewUrl(video.preview, baseUrl);

    this.updateMetaTags(video, videoUrl, previewUrl);
    this.performShare(video, videoUrl);
  }

  private getBaseUrl(): string {
    return window.location.origin;
  }

  private getVideoUrl(videoId: string): string {
    return `${this.getBaseUrl()}/video/${videoId}`;
  }

  private getPreviewUrl(preview: string | undefined, baseUrl: string): string {
    if (preview) {
      return `${baseUrl}${this.pathConverter.transform(preview)}`;
    }
    // Используем логотип как превью по умолчанию
    return `${baseUrl}/public/logo.svg`;
  }

  private updateMetaTags(video: VideoInterface, videoUrl: string, previewUrl: string): void {
    const metaTags = this.generateMetaTags(video, videoUrl, previewUrl);

    // Обновляем существующие или создаем новые мета-теги
    const metaProperties = [
      'og:title', 'og:type', 'og:url', 'og:image', 'og:description',
      'og:site_name', 'og:image:width', 'og:image:height', 'og:image:type',
    ];

    metaProperties.forEach(property => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      const newMeta = metaTags.querySelector(`meta[property="${property}"]`);

      if (newMeta) {
        const content = newMeta.getAttribute('content');
        if (content) {
          if (meta) {
            meta.setAttribute('content', content);
          } else {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            meta.setAttribute('content', content);
            document.head.appendChild(meta);
          }
        }
      }
    });
  }

  private generateMetaTags(video: VideoInterface, videoUrl: string, previewUrl: string): HTMLElement {
    const div = document.createElement('div');

    const imageType = previewUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';

    div.innerHTML = `
      <meta property="og:title" content="${this.escapeHtml(video.name || 'Видео')}" />
      <meta property="og:type" content="video.other" />
      <meta property="og:url" content="${videoUrl}" />
      <meta property="og:image" content="${previewUrl}" />
      <meta property="og:description" content="${this.escapeHtml(video.description || 'Посмотрите это видео на нашем сайте')}" />
      <meta property="og:site_name" content="${this.escapeHtml(this.getAppName())}" />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta property="og:image:type" content="${imageType}" />
    `;
    return div;
  }

  private async performShare(video: VideoInterface, videoUrl: string): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.name,
          text: video.description,
          url: videoUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
        this.fallbackShare(videoUrl);
      }
    } else {
      this.fallbackShare(videoUrl);
    }
  }

  private async fallbackShare(videoUrl: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(videoUrl);
    } catch (error) {
      console.log('Error sharing:', error)
    }
  }

  private getAppName(): string {
    return 'KPTube';
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
