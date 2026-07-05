import { Component, effect, inject, input, signal } from '@angular/core';
import { Reviews } from '../../Core/Services/reviews';
import { Alerts } from '../../Core/Services/alerts';
import { Subscription } from 'rxjs';
import { Cart } from '../../Core/Services/cart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-rev',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-rev.html',
  styleUrl: './my-rev.css',
})
export class MyRev {// حقن السيرفيس الخاصة بك والـ Alerts
  private reviewService = inject(Reviews);
  private alerts = inject(Alerts);
  private subs = new Subscription();

  // الـ Signals الخاصة بحالة الصفحة والداتا
  readonly myReviewsList = signal<any[]>([]);
  readonly isLoading = signal<boolean>(true);

  // سجنالز الخاصة بفورم التعديل
  readonly userRating = signal<number>(0);
  readonly userComment = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly currentReviewId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReviews();
  }

  // 1. جلب كل مراجعاتي باستخدام الدالة الجديدة لـ الـ API 🚀
  loadReviews(): void {
    this.isLoading.set(true);
    this.subs.add(
      this.reviewService.getMyRev().subscribe({
        next: (data) => {
          console.log(data);
          
          this.myReviewsList.set(data.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.alerts.showError('Failed to load your reviews.');
          this.isLoading.set(false);
        }
      })
    );
  }

  // 2. حفظ التعديل (عند الضغط على Update Review)
  submitUpdate(): void {
    if (this.userRating() === 0 || !this.userComment().trim()) {
      this.alerts.showWarning('Please provide a rating and a comment.');
      return;
    }

    this.isSubmitting.set(true);

    const reviewBody = {
      rating: this.userRating(),
      comment: this.userComment().trim()
    };

    if (this.isEditing() && this.currentReviewId()) {
    
      this.subs.add(
        this.reviewService.editeRev(this.currentReviewId()!, reviewBody).subscribe({
          next: () => {
            this.alerts.showSuccess('Review updated successfully.');
            this.resetForm();
            this.loadReviews();
          },
          error: () => this.isSubmitting.set(false)
        })
      );
    }
  }

  
  onEditClick(review: any): void {
    this.isEditing.set(true);
    this.currentReviewId.set(review.id);
    this.userRating.set(review.rating);
    this.userComment.set(review.comment);
    
  }

  onDeleteClick(reviewId: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.subs.add(
        this.reviewService.deleteRev(reviewId).subscribe({
          next: () => {
            this.alerts.showSuccess('Review deleted successfully.');
            // حذف العنصر محلياً فوراً لتحديث الـ UI في نفس اللحظة
            this.myReviewsList.update(list => list.filter(r => r.id !== reviewId));
            
            // لو اليوزر بيحذف الريفيو اللي هو فاتحه في التعديل حالياً، صفر الفورم
            if (this.currentReviewId() === reviewId) {
              this.resetForm();
            }
          }
        })
      );
    }
  }

  resetForm(): void {
    this.userRating.set(0);
    this.userComment.set('');
    this.isEditing.set(false);
    this.currentReviewId.set(null);
    this.isSubmitting.set(false);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
