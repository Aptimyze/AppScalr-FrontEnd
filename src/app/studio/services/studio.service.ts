import { Injectable, Input, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { UiElement } from "../models/UiElement.model";
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDrag,
  CdkDropList,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { cloneDeep } from "lodash";

@Injectable({ providedIn: "root" })
export class StudioService {
  @Input() elements: UiElement[];
  uiNotifier$ = new Subject<UiElement>();
  answers: UiElement[] = [];

  //right sidebar-show
  myBool$: Observable<boolean>;
  private boolSubject = new Subject<boolean>();

  constructor(private httpClient: HttpClient) {
    this.myBool$ = this.boolSubject.asObservable();
  }
  setRunning = (value: boolean) => {
    this.boolSubject.next(value);
  };

  set myBool(newValue) {
    this.myBool$ = newValue;
    this.boolSubject.next(newValue);
  }

  // observer
  notifyComponentsOfElementDrag(el: UiElement) {
    this.uiNotifier$.next(el);
  }

  // observable
  subscribeToUiNotifier() {
    return this.uiNotifier$.asObservable();
  }

  createCopy(origin) {
    return JSON.parse(JSON.stringify(origin));
  }

  /* method n°1 */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const answerCopy = this.createCopy(this.answers[event.currentIndex]);
      this.answers[event.currentIndex] = answerCopy;
      console.log(answerCopy);
    }
  }

  /* method n°2 */
  onTalkDrop(event: CdkDragDrop<Element[]>) {
    console.log(event);
    if (event.previousContainer !== event.container) {
      // Clone the item that was dropped.
      const clone = cloneDeep(
        event.previousContainer.data[event.previousIndex]
      );
      // Add the clone to the new array.
      event.container.data.splice(event.currentIndex, 0, clone);
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /*** DETECT AND NOTIFY WHEN ELEMENT OF CENTER LAYOUT IS CHANGED
   * Detects change and notify right sidebar of the element passing all its data for display and change
  ***/

  elementClickedNotifier$ = new Subject<UiElement>();
  elementChangedNotifier$ = new Subject<UiElement>();
  elementSelectedNotifier$ = new Subject<UiElement>();

  domSavedNotifier$ = new Subject<ElementRef>();


  domSavedNotify() {
    return this.domSavedNotifier$.asObservable();
  }

  elementClickedNotify() {
     return this.elementClickedNotifier$.asObservable();
   }

   elementChangeNotify() {
    return this.elementChangedNotifier$.asObservable();
   }
   elementSelectedNotify() {
    return this.elementSelectedNotifier$.asObservable();
   }

   notifyOfDomSaved(dom:ElementRef) {
     console.log('Dom saved',dom);
     this.domSavedNotifier$.next(dom);

   }

   notifyOfElementClicked(el: UiElement) {
     console.log('subject fired', el)
     this.elementClickedNotifier$.next(el);
   }

   notifyOfElementChanged(el: UiElement) {
    console.log('subject fired', el)
    this.elementChangedNotifier$.next(el);
  }

  notifyOfElementSelected(el: UiElement) {
    console.log('subject Selected', el)
    this.elementSelectedNotifier$.next(el);
  }



}
