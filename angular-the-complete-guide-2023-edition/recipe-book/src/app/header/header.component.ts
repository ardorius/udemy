import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // @Output() featureSelected = new EventEmitter<string>();
  
  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
  }

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }
  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();//need to be added subscribe because we remove it from service
  }
  // onSelect(feature:string){
  //   this.featureSelected.emit(feature);
  // }
}
