import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../service/user/user';

@Component({
  selector: 'app-alldepartment',
  standalone: true,
  imports: [],
  templateUrl: './alldepartment.html',
  styleUrl: './alldepartment.css',
})

export class AllDepartment {

  firestore = inject(Firestore);
  user = inject(UserService);
  router = inject(Router);
  item: any;
  allDepartments = signal<any[]>([]);
  userService: any;
  email: any;
  departments = signal<any[]>([]);
  filteredDepartments = signal<any[]>([]);
  users: any[] = [];
  username = '';
  selectedCategory = '';
  theme: 'light' | 'dark' = 'light';
  menuItems = [
    { label: 'Home', link: '#' },
    { label: 'About', link: '#' },
    { label: 'People', link: '#' },
    { label: 'Research', link: '#' },
    { label: 'Academic', link: '#' },
    { label: 'Events', link: '#' },
    { label: 'Achievements', link: '#' },
    { label: 'Career', link: '#' },
  ];

  categories = [
    'Faculty',
    'Staff',
    'Post Doc',
    'PHD',
    'MSC',
    'B.TECH',
    'Visitor',
    'Alumini'
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.className = this.theme;
  }

  loadDepartments() {
    this.user.getUserDataDepartment()?.then((res: any) => {
      this.users = res;
      this.allDepartments.set(res);
      this.departments.set(res);
      this.filteredDepartments.set(res);

    });
  }

  loadUsers(): void {
    this.user.getUser().subscribe({
      next: (data) => {
        this.userService = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getUserName() {
    this.user.getUserName()?.subscribe((user: any) => {
      this.email = user?.email;
    });
  }

  openUser(id: number) {
    this.router.navigate(['/user', id]);
  }

  onCategoryChange(category: string) {

    if (!category) {
      this.departments.set(this.allDepartments());
      return;
    }

    const filtered = this.allDepartments().filter(
      item => item.category === category
    );

    this.departments.set(filtered);
  }
}
