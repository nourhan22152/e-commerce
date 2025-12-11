import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixPath',
  standalone: true
})
export class FixPathPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return "";  // 👈 مهم جدًا
    return value.replace(/\\/g, '/');
  }
}
