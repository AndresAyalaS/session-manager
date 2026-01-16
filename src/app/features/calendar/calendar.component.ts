import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { SessionService } from '../../core/services/session.service';
import { Session, SessionCategory, SessionStatus } from '../../core/models/session.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  });

  sessions: Session[] = [];
  filteredSessions: Session[] = [];

  selectedCategory: SessionCategory | '' = '';
  selectedStatus: SessionStatus | '' = '';
  searchTerm = '';

  categories: SessionCategory[] = ['Formación', 'Reunión', 'Demo', 'Workshop', 'Conferencia'];
  statuses: SessionStatus[] = ['publicado', 'borrador', 'bloqueado', 'oculto'];

  selectedSession: Session | null = null;
  showSessionDetail = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredSessions = this.sessions.filter(session => {
      const categoryMatch = !this.selectedCategory || session.category === this.selectedCategory;
      const statusMatch = !this.selectedStatus || session.status === this.selectedStatus;
      const searchMatch = !this.searchTerm ||
        session.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return categoryMatch && statusMatch && searchMatch;
    });

    this.updateCalendarEvents();
  }

  updateCalendarEvents(): void {
    const events: EventInput[] = this.filteredSessions.map(session => ({
      id: session.id,
      title: session.title,
      start: session.dateTime,
      backgroundColor: this.getEventColor(session.category),
      borderColor: this.getEventColor(session.category),
      extendedProps: {
        session: session
      }
    }));

    this.calendarOptions.update(options => ({
      ...options,
      events: events
    }));
  }

  getEventColor(category: SessionCategory): string {
    const colors: Record<SessionCategory, string> = {
      'Formación': '#3498db',
      'Reunión': '#9b59b6',
      'Demo': '#e74c3c',
      'Workshop': '#f39c12',
      'Conferencia': '#1abc9c'
    };
    return colors[category] || '#95a5a6';
  }

  handleEventClick(clickInfo: any): void {
    this.selectedSession = clickInfo.event.extendedProps.session;
    this.showSessionDetail = true;
  }

  closeSessionDetail(): void {
    this.showSessionDetail = false;
    this.selectedSession = null;
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.searchTerm = '';
    this.applyFilters();
  }
}
