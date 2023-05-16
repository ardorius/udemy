import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.services';
import { LoadingService } from '../loading/loading.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit() {
    this.reloadCoures();
  }

  reloadCoures(){
 // 14. Reactive Component Interaction using Custom Observables and Behavior Subject
    // this.loadingService.loadingOn();

    const courses$ = this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)) //,
      // finalize(() => this.loadingService.loadingOff())
    );
    // 15. Loading Indication Service - Reactive Implementation Finished
    const loadCourses$ = this.loadingService.showLoaderUnitCompleted(courses$);

    // courses$.subscribe(val => console.log(val));

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(courses => courses.category == "BEGINNER"))
    )
    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(courses => courses.category == "ADVANCED"))
    );

  }





}




