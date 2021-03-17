import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;
  percentage: Observable<any>;
  downloadURL: string;
  snapshot: Observable<any>;
  fileFormat: string

  imageFormats = ["png", "jpg", "jpeg"]
  documentFormats = ["docx", "xls", "xlsx", "pdf", "csv"]

  documentIconPath = "assets/google-docs.svg"

  isImageFile = false
  isDocumentFile = false

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.isDocumentFile = this.verifyIsFileDocs()
    this.isImageFile = this.verifyIsFileImg()
    this.startUpload();
  }

  startUpload() {
    
    const path = `files/${Date.now()}_${this.file.name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db.collection('files').add({ downloadURL: this.downloadURL, path })
      })
    )
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  getFileFormat(file: File) {
    let [, format] = file.name.split('.')
    return format.toLowerCase();
  }

  verifyIsFileImg() {
    const format = this.getFileFormat(this.file)
    console.log('format', format)
    return this.imageFormats.includes(format)
  }

  verifyIsFileDocs() {
    const format = this.getFileFormat(this.file)
    console.log('format', format)
    return this.documentFormats.includes(format)
  }
}
