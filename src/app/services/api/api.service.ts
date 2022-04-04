import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Tipster } from 'src/app/shared/tipster';
import { Test } from 'src/app/shared/test';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getTipster(id: Number){
    let headers: HttpHeaders = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    headers.set('Access-Control-Allow-Headers', 'Authorizarion');
    headers.set('Access-Control-Allow-Methods', 'OPTIONS,GET');
    headers.set('Authorization', 'eyJraWQiOiJzWEh5TGs5MG9cL1BIdDN2b2ltY2NcL0hMdzNXZ1pYSkJwcFF3Um9sQlJxMlk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmZGM2NDgyMC0yZTRkLTRlOTctYmJiNi1iMTIwZjY0Y2JmN2UiLCJhdWQiOiJzdmZjY3RnZ244ZHZvcTQxYmlocWE0cDA4IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiOWNhMmU4ZDMtMWRlMC00MzM3LTllMTItZjdmOWNiNzliMDVkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODA4NTUxMDIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX2ZKWlltWXhvTyIsImNvZ25pdG86dXNlcm5hbWUiOiJmZGM2NDgyMC0yZTRkLTRlOTctYmJiNi1iMTIwZjY0Y2JmN2UiLCJleHAiOjE1ODA4NTg3MDMsImlhdCI6MTU4MDg1NTEwMywiZW1haWwiOiJqb3NpdG9rZXN3aWNrQGdvb2dsZW1haWwuY29tIn0.d_WgQNZ4S_0o45ws0Jroo3gNg9fPI0EK0n9r9Jkvv1CX9JvY0XY-1Lt8vJa03vJmp8sm9_GRvecD52e99WuYt-Nc67tbfP-PdiUYQUsLbNGyfRqDUI-3VE5wzcsMi3ITRymvLuT8F32JG6L5ZdkQ2aqdnoq8gLp12hPo8_Wvf8HHGheVyPZevQ78LMtlhh9FDSP1TDp7yy4l9MkWT_UEVkyirpfjLhmOYvU9cPJUXgY4URQ-4QkIafuvZWFnD46wr4_2FsA-A_aZXDfZ5XtBj61Q2JZV-IfJfxMGDXdVGBvTlbmEY_m9aUvh0x1nYO_x6eucsT4gG57zxTR0hR_mfw');
    return this.http.get<Test>('https://fnkh4v5lnb.execute-api.eu-west-2.amazonaws.com/desa/tipsters/f8540b2f-c74c-4431-ad7b-300bb9b0a00d',
    {
      headers
    })
      .subscribe(data => console.log(data));
  }

  postTipster(tipster: Tipster){
    let payload ={
        id: tipster.uuidValue,
        name: tipster.name,
        bank: tipster.totalBank,
        valuePerUnit: tipster.valuePerUnit,
        currency: tipster.currency,
        bookie: tipster.lastBookiePlayed
    }
    this.http.post('https://fnkh4v5lnb.execute-api.eu-west-2.amazonaws.com/desa/tipsters', payload)
      .subscribe(data => console.log(data));
  }
}
