import {Component, OnInit} from '@angular/core';
import {User} from './models/user';
import {UserService} from './services/user.service';
import {Subject} from 'rxjs';
import { AuthService } from '../login/auth.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})


export class HomeComponent {
    title = 'Users';
    cache = {
        users: [],
        selectedUser: [],
    };

    users: User[] = [];
    search: Subject<string> = new Subject<string>();
    selectedUser: User = new User();
    loadingFollowers: boolean = false;

    constructor(private userService: UserService, public authService: AuthService) {

		if (localStorage.getItem('isLoggedIn')) {
			localStorage.setItem('isLoggedIn', 'false');
			console.log(localStorage.getItem('isLoggedIn'));
		}
		this.userService.getUsers().subscribe(res => {
            this.cache.users = res;
			console.log(res);
            this.users = res;
        }, error => {
            console.log(error);
        });
        this.search.debounceTime(200).distinctUntilChanged().subscribe((searchTerm) => {


            this.userService.search(searchTerm).subscribe(res => {

                this.users = res.items as User[];
            });
        });
    }


    onSearch(q: string) {

        if (q !== '') {
            this.search.next(q);
        } else {

            this.users = this.cache.users;
        }

    }

    go(s: string) {

        if (s == 'home') {

            this.selectedUser = new User();
            this.users = this.cache.users;
        }
    }

    viewUser(user: User) {

        this.selectedUser = user;

        let userInCache: User = this.findUserInCache(user);
        if (userInCache) {
            this.selectedUser = userInCache;
        } else {
            this.loadingFollowers = true;

            this.userService.getUserFollowers(user.login).subscribe(res => {
                this.selectedUser.followers = res as User[];

                this.cacheSelectUser(this.selectedUser);

                this.loadingFollowers = false;

            }, err => {
                console.log(err);
                this.loadingFollowers = false;
            });

        }


    }



    cacheSelectUser(user: User) {
        if (!this.findUserInCache(user)) {
            this.cache.selectedUser.push(user);
        }

    }

    /**

     * @param user
     * @returns {boolean}
     */
    findUserInCache(user: User): User {

        for (var i = 0; i < this.cache.selectedUser.length; i++) {
            if (this.cache.selectedUser[i].login == user.login) {
                return this.cache.selectedUser[i];
            }
        }

        return null;
    }
}

