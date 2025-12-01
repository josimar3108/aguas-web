import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { IncidentsService, Incident } from '../../services/incidents.service';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, HttpClientModule],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent {
  incidents: Incident[] = [];
  filtered: Incident[] = [];

  filterType = '';
  filterSeverity = '';
  searchText = '';

  constructor(private incidentService: IncidentsService) {}

  ngOnInit(): void {
    this.incidents = this.incidentService.getAllLocal();
    this.filtered = [...this.incidents];
  }

  applyFilters(): void {
    this.filtered = this.incidents.filter(incident => {
      const matchType = !this.filterType || incident.type === this.filterType;
      const matchSeverity = !this.filterSeverity || incident.severity === this.filterSeverity;
      const matchSearch = !this.searchText || incident.description.toLowerCase().includes(this.searchText.toLowerCase());
      return matchType && matchSeverity && matchSearch;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterSeverity = '';
    this.searchText = '';
    this.filtered = [...this.incidents];
  }
}
