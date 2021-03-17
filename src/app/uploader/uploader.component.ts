import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  files: File[] = [
    // new File([], "teste.png", { type: "pdf" })
  ];
  isHovering: boolean

  constructor() { }

  ngOnInit(): void { }

  toggleHover(hoverValue: boolean) {
    this.isHovering = hoverValue;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

}
