import { Component, OnInit } from '@angular/core';
import { PackageService } from "src/app/services/package.service";

@Component({
  selector: 'app-our-packages',
  templateUrl: './our-packages.component.html',
  styleUrls: ['./our-packages.component.scss']
})

export class OurPackagesComponent implements OnInit {
  packages: any[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit() {
    this.loadAllPackages();
  }

  handleImageError(event: Event) {
    console.error('Image load error:', event);
    const target = event.target as HTMLImageElement;
    target.src = '/assets/default-image.jpg'; // תמונה ברירת מחדל אם התמונה לא נטענת
  }

  loadAllPackages() {
    this.packageService.getAllPackages().subscribe(
      data => {
        this.packages = data;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
