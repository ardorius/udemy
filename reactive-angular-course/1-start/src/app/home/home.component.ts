import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.services';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;


  constructor(
    private coursesService: CoursesService
  ) {

  }

  ngOnInit() {
    this.reloadCoures();
  }

  reloadCoures(){

    const courses$ = this.coursesService.loadAllCourses()
    .pipe(
      map(courses => courses.sort(sortCoursesBySeqNo))
    );

    // courses$.subscribe(val => console.log(val));

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses.filter(courses => courses.category == "BEGINNER"))
    )
    this.advancedCourses$ = courses$.pipe(
      map(courses => courses.filter(courses => courses.category == "ADVANCED"))
    );

  }





}



