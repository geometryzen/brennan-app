import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Category = 'artists' | 'albums' | 'tracks' | 'radio' | 'video'

@Injectable({
    providedIn: 'root',
})
export class SearchHardDiskService {

    private changedCategorySource = new Subject<Category>();

    changedCategory$ = this.changedCategorySource.asObservable();

    changeCategory(category: Category) {
        this.changedCategorySource.next(category);
    }
}