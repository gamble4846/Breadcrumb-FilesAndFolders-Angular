import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from 'src/app/Services/CommonServices/common-services.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  constructor(public _cs : CommonServicesService) { }

  ngOnInit(): void {
  }
}
