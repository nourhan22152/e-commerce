import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:4000/categories/api';

  // getAll() {
  //   return this.http.get(this.baseUrl);
  // }

  getAll() {
  return this.http.get<{ success: boolean, data: any[] }>(this.baseUrl);
}


  getById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(data: any, imageFile: File) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.post(this.baseUrl, formData);
  }


  update(id: string, data: any, imageFile?: File) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
