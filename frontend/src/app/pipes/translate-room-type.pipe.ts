import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateRoomType'
})
export class TranslateRoomTypePipe implements PipeTransform {

  transform(value: string): string {
    const translations: { [key: string]: string } = {
      'PS5': 'PlayStation 5',
      'PS5VIP': 'PlayStation 5 VIP',
      'VR': 'Virtual Reality',
      'Racing Simulation': 'Racing Simulation'
    };
    return translations[value] || value;
  }
}
