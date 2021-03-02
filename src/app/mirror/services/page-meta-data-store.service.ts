import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { IQueryResult, ResourceDataStoreService } from './resource-data-store.service';

@Injectable()
export class PageMetaDataStoreService {

    private uri: string = `${environment.APIServer}/mirror/data/system_page`;
    public constructor(
        private httpClient: HttpClient,
        private storeSrv: ResourceDataStoreService
    ) { }

    public getMetaData(key: string): Observable<any> {
        let queryParam: any = {
            filter: { ['data.key']: { ['@eq']: key } }
        };
        return this.httpClient.post(`${this.uri}/query?format=data`, queryParam)
            .pipe(map(res => res['items'][0] || {}));
    }

    public getAll(): Observable<IQueryResult> {
        return this.storeSrv.query('system_page', {
            pagination: `limit=9999999`
        });
    }

    public delete(id: string): Observable<any> {
        return this.storeSrv.delete('system_page', id);
    }

}
