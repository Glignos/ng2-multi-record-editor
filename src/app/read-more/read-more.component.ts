import { Component,ElementRef, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnChanges {
    @Input() text: JSON;
    @Input() maxLength: number = 100;
    currentText: string;
    hideToggle: boolean = true;
    public isCollapsed: boolean = true;

    constructor(private elementRef: ElementRef) {

    }
    toggleView() {
        this.isCollapsed = !this.isCollapsed;
        this.determineView();
    }
    determineView() {
        let stringed_text = JSON.stringify(this.text);  
        if (stringed_text.length <= this.maxLength) {
            this.isCollapsed = false;
            this.hideToggle = true;
            return;
        }
        this.hideToggle = false;

    }
    ngOnChanges() {
        this.determineView();       
    }
}
