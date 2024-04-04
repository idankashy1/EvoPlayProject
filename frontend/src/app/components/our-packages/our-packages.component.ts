import { Component, OnInit } from '@angular/core';
import { PackageService } from "src/app/services/package.service";

@Component({
  selector: 'app-our-packages', // Replace with your selector
  templateUrl: './our-packages.component.html',
  styleUrls: ['./our-packages.component.scss']
})

export class OurPackagesComponent implements OnInit {
  packages: any[] = [];

  constructor(private packageService: PackageService) {}

  ngOnInit() {
    this.loadAllPackages();
  }
  handleImageError(event: ErrorEvent) {
    console.error('Image load error:', event);
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
