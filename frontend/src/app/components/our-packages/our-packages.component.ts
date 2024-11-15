import { Component, OnInit } from '@angular/core';
import { PackageService } from 'src/app/services/package.service';

interface PackageCondition {
  name: string;
  rank: number;
}

@Component({
  selector: 'app-our-packages',
  templateUrl: './our-packages.component.html',
  styleUrls: ['./our-packages.component.scss'],
})
export class OurPackagesComponent implements OnInit {
  packages: any[] = [];
  qualifiedPackages: PackageCondition[] = [];
  hoveredPackage: any = null;

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
      (data) => {
        this.packages = data;
        this.assignPackageRanks();
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  assignPackageRanks() {
    const packagesConditions: PackageCondition[] = [
      { name: 'סיבוב ראשון', rank: 1 },
      { name: 'פינוק קטן', rank: 1 },
      { name: 'התחלה חזקה', rank: 2 },
      { name: 'לילה כולל', rank: 3 },
      { name: 'יום הולדת גיימר', rank: 4 },
    ];

    this.qualifiedPackages = packagesConditions;
  }

  getPackageRank(packageName: string): number {
    const pkg = this.qualifiedPackages.find((p) => p.name === packageName);
    return pkg ? pkg.rank : 0;
  }

  getRankLabel(pkg: any): string {
    const rank = this.getPackageRank(pkg.name);
    switch (rank) {
      case 1:
        return 'בסיסי';
      case 2:
        return 'מתקדם';
      case 3:
        return 'פרימיום';
      case 4:
        return 'יוקרתי';
      default:
        return '';
    }
  }

  getRankClass(pkg: any): string {
    const rank = this.getPackageRank(pkg.name);
    switch (rank) {
      case 1:
        return 'basic';
      case 2:
        return 'advanced';
      case 3:
        return 'premium';
      case 4:
        return 'luxury';
      default:
        return '';
    }
  }
}
