import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-photo',
  templateUrl: './card-photo.component.html',
  styleUrls: ['./card-photo.component.scss'],
})
export class CardPhotoComponent implements OnInit {
  @Input() photoUrl: string;
  loading: boolean;
  errorImage = '../../../assets/no-found.png';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loading = true;
    this.http.get(this.photoUrl, { responseType: 'blob' }).subscribe(
      () => {},
      () => {}
    );
  }

  onPhotoLoad() {
    this.loading = false;
  }

  onPhotoError() {
    this.photoUrl = this.errorImage;
    this.loading = false;
  }
}
