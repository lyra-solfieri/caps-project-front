import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  isAdmin = false;
  hasClinicalAccess = false;
  isMenuOpen = false;
  isProfileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.hasClinicalAccess = this.authService.hasAnyRole(['ADMIN', 'MODERATOR', 'EDITOR']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  fecharDropdown() {
    this.isProfileMenuOpen = false;
  }

  logout() {
    this.closeMenu();
    this.fecharDropdown();
    localStorage.removeItem('auth_token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
