import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class Feedback implements OnInit {

  isSubmitted = false;
  isLoading = false;
  feedbackForm: any;
  approvedList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(5)]],
      userName: [''] // اختياري
    });
    this.loadApprovedFeedback();
  }

  loadApprovedFeedback() {
    this.feedbackService.getApprovedFeedback().subscribe({
      next: (data: any) => {
        this.approvedList = data;
      },
      error: () => console.log("Error loading approved feedback")
    });
  }

  submitFeedback() {
    if (this.feedbackForm.invalid) return;

    this.isLoading = true;

    this.feedbackService.submitFeedback(this.feedbackForm.value).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.isLoading = false;
        this.feedbackForm.reset();
      },
      error: () => {
        this.isLoading = false;
        alert("❌ حصل خطأ، جرّبي تاني.");
      }
    });
  }
}
