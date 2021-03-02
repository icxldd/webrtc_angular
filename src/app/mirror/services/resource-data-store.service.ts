import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

export interface IQueryResult<T = any> {
    count?: number;
    offset?: number;
    limit?: number;
    items?: Array<T>;
}


@Injectable()
export class ResourceDataStoreService {

    private uri: string = `${environment.APIServer}/mirror/data`;
    public constructor(
        private httpClient: HttpClient
    ) { }

    public query<T = any>(resource: string, queryParam?: object): Observable<IQueryResult<T>> {
        if (!resource) {
            console.warn(`你在试图Query一个resource为空的数据`);
            return of({});
        }
        queryParam = queryParam || {};
        let pagingQuery: any = queryParam['pagination'];
        // tslint:disable-next-line: no-dynamic-delete
        delete queryParam['pagination'];

        let format: string = 'data';
        if (resource.includes('@')) {
            let [prefix] = resource.split('#');
            format = prefix.split('@')[1];
        }
        let url: string = `${this.uri}/${resource}/query?${pagingQuery}&format=${format}`;

        // 中转source因为filter和sort都需要,这里临时处理一下
        if (!queryParam['filter']) {
            queryParam['filter'] = {};
        }

        if (!queryParam['sort']) {
            queryParam['sort'] = {
                updatedAt: -1
            };
        }


        return this.httpClient.post<IQueryResult>(url, queryParam)
            .pipe(map(res => {
                res['count'] = res['total'];
                return res;
            }));
    }

    public create<T = any>(resource: string, entity: T): Observable<T> {
        let url: string = `${this.uri}/${resource}`;

        return this.httpClient.post<T>(url, entity);
    }


    public get<T = any>(resource: string, id: string): Observable<T> {

        let url: string = `${this.uri}/${resource}/${id}`;

        return this.httpClient.get<T>(url);
    }

    public patch<T = any>(resource: string, id: string, data: any): Observable<T> {
        let patchData: any = {};
        let keys: Array<string> = Object.keys(data).filter(x => ['id', 'tenantId', 'userId', 'createTime', 'rowVersion', 'isDeleted'].indexOf(x) === -1);
        for (let k of keys) {
            // patchData[`data.${k}`] = data[k];
            patchData[k == 'data' ? `data.${k}` : k] = data[k];
        }
        // console.log(1, patchData);
        return this.httpClient.patch<T>(`${this.uri}/${resource}/${id}`, { ['@set']: patchData });
    }


    public delete(resource: string, id: string): Observable<any> {
        return this.httpClient.delete(`${this.uri}/${resource}/${id}`);
    }


}
