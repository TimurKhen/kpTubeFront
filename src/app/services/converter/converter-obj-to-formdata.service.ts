import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConverterObjToFormdataService {
  objectToFormData(obj: any): FormData {
    const formData = new FormData()
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] !== 'object' || obj[key] === null) {
          formData.append(key, obj[key])
        } else {
          formData.append(key, JSON.stringify(obj[key]))
        }
      }
    }
    return formData
  }
}
