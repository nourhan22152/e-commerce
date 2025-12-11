import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../services/feedback';

@Component({
  selector: 'app-feedbackdashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedbackdashboard.html',
  styleUrls: ['./feedbackdashboard.css']
})
export class FeedbackDashboardComponent implements OnInit {

  feedbackList: any[] = [];
  isLoading = true;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit() {
    this.loadAllFeedback();
  }

  loadAllFeedback() {
    this.isLoading = true;

    this.feedbackService.getAllFeedback().subscribe({
      next: (data: any) => {
        this.feedbackList = data;
        this.isLoading = false;
      },
      error: () => {
        alert("Error loading feedback");
        this.isLoading = false;
      }
    });
  }

  approve(id: string) {
    this.feedbackService.approveFeedback(id).subscribe({
      next: () => {
        alert("تم قبول الفيدباك ✔");
        this.loadAllFeedback(); // تحميل القائمة تاني بعد التحديث
      },
      error: () => alert("❌ فشل في قبول الفيدباك")
    });
  }
}
