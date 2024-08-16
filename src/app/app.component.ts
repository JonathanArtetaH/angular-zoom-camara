import {
  Component,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;

  private videoTrack: MediaStreamTrack;
  zoomAvailable: boolean = false;
  zoomMin: number;
  zoomMax: number;

  constructor(@Inject(PLATFORM_ID) private _platform: Object) {}

  onStart() { 
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((ms: MediaStream) => {
          const _video = this.video.nativeElement;
          _video.srcObject = ms;
          _video.play();
          this.videoTrack = ms.getVideoTracks()[0];
          console.log(this.videoTrack.getSettings())
        }); 
    } 
  }
  onZoomChange() {
    if (this.zoomAvailable) {
      this.videoTrack.applyConstraints({
        advanced: [{ zoom: 200 }],
      }); 
    } else {
      console.log('Zoom no disponible en este dispositivo');
    }
  }

  ngOnDestroy() {
    if (this.videoTrack) {
      this.videoTrack.stop();
    }
  }
}