import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { SessionCategory, SessionStatus } from '../../core/models/session.model';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { Instance } from 'flatpickr/dist/types/instance';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss']
})
export class SessionFormComponent implements OnInit, AfterViewInit {
  @ViewChild('dateTimeInput') dateTimeInput!: ElementRef<HTMLInputElement>;
  private flatpickrInstance?: Instance;
  sessionForm: FormGroup;
  isEditMode = false;
  sessionId: string | null = null;
  isLoading = false;
  errorMessage = '';

  categories: SessionCategory[] = ['Formación', 'Reunión', 'Demo', 'Workshop', 'Conferencia'];
  statuses: SessionStatus[] = ['publicado', 'borrador', 'bloqueado', 'oculto'];
  cities: string[] = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];

  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      city: ['', Validators.required],
      dateTime: ['', Validators.required],
      status: ['borrador', Validators.required],
      imageUrl: ['']
    });
  }

  ngAfterViewInit(): void {
    // Inicializar flatpickr
    this.flatpickrInstance = flatpickr(this.dateTimeInput.nativeElement, {
      enableTime: true,
      time_24hr: false,
      dateFormat: 'Y-m-d h:i K',
      locale: Spanish,
      minDate: 'today',
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          const isoDate = selectedDates[0].toISOString();
          this.sessionForm.patchValue({ dateTime: isoDate });
        }
      },
      defaultDate: this.sessionForm.get('dateTime')?.value || null
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode = true;
        this.sessionId = params['id'];
        if (this.sessionId) {
          this.loadSession(this.sessionId);
        }
      }
    });
  }

  loadSession(id: string): void {
    this.sessionService.getSessionById(id).subscribe(session => {
      if (session) {
        const date = new Date(session.dateTime);

        this.sessionForm.patchValue({
          title: session.title,
          description: session.description,
          category: session.category,
          city: session.city,
          dateTime: date.toISOString(),
          status: session.status,
          imageUrl: session.imageUrl || ''
        });

        // Actualizar flatpickr con la fecha cargada
        if (this.flatpickrInstance) {
          this.flatpickrInstance.setDate(date);
        }

        if (session.imageUrl) {
          this.imagePreview = session.imageUrl;
        }
      }
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.sessionForm.patchValue({ imageUrl: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.sessionForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.sessionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const user = this.authService.getCurrentUser();
      const formValue = this.sessionForm.value;

      // Convertir la fecha del input a objeto Date
      const sessionData = {
        ...formValue,
        dateTime: new Date(formValue.dateTime),
        createdBy: user?.email || ''
      };

      if (this.isEditMode && this.sessionId) {
        this.sessionService.updateSession(this.sessionId, sessionData).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            this.errorMessage = 'Error al actualizar la sesión';
            this.isLoading = false;
          }
        });
      } else {
        this.sessionService.createSession(sessionData).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            this.errorMessage = 'Error al crear la sesión';
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
