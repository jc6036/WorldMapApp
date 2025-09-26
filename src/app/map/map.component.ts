import { Component, Renderer2, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MapSVGService } from '../map-svg.service';
import { MapDataAPIService } from '../map-data-api.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent implements AfterViewChecked {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  mapData: SafeHtml;

  countryName: string = '';
  countryCapital: string = '';
  countryRegion: string = '';
  incomeLevel: string = '';
  longitude: string = '';
  latitude: string = '';

  countryID: string = '';

  constructor(
    private mapLoader: MapSVGService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private mapAPIReader: MapDataAPIService,
  ) {
    this.mapData = '';
  }

  eventsWired = false;
  
  ngOnInit() {
    // Bypass DOM sanitization because it is sanitizing SVG tags despite having no inner script tags, and this is a trusted file/service
    this.mapLoader.getMap().subscribe(svg => this.mapData = this.sanitizer.bypassSecurityTrustHtml(svg));
  }

  // Grab dynamically rendered DOM elements ONCE after confirmed rendered, with a flag ensuring it only executes once
  // We will then attach event listeners to them post-render
  ngAfterViewChecked() {    
    if (this.mapContainer && this.mapData && !this.eventsWired) {
      const svgElement = this.mapContainer.nativeElement.querySelector('svg');

      if (svgElement) {
        this.attachClickListeners(svgElement);
        this.eventsWired = true;
      }
    }
  }

  // Our listener attach method called on each <path> element in the SVG
  attachClickListeners(svg: SVGElement) {
    const children = svg.querySelectorAll('*');

    children.forEach(child => {
      this.renderer.listen(child, 'click', (event) => {
        this.getCountryData(child.id);
        // console.log('Clicked:', child.id);
      });
    });
  }

  // Retrieve XML data from API service and assign to our databound variables for display
  getCountryData(countryID: string) {
    this.mapAPIReader.getCountryData(countryID).subscribe(data => this.assignCountryData(data));    
  }

  assignCountryData(apiData: string) {
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(apiData, 'application/xml');

    this.countryName = xmlData.getElementsByTagName('wb:name')[0].textContent??'';
    this.countryCapital = xmlData.getElementsByTagName('wb:capitalCity')[0].textContent??'';
    this.countryRegion = xmlData.getElementsByTagName('wb:region')[0].textContent??'';
    this.incomeLevel = xmlData.getElementsByTagName('wb:incomeLevel')[0].textContent??'';
    this.longitude = xmlData.getElementsByTagName('wb:longitude')[0].textContent??'';
    this.latitude = xmlData.getElementsByTagName('wb:latitude')[0].textContent??'';
  }
}
