import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Category = 'artists' | 'albums' | 'tracks' | 'radio' | 'video'

@Injectable({
    providedIn: 'root',
})
export class SearchHardDiskService {

    // Observable string sources
    private changedCategorySource = new Subject<Category>();

    // Observable string streams
    changedCategory$ = this.changedCategorySource.asObservable();

    // Service message commands
    changeCategory(category: Category) {
        this.changedCategorySource.next(category);
    }
}