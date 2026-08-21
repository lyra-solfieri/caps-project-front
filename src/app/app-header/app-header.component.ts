import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
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
    private authService: AuthService,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.hasClinicalAccess = this.authService.hasAnyRole(['ADMIN', 'USER']);
  }

  @HostListener('document:click', ['$event'])
  fecharAoClicarFora(event: Event) {
    const profileContainer = this.eRef.nativeElement.querySelector('.profile-container');
    
    const clicouNoPerfil = profileContainer?.contains(event.target);

    if (this.isProfileMenuOpen && !clicouNoPerfil) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        this.isProfileMenuOpen = false;
      }
  }
  
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
      if (this.isProfileMenuOpen) {
        this.isMenuOpen = false;
      }
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
