import { UserService } from '../../service/user/user';
import { ActivatedRoute } from '@angular/router';
import { Component, signal, inject } from '@angular/core';

@Component({
  selector: 'app-user-detail-component',
  imports: [],
  templateUrl: './user-detail-component.html',
  styleUrl: './user-detail-component.css',
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private userservice = inject(UserService);

  item: any;

  user = signal<any | null>(null);
  userId = '';
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

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    const data = await this.userservice.getUserById(this.userId);
    this.user.set(data);

  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.className = this.theme;
  }
}












