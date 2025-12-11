import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private api = 'http://localhost:4000/api/feedback';

  constructor(private http: HttpClient) { }

  submitFeedback(data: any) {
    return this.http.post(this.api, data);
  }

  approveFeedback(id: string) {
    return this.http.put(this.api + '/approve/' + id, {});
  }

  getApprovedFeedback() {
    return this.http.get(this.api + '/approved');
  }


  getAllFeedback() {
    return this.http.get(this.api);
  }
}
