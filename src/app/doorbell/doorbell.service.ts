import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export interface DoorbellConfig {
  url : string,//'https://doorbell.io/api/applications'
  id  : string,//'your id here',
  key : string,//'your key here'
};

export interface DorbellSubmit {
  email        : string,
  message      : string,
  name?        : string
  ip?          : string,
  sentiment?   : 'positive'|'neutral'|'negative',
  tags?        : string|string[],
  properties?  : { [key: string]: string },
  //attachments? : number[], Automatically filled up by the uploader()
  nps?         : number,
  language?    : string
};

export const DoorbellConfigToken = new InjectionToken<DoorbellConfig>('Doorbell configuration token');

@Injectable()
export class DoorbellService {

  constructor(@Inject(DoorbellConfigToken) private config: DoorbellConfig, private http: HttpClient) { }

  /** Used to signal the feedback form has been opened */
  public ring(): Promise<boolean> {

    return this.http.post(`${this.config.url}/${this.config.id}/open`, '', { 
      headers: { 'Content-Type': 'text/html' },
      params: { 'key': this.config.key },
      observe: 'response',
      responseType: 'text' 
     }).toPromise().then( res => {console.log(res); return res.status === 201;} );
  }

  /** Submits a feedback form with optional attachments
   * @param body is the form data content
   * @param files is the optional list of files to attach
   */
  public submit(body: DorbellSubmit, files?: FileList): Promise<boolean> {

    // Uploads the attachement first
    return this.uploader(files).pipe( switchMap( attachments => {

      // Submits the form content including the atachment IDs 
      return this.http.post(`${this.config.url}/${this.config.id}/submit`, 
        { ...body, attachments }, { 
          headers: { 'Content-Type': 'application/json' },
          params: { 'key': this.config.key },
          observe: 'response',
          responseType: 'text' 
        }
      );
    })).toPromise().then( res => res.status === 201 );
  }

  // Helper function to build a multipart/form-data object from the list of file to attach  
  private formData(files: FileList): FormData {

    const formData = new FormData();

    for(let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);
    }

    return formData;
  }

  // Helper function to upload the attachments prior to submit the form
  private uploader(files?: FileList): Observable<[number]|undefined> {

    // Do nothing when no files are there
    if(!files || files.length === 0) { return of(undefined); }

    // Post the attachments
    return this.http.post(`${this.config.url}/${this.config.id}/upload`, 
      this.formData(files), { 
        headers: { 'Accept': 'application/json' }, //'Content-Type': 'multipart/form-data' },
        params: { 'key': this.config.key },
        observe: 'response',
        responseType: 'json' 
      }
    ).pipe(
      catchError( () => of(undefined) ),
      map( res => !!res && res.status === 201 ? res.body as [number] : undefined )
    );
  }
}