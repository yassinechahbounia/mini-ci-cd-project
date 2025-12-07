import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, User } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  users: User[] = [];
  newUser: User = { username: '', email: '' };

  editingUserId: number | null = null;  // <-- ajout

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe((users) => (this.users = users));
  }

  startEdit(user: User): void {          // <-- ajout
    this.editingUserId = user.id ?? null;
    this.newUser = { username: user.username, email: user.email };
  }

  cancelEdit(): void {                   // <-- ajout
    this.editingUserId = null;
    this.newUser = { username: '', email: '' };
  }

  save(): void {                         // <-- ajout
    if (this.editingUserId != null) {
      // update
      this.userService.update(this.editingUserId, this.newUser).subscribe(() => {
        this.cancelEdit();
        this.loadUsers();
      });
    } else {
      // create
      this.userService.create(this.newUser).subscribe(() => {
        this.newUser = { username: '', email: '' };
        this.loadUsers();
      });
    }
  }

  addUser(): void {                      // <-- tu peux supprimer cette méthode
    this.save();                         // ou la remplacer par un simple appel à save()
  }

  deleteUser(id: number | undefined): void {
    if (!id) {
      return;
    }
    this.userService.delete(id).subscribe(() => this.loadUsers());
  }
}
