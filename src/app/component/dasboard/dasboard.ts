import { FamilyComponent } from '../family/family';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FamilyService } from '../../service/family/familyservice';
import { UserService } from '../../service/user/user';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FamilyComponent, RouterLink],
  templateUrl: './dasboard.html'
})
export class DashboardComponent implements OnInit {
  private family = inject(FamilyService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder)

  userName = '';
  showForm = false;
  isEditMode = false;
  editId: string | null = null;

  email: string = '';
  showModal = false;
  modalType: 'add' | 'edit' | 'profile' = 'add';
  role: string = '';
  editMemberId: number | null = null;
  name = '';
  age: number | null = null;
  relation = '';
  isSaving = false;
  confirmMessage = '';
  isLoadingMembers = false;
  errorMsg = '';
  showToast = signal<boolean>(false);
  toastMessage = '';
  members = signal<any[]>([]);
  user: any;
  showConfirmModal = false;
  form = this.fb.group({
    name: [''],
    email: [""]
  });
  confirmAction: (() => void) | null = null;
  ngOnInit(): void {
    console.log(this.email)
    this.loadMembers();
    this.getUserData();
    this.getUserName();
    this.getUserData();
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
  }
  getUserName() {
    this.userService.getUserName()?.subscribe((user: any) => {
      this.userName = user?.name;
      this.email = user?.email;
    });
  }
  loadMembers() {
    this.isLoadingMembers = true;
    this.family.getMembers()
      .then((data) => this.members.set(data))
      .finally(() => this.isLoadingMembers = false);
  }
  openModal() {
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
    this.resetForm();
  }

  updateMember(member?: any, event?: any) {
    this.showForm = true;
    this.isEditMode = true;
    this.editId = member.id;
    this.name = member.name;
    this.age = member.age;
    this.relation = member.relation;
  }

  addMember() {
    if (this.isSaving) return;
    if (!this.name?.trim() || this.age == null || !this.relation?.trim()) {
      this.openToast('Please fill all fields ❌');
      return;
    }
    this.isSaving = true;
    const data = {
      name: this.name.trim(),
      age: Number(this.age),
      relation: this.relation.trim()
    };
    const request =
      this.isEditMode && this.editId
        ? this.family.updateMember(this.editId, data)
        : this.family.addMember(data);
    request
      .then(() => {
        this.loadMembers();
        this.openToast(this.isEditMode ? 'Updated 🎉' : 'Added 🎉');
        this.closeModal();
      })
      .catch(() => this.openToast('Error ❌'))
      .finally(() => (this.isSaving = false));
  }

  confirmDelete(id: string) {
    this.openConfirm('Are you sure you want to delete this member?', () => {
      this.family.deleteMember(id).then(() => {
        this.loadMembers();
        this.openToast('Deleted 🗑️');
      });
    });
  }
  confirmLogout() {
    this.openConfirm('Are you sure you want to log out?', () => {
      this.auth.logout().then(() => {
        this.router.navigate(['/login']);
      });
    });
  }
  openConfirm(message: string, action: () => void) {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }
  closeConfirm() {
    this.showConfirmModal = false;
    this.confirmAction = null;
  }
  confirmYes() {
    if (this.confirmAction) this.confirmAction();
    this.closeConfirm();
  }
  resetForm() {
    this.name = '';
    this.age = null;
    this.relation = '';
    this.isEditMode = false;
    this.editId = null;
        this.showForm = false;
  }
  openToast(message: string) {
    this.toastMessage = message;
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
      // this.hideToast();
    }, 3000);
    // setTimeout(() => this.showToast = false, 3000);
  }
  allowOnlyAlphabets(event: KeyboardEvent) {
    const char = String.fromCharCode(event.keyCode || event.which);
    if (!/^[a-zA-Z ]$/.test(char)) {
      event.preventDefault();
    }
  }
  relationOptions: any[] = [
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Son',
    'Daughter',
    'Husband',
    'Wife',
    'Other'
  ];
  getUserData() {
    this.userService.getUserData()?.then((user: any) => {

      this.user = user;
      this.userName = user?.name;

    });
  }

  enableEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
  }


  async save() {
    console.log(this.userName);
    console.log(this.email);
    
    const data = {
      name: this.name,
      email: this.email
    };
    this.isEditMode = false;
    this.showModal = false;


    await this.userService.updateUserData(data);

    this.openToast('Profile Updated 🎉');
    this.isEditMode = false;
    this.showModal = false;
  }
  closeModel(){
    this.showModal = false
  }
  openAddModal() {
    this.modalType = 'add';
    this.showModal = true;

    this.name = '';
    this.age = null;
    this.relation = '';
  }
  openEditModal(member: any) {
    this.modalType = 'edit';
    this.showModal = true;

    this.editId = member.id;
    this.name = member.name;
    this.age = member.age;
    this.relation = member.relation;
  }
  openProfileModal() {
    this.modalType = 'profile';
    this.showModal = true;
  }

}











